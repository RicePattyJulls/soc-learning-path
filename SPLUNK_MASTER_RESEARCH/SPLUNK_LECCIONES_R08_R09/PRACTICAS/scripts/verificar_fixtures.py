#!/usr/bin/env python3
"""Offline-only deterministic checks. Does not run SPL, ES, SOAR or network."""
import csv, collections, ipaddress, sys
from pathlib import Path
from datetime import date
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'VALIDACION'))
from offline_core import auth_groups,bucket,network_totals,valid_indicators,ti_matches
root=Path(__file__).resolve().parents[2]
fixtures=root/'PRACTICAS'/'fixtures'
def read(name):
    with (fixtures/name).open(newline='',encoding='utf-8') as f:return list(csv.DictReader(f))

tgs=read('tgs_requests.csv'); assert len(tgs)==16
assert len({r['id'] for r in tgs})==16 and {r['event_id'] for r in tgs}=={'4769'}
stats=collections.defaultdict(list)
for r in tgs:stats[r['user']].append(r)
def tc(user):
    rows=stats[user];return len(rows),len({r['service'] for r in rows})
assert tc('temp.user')==(6,6)
assert tc('svc-backup')==(5,1)
assert tc('audit.user')==(4,4)
assert tc('helpdesk.user')==(1,1)
assert {r['encryption'] for r in stats['temp.user']}=={'0x17'}
assert {r['encryption'] for r in stats['audit.user']}=={'0x12'}
assert stats['helpdesk.user'][0]['encryption']==''
assert [u for u in stats if tc(u)[0]>=5 and tc(u)[1]>=4]==['temp.user']
rep=read('replication_events.csv');assert len(rep)==8
assert {r['event_id'] for r in rep}=={'4662'}
assert sum(r['authorization_context']=='unlisted' for r in rep)==3
assert sum(r['authorization_context'].startswith('approved') for r in rep)==5
assert {r['src'] for r in rep if r['authorization_context']=='unlisted'}=={'WKST-17'}
auth=read('auth_activity.csv');assert len(auth)==12
fa=collections.defaultdict(list)
for r in auth:
    if r['status']=='failure':fa[r['src']].append(r)
assert len(fa['198.51.100.33'])==6 and len({r['user'] for r in fa['198.51.100.33']})==6
assert len(fa['198.51.100.44'])==5 and len({r['user'] for r in fa['198.51.100.44']})==1
assert sum(r['status']=='success' for r in auth)==1
by_time=auth_groups(auth,'event_time_utc','status','failure')
assert by_time[('198.51.100.44',bucket('2026-10-16T11:00:00Z'))][:2]==(4,1)
assert by_time[('198.51.100.44',bucket('2026-10-16T11:15:00Z'))][:2]==(1,1)
net=read('net_egress.csv'); assert len(net)==4
net_sum=collections.Counter()
for r in net: net_sum[r['src']]+=int(r['bytes_out'])
assert net_sum=={'backup-01':865000000,'finance-07':210000000}
assert network_totals(net)=={('backup-01','203.0.113.10'):865000000,
                            ('finance-07','203.0.113.99'):190000000,
                            ('finance-07','203.0.113.20'):20000000}
f=read('synthetic_es_findings.csv');assert len(f)==8
scores=collections.Counter(); n=collections.Counter()
for r in f:
    scores[r['entity']]+=int(r['risk_points']);n[r['entity']]+=1
assert scores=={'alice':75,'svc-backup':36,'bob':22,'charlie':15,'sys-rproxy':20}
assert n=={'alice':3,'svc-backup':2,'bob':1,'charlie':1,'sys-rproxy':1}
assert {k for k,v in scores.items() if v>=60}=={'alice'}
assert sum(x['finding_type']=='finding' for x in f)==3
ind=read('ti_indicators.csv');assert len(ind)==3
at=date.fromisoformat('2026-10-16')
assert {r['indicator_id'] for r in valid_indicators(ind,'2026-10-16T12:00:00Z')}=={'I01','I03'}
assert ti_matches(net,ind,'2026-10-16T12:00:00Z')==[('N01','I03'),('N02','I01'),('N04','I03')]
for r in ind:assert not ipaddress.ip_address(r['value']).is_global, 'Use only documentation IP addresses'
for dataset in [tgs,rep,auth,net,f,ind]:
    for r in dataset:
        assert r and all(v is not None for v in r.values())
print('PASS OFFLINE — 6 CSV, Kerberos 16, replication 8, auth 12, net 4, ES 8, TI 3. NO SPL ejecutado.')
