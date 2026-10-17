"""Run the read-only editorial regressions against the authorized app baseline.

The historical preservation test requires the pre-pilot React snapshot. Do not
rewrite it or claim that it passed; V1.1 checks that scope via both SHA guards.
"""
import sys
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'SPLUNK_MASTER_RESEARCH' / 'VALIDACION'))
import test_regresiones

def flatten(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from flatten(item)
        else:
            yield item

tests = list(flatten(unittest.defaultTestLoader.loadTestsFromModule(test_regresiones)))
excluded = [test for test in tests if test._testMethodName == 'test_all_original_ids_and_protected_files']
assert len(tests) == 48 and len(excluded) == 1
print('EXCLUIDA explícitamente:', excluded[0].id(), flush=True)
result = unittest.TextTestRunner(verbosity=2).run(unittest.TestSuite(test for test in tests if test not in excluded))
sys.exit(0 if result.wasSuccessful() else 1)
