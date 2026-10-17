#!/usr/bin/env python3
"""Pruebas de cifras ilustrativas sobre fixtures offline, NO emula el motor SPL."""
import csv, collections, sys
from pathlib import Path
from datetime import datetime,timezone
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'VALIDACION'))
from offline_core import cumulative
base=Path(__file__).resolve().parents[1]/'fixtures'
def read(name):
 with (base/name).open(newline='',encoding='utf-8') as f:return list(csv.DictReader(f))
a=read('auth_events.csv')
assert len(a)==12,len(a)
fail=[x for x in a if x['action']=='failure']
assert len(fail)==10,len(fail)
def bucket(t):
 dt=datetime.fromisoformat(t.replace('Z','+00:00'))
 return dt.strftime('%Y-%m-%dT%H:')+f'{(dt.minute//15)*15:02d}:00Z'
agg=collections.defaultdict(list)
for e in fail:agg[(e['src'],bucket(e['_time']))].append(e)
key=('203.0.113.9','2026-10-16T09:00:00Z');first=agg[key]
assert len(first)==7
assert len({e['user'] for e in first if e['user']})==5
assert len([e for e in first if not e['user']])==1
assert len(agg[('203.0.113.9','2026-10-16T09:15:00Z')])==2
assert len([x for x in fail if x['src']=='203.0.113.9'])==9
assert len({x['user'] for x in fail if x['src']=='203.0.113.9' and x['user']})==6
assert sum(len(events)>=5 and len({r['user'] for r in events if r['user']})>=5 for events in agg.values())==1
sequence=dict(cumulative(list(reversed(fail)), '_time', 'event_id', 'src'))
assert sequence=={'auth1':1,'auth2':2,'auth3':3,'auth4':4,'auth5':5,'auth6':6,
                 'auth9':1,'auth7':7,'auth11':8,'auth12':9},sequence
raw=read('auth_raw.csv')
logins=[x for x in raw if x['event_kind']=='login']
assert len(raw)==6 and len(logins)==5
assert sum(bool(x['Source_Network_Address'] or x['src_ip']) for x in logins)==4
assert all(bool(x['Account_Name'] or x['linux_user']) for x in logins)
assert {x['event_id'] for x in raw if x['event_kind']!='login'}=={'r6'}
assets={x['src']:x for x in read('asset_inventory.csv')}
assert assets['203.0.113.9']['category']=='shared_proxy'
coverage=read('acceleration_coverage.csv')
raw_n=sum(int(x['raw_count']) for x in coverage)
summary_n=sum(int(x['summarized_count']) for x in coverage)
assert (raw_n,summary_n,raw_n-summary_n)==(19,12,7)
print('OK — fixtures offline: 12 eventos, 10 fallos, bucket sospechoso 7/5, 5 logins normalizables, summaries 19/12 (NO SPL real)')
