"""Funciones puras sobre fixtures; no parser SPL, cliente REST ni motor SOAR."""
from collections import Counter, defaultdict
from datetime import datetime, timezone
from fractions import Fraction


def epoch(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        raise ValueError('Timestamp sin zona explícita: ' + value)
    return int(parsed.timestamp())


def bucket(value, seconds=900):
    return epoch(value) // seconds * seconds


def auth_groups(rows, time_field, result_field, failure, index_field=None, cutoff=None):
    groups = defaultdict(list)
    seen = set()
    for row in rows:
        unique_id = row.get('fixture_id', row.get('id', row.get('event_id')))
        if unique_id:
            if unique_id in seen:
                raise ValueError('ID de evento duplicado: ' + unique_id)
            seen.add(unique_id)
        if row[result_field] != failure:
            continue
        if cutoff is not None:
            if not index_field:
                raise ValueError('Snapshot sin campo de indexación sintético')
            if epoch(row[index_field]) >= epoch(cutoff):
                continue
        groups[(row['src'], bucket(row[time_field]))].append(row)
    return {key: (len(value), len({r['user'].strip() for r in value if r['user'].strip()}),
                  sum(not r['user'].strip() for r in value)) for key, value in groups.items()}


def cumulative(rows, time_field, id_field, group_field):
    counts, result = Counter(), []
    for row in sorted(rows, key=lambda r: (epoch(r[time_field]), r[id_field])):
        counts[row[group_field]] += 1
        result.append((row[id_field], counts[row[group_field]]))
    return result


def network_totals(rows):
    totals = Counter()
    for row in rows:
        amount = int(row['bytes_out'])
        if amount < 0:
            raise ValueError('Volumen negativo')
        totals[(row['src'], row['dest'])] += amount
    return dict(totals)


def normalize_fixture(row, contract):
    """Modelo de campos en memoria; no crea metadatos ni configura Splunk."""
    if set(row) != set(contract['columns']):
        raise ValueError('La fila no satisface el esquema de fixture')
    result = {}
    for original, target in contract['field_mapping_for_design'].items():
        value = row[original]
        result[target] = epoch(value) if target in {'_time', 'fixture_index_epoch'} and value else value
    if '_indextime' in result:
        raise ValueError('Prohibido fabricar _indextime histórico')
    return result


def valid_indicators(rows, reference):
    at = epoch(reference)
    result = []
    for row in rows:
        try:
            begin = epoch(row['first_seen_utc'] + 'T00:00:00Z')
            end = epoch(row['expires_at_utc'] + 'T00:00:00Z')
        except (ValueError, KeyError):
            continue  # fecha inválida: no afirmar vigencia
        if row['type'] == 'IP' and begin <= at < end:
            result.append(row)
    return result


def ti_matches(flows, indicators, reference):
    valid = valid_indicators(indicators, reference)
    by_ip = {r['value']: r for r in valid}
    if len(by_ip) != len(valid):
        raise ValueError('Varios indicadores vigentes para el mismo observable: requiere criterio explícito')
    return [(r['id'], by_ip[r['dest']]['indicator_id']) for r in flows if r['dest'] in by_ip]


def api_decision(row):
    # Política didáctica, no simulación de autorización real de Splunk.
    if row['requester_role'] != 'soc_reader':
        return 'deny_access'
    count = int(row['result_request_count'])
    if not 1 <= count <= 100:
        return 'reject_unlimited'
    if row['job_status'] == 'expired':
        return 'report_expired'
    return 'read_within_role' if row['job_status'] == 'done' else 'report_not_ready'


def action_decision(row):
    if row['kind'] == 'read':
        return 'review_data_handling' if row['asset'] == 'ti_lookup_demo' else 'read_only'
    if row['approved'] != 'yes':
        return 'deny'
    # El CSV no aporta evidencia/expiración/impacto: approved=yes no basta.
    return 'needs_impact_and_expiry_checks'


def classify_retry(mode, status):
    if status in {'forbidden', 'invalid'}:
        return 'stop'
    if mode == 'mutating' and status == 'unknown':
        return 'reconcile'
    if mode == 'read' and status == 'transient':
        return 'bounded_retry'
    if status == 'pending':
        return 'wait_for_approval'
    return 'record'


def replay_ledger(rows):
    """Reconciliación de estados observados; nunca ejecuta una acción."""
    ledger, effects = {}, set()
    allowed = {
        None: {'applied', 'unknown', 'forbidden', 'transient', 'pending', 'invalid', 'complete'},
        'applied': {'replay'}, 'transient': {'complete', 'transient'},
        'unknown': set(), 'forbidden': set(), 'invalid': set(),
        'pending': set(), 'complete': set(), 'replay': {'replay'},
    }
    for row in rows:
        key, status = row['idempotency_key'], row['status']
        previous = ledger.get(key)
        if status not in allowed.get(previous, set()):
            raise ValueError(f'Transición no autorizada del ledger: {previous}->{status}')
        if status == 'applied':
            if row['mode'] != 'mutating' or key in effects:
                raise ValueError('Efecto duplicado o modo incorrecto')
            effects.add(key)
        if status == 'replay' and key not in effects:
            raise ValueError('Replay sin efecto confirmado')
        ledger[key] = status
    return ledger, effects


def confusion_label(truth, matched):
    if truth == 'attack_confirmed':
        return 'TP' if matched else 'FN'
    if truth == 'benign_documented':
        return 'FP' if matched else 'TN'
    return 'not_evaluable'


def theory_pass(right, total):
    if not 0 <= right <= total or total <= 0:
        return False
    return Fraction(right, total) >= Fraction(4, 5)
