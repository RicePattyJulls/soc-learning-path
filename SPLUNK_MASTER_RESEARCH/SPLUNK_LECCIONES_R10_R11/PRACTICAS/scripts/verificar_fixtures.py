#!/usr/bin/env python3
"""Deterministic offline calculations; no network / no Splunk / no SOAR."""
from pathlib import Path
import csv, math, collections, ipaddress, sys
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'VALIDACION'))
from offline_core import api_decision,action_decision,replay_ledger,classify_retry
P=Path(__file__).resolve().parents[1]/'fixtures'
def data(name):
 with (P/name).open(newline='',encoding='utf-8') as f: return list(csv.DictReader(f))
r=data('retention_plan.csv');assert len(r)==4
calc={x['index']:float(x['capacity_gib'])/float(x['daily_gib']) for x in r}
assert math.isclose(calc['auth_training'],160/12)
assert calc['endpoint_training']==90.0 and calc['netflow_training']==20.0 and calc['audit_training']==120.0
insufficient={x['index'] for x in r if calc[x['index']]<float(x['target_days'])}
assert insufficient=={'auth_training','netflow_training'}
ing=data('ingestion_diagnosis.csv'); assert len(ing)==4
assert next(x for x in ing if x['host']=='DC02')['max_indextime_lag_s']=='1800'
assert next(x for x in ing if x['host']=='DC03')['search_access']=='denied'
assert next(x for x in ing if x['host']=='APP01')['duplicate_factor']=='2'
jobs=data('search_jobs.csv');assert len(jobs)==3
J={x['variant']:x for x in jobs}
assert J['A']['output_hash']==J['B']['output_hash'] != J['C']['output_hash']
assert J['A']['result_count']==J['B']['result_count']!=J['C']['result_count']
assert math.isclose(1-int(J['B']['scan_count'])/int(J['A']['scan_count']),.88)
assert math.isclose(1-float(J['B']['elapsed_sec'])/float(J['A']['elapsed_sec']),5/6)
api=data('api_job_lifecycle.csv'); assert len(api)==4
assert {x['expected_decision'] for x in api}=={'read_within_role','report_expired','deny_access','reject_unlimited'}
assert next(x for x in api if x['case_id']=='API04')['result_request_count']=='0'
assert all(api_decision(row)==row['expected_decision'] for row in api)
actions=data('soar_actions.csv');assert len(actions)==5
assert {x['action_id'] for x in actions if x['approved']=='no'}=={'ACT02','ACT04'}
assert next(x for x in actions if x['action_id']=='ACT03')['decision']=='needs_impact_and_expiry_checks'
assert all(action_decision(row)==row['decision'] for row in actions)
for x in actions:
 if x['target'][0].isdigit(): assert not ipaddress.ip_address(x['target']).is_global
runs=data('automation_runs.csv'); assert len(runs)==8
assert {x['status'] for x in runs}=={'applied','replay','unknown','forbidden','transient','complete','pending','invalid'}
by=collections.defaultdict(list)
for row in runs:by[row['idempotency_key']].append(row)
assert len(by)==6 and any({x['status'] for x in group}=={'applied','replay'} for group in by.values())
assert sum(x['status']=='applied' for x in runs)==1
assert {x['idempotency_key'] for x in runs if x['status']=='unknown'}=={'BLOCK|198.51.100.77|APR-2'}
ledger,effects=replay_ledger(runs)
assert len(ledger)==6 and effects=={'BLOCK|203.0.113.15|APR-1'}
assert classify_retry('mutating','unknown')=='reconcile'
assert classify_retry('mutating','forbidden')=='stop'
assert classify_retry('read','transient')=='bounded_retry'
print('PASS FIXTURES — 6 CSV; retencion 2 de 4 insuficientes (modelo simple); casos ingesta, Job Inspector simulado, REST, SOAR e idempotencia. SIN EJECUTAR Splunk/SOAR.')
