"""Independent offline oracles for numerical examples, not network tests."""
import ipaddress
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
checks = []

def check(name, value):
    assert value, name
    checks.append({'id': name, 'passed': True})

p = ipaddress.ip_network('192.0.2.64/26')
check('M02_network_broadcast', str(p.network_address) == '192.0.2.64' and str(p.broadcast_address) == '192.0.2.127' and p.num_addresses == 64)
nets = [ipaddress.ip_network(s) for s in ('192.0.2.0/26', '192.0.2.64/27', '192.0.2.96/28')]
check('VLSM_capacity', [n.num_addresses - 2 for n in nets] == [62, 30, 14])
check('VLSM_non_overlap', all(not a.overlaps(b) for i, a in enumerate(nets) for b in nets[i + 1:]))
check('VLSM_enlarged_overlap', ipaddress.ip_network('192.0.2.64/26').overlaps(nets[2]))
check('exact_aggregate', list(ipaddress.collapse_addresses([ipaddress.ip_network('192.0.2.0/25'), ipaddress.ip_network('192.0.2.128/25')])) == [ipaddress.ip_network('192.0.2.0/24')])
check('wrong_mask_behavior', ipaddress.ip_address('192.0.2.200') in ipaddress.ip_network('192.0.2.0/24') and ipaddress.ip_address('192.0.2.200') not in ipaddress.ip_network('192.0.2.0/25'))
check('IPv6_expansion', ipaddress.ip_address('2001:db8:1::5').exploded == '2001:0db8:0001:0000:0000:0000:0000:0005')
routes = [(ipaddress.ip_network(n), via) for n, via in [('0.0.0.0/0', 'A'), ('192.0.2.0/24', 'B'), ('192.0.2.128/25', 'C')]]

def lookup(addr):
    return max((r for r in routes if ipaddress.ip_address(addr) in r[0]), key=lambda r: r[0].prefixlen)[1]

check('longest_prefix_match', lookup('192.0.2.130') == 'C' and lookup('192.0.2.20') == 'B')
company = json.loads((root / 'REDES_MASTER_RESEARCH/05_RECURSOS/EMPRESA-LAB.json').read_text())
blocks = [ipaddress.ip_network(n['ipv4']) for n in company['networks']]
check('company_non_overlap', all(not a.overlaps(b) for i, a in enumerate(blocks) for b in blocks[i + 1:]))
check('company_capacity_including_gateways', [b.num_addresses - 2 for b in blocks[:3]] == [126, 62, 30] and all(need + 1 <= b.num_addresses - 2 for need, b in zip([120, 60, 20], blocks)))
check('company_assets_inside_documentation_block', all(ipaddress.ip_address(a['ip']) in ipaddress.ip_network('192.0.2.0/24') for a in company['assets']))
check('MSS_reference', 1400 - 20 - 20 == 1360)
check('Syslog_PRI', divmod(134, 8) == (16, 6))
check('counter_rate', (13000 - 10000) / 60 == 50)
check('loss_percentage', 20 / 1000 * 100 == 2)
check('SLO_percentage', 9980 / 10000 * 100 == 99.8)
report = {'scope': 'Independent offline numerical checks; not network or laboratory execution.', 'passed': len(checks), 'checks': checks}
(root / 'docs/redes/VALIDACION-NUMERICA.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'passed': len(checks), 'failed': 0}))
