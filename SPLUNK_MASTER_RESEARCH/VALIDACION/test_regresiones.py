#!/usr/bin/env python3
"""Regresiones offline con contraejemplos en memoria; no servicios ni archivos temporales."""
from copy import deepcopy
from pathlib import Path
import unittest
from unittest.mock import patch

from offline_core import (action_decision, api_decision, auth_groups, bucket,
                          classify_retry, confusion_label, cumulative, epoch,
                          network_totals, replay_ledger, theory_pass, ti_matches,
                          valid_indicators, normalize_fixture)
from comprobar_corpus import (ROOT, csv_rows, preservation, read_json, safe_file,
                              semantic_regressions, verify_bank, verify_package)


class TimeAndEvidence(unittest.TestCase):
    def test_distinct_hours_and_days_do_not_merge(self):
        values = ['2026-10-15T09:01:00Z','2026-10-15T10:01:00Z','2026-10-16T09:01:00Z']
        self.assertEqual(len({bucket(v) for v in values}),3)

    def test_offset_and_utc_describe_same_instant(self):
        self.assertEqual(bucket('2026-10-16T11:01:00+02:00'),bucket('2026-10-16T09:01:00Z'))

    def test_bucket_boundary_exclusive(self):
        self.assertEqual(bucket('2026-10-16T09:15:00Z')-bucket('2026-10-16T09:14:59Z'),900)

    def test_naive_time_is_rejected(self):
        with self.assertRaises(ValueError):
            epoch('2026-10-16T09:00:00')

    def test_real_fixture_b01_b05_split(self):
        rows=csv_rows(ROOT/'SPLUNK_LECCIONES_R08_R09/PRACTICAS/fixtures/auth_activity.csv')
        groups=auth_groups(rows,'event_time_utc','status','failure')
        self.assertEqual(groups[('198.51.100.44',bucket('2026-10-16T11:00:00Z'))],(4,1,0))
        self.assertEqual(groups[('198.51.100.44',bucket('2026-10-16T11:15:00Z'))],(1,1,0))

    def test_late_event_changes_only_available_snapshot(self):
        rows=csv_rows(ROOT/'SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/auth_activity.csv')
        args=('event_time_utc','EventCode','4625')
        early=auth_groups(rows,*args,'indexed_at_utc','2026-10-15T09:16:00Z')
        late=auth_groups(rows,*args)
        key=('198.51.100.23',bucket('2026-10-15T09:00:00Z'))
        self.assertEqual(early[key],(6,6,0)); self.assertEqual(late[key],(7,6,0))

    def test_snapshot_excludes_exact_cutoff(self):
        row={'event_id':'X','event_time_utc':'2026-10-16T09:00:00Z',
             'indexed_at_utc':'2026-10-16T09:16:00Z','EventCode':'4625','src':'s','user':'u'}
        self.assertEqual(auth_groups([row],'event_time_utc','EventCode','4625',
                                    'indexed_at_utc','2026-10-16T09:16:00Z'),{})

    def test_missing_user_is_not_an_identity(self):
        rows=[{'id':str(i),'t':'2026-10-16T09:00:00Z','status':'failure',
               'src':'s','user':user} for i,user in enumerate(['alice','alice','',' '])]
        self.assertEqual(list(auth_groups(rows,'t','status','failure').values()),[(4,1,2)])

    def test_duplicate_ids_are_rejected(self):
        row={'id':'X','t':'2026-10-16T09:00:00Z','status':'failure','src':'s','user':'a'}
        with self.assertRaises(ValueError):
            auth_groups([row,row],'t','status','failure')

    def test_cumulative_uses_entity_time_and_tie_break(self):
        rows=[{'id':'b','t':'2026-10-16T09:00:00Z','src':'one'},
              {'id':'c','t':'2026-10-16T09:01:00Z','src':'two'},
              {'id':'a','t':'2026-10-16T09:00:00Z','src':'one'}]
        self.assertEqual(cumulative(rows,'t','id','src'),[('a',1),('b',2),('c',1)])

    def test_unknown_is_never_tn_or_fn(self):
        for truth in ['inconclusive','suspicious_unconfirmed','unknown','']:
            for matched in (False,True):
                self.assertEqual(confusion_label(truth,matched),'not_evaluable')

    def test_confusion_requires_explicit_ground_truth(self):
        self.assertEqual(confusion_label('attack_confirmed',True),'TP')
        self.assertEqual(confusion_label('attack_confirmed',False),'FN')
        self.assertEqual(confusion_label('benign_documented',True),'FP')
        self.assertEqual(confusion_label('benign_documented',False),'TN')


class NetworkAndTI(unittest.TestCase):
    def setUp(self):
        root=ROOT/'SPLUNK_LECCIONES_R08_R09/PRACTICAS/fixtures'
        self.flows=csv_rows(root/'net_egress.csv')
        self.indicators=csv_rows(root/'ti_indicators.csv')

    def test_additional_backup_flow_is_included(self):
        self.assertEqual(network_totals(self.flows)[('backup-01','203.0.113.10')],865000000)

    def test_finance_destinations_remain_distinct(self):
        actual=network_totals(self.flows)
        self.assertEqual(actual[('finance-07','203.0.113.99')],190000000)
        self.assertEqual(actual[('finance-07','203.0.113.20')],20000000)

    def test_negative_volume_is_rejected(self):
        with self.assertRaises(ValueError):
            network_totals([{'src':'a','dest':'b','bytes_out':'-1'}])

    def test_ti_matches_original_column_names(self):
        self.assertEqual(ti_matches(self.flows,self.indicators,'2026-10-16T12:00:00Z'),
                         [('N01','I03'),('N02','I01'),('N04','I03')])

    def test_expiration_is_exclusive(self):
        row=self.indicators[0]
        self.assertEqual(valid_indicators([row],row['expires_at_utc']+'T00:00:00Z'),[])

    def test_first_seen_is_inclusive(self):
        row=self.indicators[0]
        self.assertEqual(valid_indicators([row],row['first_seen_utc']+'T00:00:00Z'),[row])

    def test_future_indicator_is_not_current(self):
        row=deepcopy(self.indicators[0]);row['first_seen_utc']='2026-10-20'
        self.assertEqual(valid_indicators([row],'2026-10-16T12:00:00Z'),[])

    def test_bad_dates_do_not_claim_validity(self):
        row=deepcopy(self.indicators[0]);row['expires_at_utc']='not-a-date'
        self.assertEqual(valid_indicators([row],'2026-10-16T12:00:00Z'),[])

    def test_duplicate_observable_does_not_silently_choose_source(self):
        rows=self.indicators+[dict(self.indicators[0],indicator_id='I04')]
        with self.assertRaises(ValueError):
            ti_matches(self.flows,rows,'2026-10-16T12:00:00Z')

    def test_tgs_mapping_uses_fixture_id_and_native_named_model_fields(self):
        p=ROOT/'SPLUNK_LECCIONES_R08_R09'
        contract=next(d for d in read_json(p/'VALIDACION/DATASETS.json')['datasets']
                      if d['file'].endswith('tgs_requests.csv'))
        fields=normalize_fixture(csv_rows(p/contract['file'])[0],contract)
        self.assertEqual(fields['EventCode'],'4769');self.assertEqual(fields['fixture_id'],'K01')
        self.assertEqual(fields['ServiceName'],'web');self.assertEqual(fields['TicketEncryptionType'],'0x17')
        self.assertIsInstance(fields['_time'],int)

    def test_historical_index_time_stays_synthetic(self):
        p=ROOT/'SPLUNK_LECCIONES_R06_R07'
        contract=next(d for d in read_json(p/'VALIDACION/DATASETS.json')['datasets']
                      if d['file'].endswith('auth_activity.csv'))
        fields=normalize_fixture(csv_rows(p/contract['file'])[-1],contract)
        self.assertNotIn('_indextime',fields)
        self.assertEqual(fields['fixture_index_epoch']-fields['_time'],1200)

    def test_ti_mapping_does_not_invent_confidence_score(self):
        p=ROOT/'SPLUNK_LECCIONES_R08_R09'
        contract=next(d for d in read_json(p/'VALIDACION/DATASETS.json')['datasets']
                      if d['file'].endswith('ti_indicators.csv'))
        fields=normalize_fixture(self.indicators[0],contract)
        self.assertIn('confidence_note',fields);self.assertNotIn('confidence',fields)
        self.assertEqual(fields['value'],'203.0.113.99')


class PoliciesAndLedger(unittest.TestCase):
    def setUp(self):
        self.r=ROOT/'SPLUNK_LECCIONES_R10_R11/PRACTICAS/fixtures'

    def test_api_derives_decisions_from_inputs(self):
        for row in csv_rows(self.r/'api_job_lifecycle.csv'):
            self.assertEqual(api_decision(row),row['expected_decision'])

    def test_api_rejects_unbounded_negative_or_oversize(self):
        row=csv_rows(self.r/'api_job_lifecycle.csv')[0]
        for n in ('0','-1','101'):
            self.assertEqual(api_decision(dict(row,result_request_count=n)),'reject_unlimited')

    def test_api_does_not_trust_expected_decision_label(self):
        row=csv_rows(self.r/'api_job_lifecycle.csv')[0]
        row.update(requester_role='unauthorized',expected_decision='read_within_role')
        self.assertEqual(api_decision(row),'deny_access')

    def test_approval_does_not_replace_missing_context(self):
        rows=csv_rows(self.r/'soar_actions.csv')
        self.assertEqual(action_decision(rows[2]),'needs_impact_and_expiry_checks')
        self.assertEqual(action_decision(rows[1]),'deny')

    def test_replay_does_not_create_second_effect(self):
        rows=csv_rows(self.r/'automation_runs.csv')
        ledger,effects=replay_ledger(rows)
        self.assertEqual(len(ledger),6);self.assertEqual(len(effects),1)

    def test_replay_without_effect_is_rejected(self):
        row=csv_rows(self.r/'automation_runs.csv')[1]
        with self.assertRaises(ValueError):
            replay_ledger([row])

    def test_second_applied_effect_is_rejected(self):
        row=csv_rows(self.r/'automation_runs.csv')[0]
        with self.assertRaises(ValueError):
            replay_ledger([row,row])

    def test_unknown_cannot_be_blindly_applied(self):
        row=csv_rows(self.r/'automation_runs.csv')[2]
        with self.assertRaises(ValueError):
            replay_ledger([row,dict(row,status='applied')])

    def test_retry_distinguishes_read_mutation_and_permanent(self):
        self.assertEqual(classify_retry('mutating','unknown'),'reconcile')
        self.assertEqual(classify_retry('read','transient'),'bounded_retry')
        self.assertEqual(classify_retry('mutating','forbidden'),'stop')
        self.assertEqual(classify_retry('read','invalid'),'stop')

    def test_theory_exact_threshold_not_rounded_up(self):
        self.assertTrue(theory_pass(4,5));self.assertFalse(theory_pass(3,5))
        self.assertTrue(theory_pass(2,2));self.assertFalse(theory_pass(1,2))
        self.assertFalse(theory_pass(79,99));self.assertFalse(theory_pass(0,0))


class EditorialAndIntegrity(unittest.TestCase):
    def setUp(self):
        self.package=ROOT/'SPLUNK_LECCIONES_R01_R03'
        self.bank=read_json(next((self.package/'ACTIVIDADES').glob('BANCO*.json')))
        self.texts={p.stem:p.read_text() for p in self.package.glob('R*/SP-R*-L*.md')}
        self.sol=(self.package/'ACTIVIDADES/SOLUCIONARIO.md').read_text()
        self.sources=(self.package/'VALIDACION/FUENTES_Y_LIMITES.md').read_text()

    def test_synchronized_bank(self):
        verify_bank(self.bank,self.texts,self.sol,self.sources)

    def test_editorial_sync_is_idempotent(self):
        from sincronizar_editorial import prepare
        for file,text in prepare().items():
            self.assertEqual(file.read_text(),text,str(file))

    def test_position_and_length_rules_do_not_approach_theory_pass(self):
        from collections import Counter
        acts=[a for p in ROOT.glob('SPLUNK_LECCIONES_*') for a in
              read_json(next((p/'ACTIVIDADES').glob('BANCO*.json')))['activities']
              if a['type']=='multiple_choice']
        self.assertEqual(Counter(a['correct_index'] for a in acts),{0:40,1:40,2:40,3:40})
        for region in {a['region_id'] for a in acts}:
            qs=[a for a in acts if a['region_id']==region]
            for choose in (min,max):
                guessed=sum(choose(range(4),key=lambda i:len(a['options'][i]))==a['correct_index'] for a in qs)
                self.assertLessEqual(guessed,len(qs)/2)

    def test_wrong_answer_index_is_detected(self):
        bank=deepcopy(self.bank);bank['activities'][0]['correct_index']=(bank['activities'][0]['correct_index']+1)%4
        with self.assertRaises(ValueError):
            verify_bank(bank,self.texts,self.sol,self.sources)

    def test_missing_distractor_in_md_is_detected(self):
        a=self.bank['activities'][0];texts=dict(self.texts)
        texts[a['lesson_id']]=texts[a['lesson_id']].replace(a['options'][0],'texto cambiado')
        with self.assertRaises(ValueError):
            verify_bank(self.bank,texts,self.sol,self.sources)

    def test_open_auto_grade_is_rejected(self):
        bank=deepcopy(self.bank);next(a for a in bank['activities'] if a['type']=='open_practice')['auto_gradable']=True
        with self.assertRaises(ValueError):
            verify_bank(bank,self.texts,self.sol,self.sources)

    def test_duplicate_activity_is_rejected(self):
        bank=deepcopy(self.bank);bank['activities'].append(bank['activities'][0])
        with self.assertRaises(ValueError):
            verify_bank(bank,self.texts,self.sol,self.sources)

    def test_changed_solution_is_detected(self):
        a=self.bank['activities'][0]
        with self.assertRaises(ValueError):
            verify_bank(self.bank,self.texts,self.sol.replace(a['explanation'],'error intencional'),self.sources)

    def test_outside_package_reference_is_rejected(self):
        with self.assertRaises(ValueError):
            safe_file(self.package,'../03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json')

    def test_all_original_ids_and_protected_files(self):
        result=preservation()
        self.assertEqual(result['original_activity_ids_preserved'],240)

    def test_semantic_corrections_against_fixtures(self):
        self.assertTrue(semantic_regressions().startswith('PASS'))

    def test_old_850mb_solution_is_rejected_in_memory(self):
        target=ROOT/'SPLUNK_LECCIONES_R08_R09/ACTIVIDADES/BANCO_ACTIVIDADES_R08_R09.json'
        original=Path.read_text
        def altered(file,*args,**kwargs):
            text=original(file,*args,**kwargs)
            return text.replace('865 MB','850 MB') if file==target else text
        with patch.object(Path,'read_text',altered), self.assertRaises(ValueError):
            semantic_regressions()

    def test_old_v2_create_endpoint_is_rejected_in_memory(self):
        target=ROOT/'SPLUNK_LECCIONES_R10_R11/R11_AUTOMATIZACION_SOAR/SP-R11-L02.md'
        original=Path.read_text
        def altered(file,*args,**kwargs):
            text=original(file,*args,**kwargs)
            return text.replace('POST https://splunk.example.test:8089/services/search/jobs',
                                'POST https://splunk.example.test:8089/services/search/v2/jobs') if file==target else text
        with patch.object(Path,'read_text',altered), self.assertRaises(ValueError):
            semantic_regressions()

    def test_mismatched_manifest_hash_is_rejected_in_memory(self):
        import comprobar_corpus
        original=comprobar_corpus.sha
        def bad(file):
            return '0'*64 if file.name.startswith('BANCO') else original(file)
        with patch.object(comprobar_corpus,'sha',bad), self.assertRaises(ValueError):
            verify_package(self.package,run_fixtures=False)


if __name__=='__main__':
    unittest.main(verbosity=2)
