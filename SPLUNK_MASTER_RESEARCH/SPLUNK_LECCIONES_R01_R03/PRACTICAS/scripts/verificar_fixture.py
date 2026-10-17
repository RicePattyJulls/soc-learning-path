#!/usr/bin/env python3
"""Comprueba solo cifras de un CSV sintético; NO ejecuta SPL ni conecta a Splunk."""
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict
import csv

p = Path(__file__).resolve().parents[1] / 'fixtures' / 'auth_sintetico.csv'
agg = defaultdict(lambda: {'total': 0, 'users': set()})
with p.open(encoding='utf-8', newline='') as fd:
    for row in csv.DictReader(fd):
        if row['action'] != 'failure':
            continue
        t = datetime.fromisoformat(row['timestamp_utc'].replace('Z', '+00:00'))
        sec = int(t.timestamp())
        window = datetime.fromtimestamp((sec // 900)*900, tz=timezone.utc).isoformat()
        key = (row['src'], window)
        agg[key]['total'] += 1
        if row['user']:
            agg[key]['users'].add(row['user'])
summary = {k: (v['total'], len(v['users'])) for k, v in agg.items()}
assert summary[('203.0.113.9', '2026-10-16T09:00:00+00:00')] == (6, 5), summary
assert summary[('198.51.100.20', '2026-10-16T09:00:00+00:00')] == (1, 1), summary
assert summary[('192.0.2.25', '2026-10-16T09:00:00+00:00')] == (1, 0), summary
assert summary[('203.0.113.9', '2026-10-16T09:15:00+00:00')] == (1, 1), summary
alerts = [(k,v) for k,v in summary.items() if v[1]>=5]
assert len(alerts)==1 and alerts[0][0][0]=='203.0.113.9', alerts
for k, (total, users) in sorted(summary.items()):
    print(f'{k}: fallos={total}, cuentas_distintas={users}')
print('OK: fixture offline validada; SPL real NO probado.')
