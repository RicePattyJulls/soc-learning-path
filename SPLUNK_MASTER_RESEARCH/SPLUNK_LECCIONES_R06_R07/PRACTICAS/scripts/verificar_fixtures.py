#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
from collections import Counter, defaultdict
import csv,sys
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'VALIDACION'))
from offline_core import bucket as utc_bucket
base=Path(__file__).resolve().parent.parent/'fixtures'
def load(f):
 with (base/f).open(encoding='utf-8',newline='') as h:return list(csv.DictReader(h))
def dt(v):return datetime.fromisoformat(v.replace('Z','+00:00'))
A,K,C=load('auth_activity.csv'),load('kerberos_tgs.csv'),load('authorized_context.csv')
assert (len(A),len(K),len(C))==(21,16,3)
assert len({e['event_id'] for e in A+K})==len(A)+len(K)
assert all(dt(e['indexed_at_utc'])>=dt(e['event_time_utc']) for e in A)
byid={e['event_id']:e for e in A}
assert byid['A007']['EventCode']=='4624' and byid['A007']['user']=='bob'
assert (dt(byid['A021']['indexed_at_utc'])-dt(byid['A021']['event_time_utc'])).total_seconds()==1200
assert (dt(byid['A001']['indexed_at_utc'])-dt(byid['A001']['event_time_utc'])).total_seconds()==10
assert (dt(byid['A004']['indexed_at_utc'])-dt(byid['A004']['event_time_utc'])).total_seconds()==10
assert (dt(byid['A007']['indexed_at_utc'])-dt(byid['A007']['event_time_utc'])).total_seconds()==12

def auth_fail(src,cut=None):
 return [e for e in A if e['src']==src and e['EventCode']=='4625' and (cut is None or dt(e['indexed_at_utc'])<dt(cut))]
assert len(auth_fail('198.51.100.23','2026-10-15T09:16:00Z'))==6
assert len(auth_fail('198.51.100.23'))==7
assert len({e['user'] for e in auth_fail('198.51.100.23')})==6
assert (len(auth_fail('203.0.113.15')),len({e['user'] for e in auth_fail('203.0.113.15')}))==(5,1)
assert (len(auth_fail('192.0.2.44')),len({e['user'] for e in auth_fail('192.0.2.44')}))==(4,3)
assert (len(auth_fail('192.0.2.88')),len({e['user'] for e in auth_fail('192.0.2.88')}))==(3,1)

def candidates(min_fail=5,min_users=5):
 groups=defaultdict(list)
 for e in A:
  if e['EventCode']=='4625':
   bucket=utc_bucket(e['event_time_utc'])
   groups[(e['src'],bucket)].append(e)
 return [(src,b, len(evs),len({e['user'] for e in evs if e['user']})) for (src,b),evs in groups.items() if len(evs)>=min_fail and len({e['user'] for e in evs if e['user']})>=min_users]
assert {c[0] for c in candidates()}=={'198.51.100.23'}
assert {c[0] for c in candidates(min_users=1)}=={'198.51.100.23','203.0.113.15'}
T=defaultdict(list)
for e in K:T[e['user']].append(e)
assert len(T['audit-user'])==6 and len({e['ServiceName'] for e in T['audit-user']})==6
assert len(T['svc-backup'])==5 and len({e['ServiceName'] for e in T['svc-backup']})==1
assert len(T['app-admin'])==4 and len({e['ServiceName'] for e in T['app-admin']})==4
assert T['unknown-actor'][0]['TicketEncryptionType']==''
assert all(e['TicketEncryptionType']=='0x17' for e in T['audit-user']+T['svc-backup'])
assert all(e['TicketEncryptionType']=='0x12' for e in T['app-admin'])
print('VALIDACIÓN OFFLINE OK: 21 autenticaciones; 16 solicitudes TGS; 3 contextos.')
print('Autenticación candidato: 6 fallos/6 usuarios a 09:16; 7 fallos/6 usuarios retrospectivos.')
print('Mantenimiento benigno simulado: 5 fallos/1 usuario; proxy inconcluso: 4 fallos/3 usuarios.')
print('Kerberos: RC4 sospecha 6/6; RC4 backup 5/1; AES 4/4; sin cifrado 1.')
print('ATENCIÓN: no se han ejecutado búsquedas SPL ni comprobado la instancia real.')
