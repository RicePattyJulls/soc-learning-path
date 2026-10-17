#!/usr/bin/env python3
"""Comprueba currículo, banco/Markdown, contratos, hashes y fixtures; solo offline."""
from pathlib import Path
import json
import sys

sys.dont_write_bytecode = True
package = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(package.parent/'VALIDACION'))
from comprobar_corpus import verify_package

if __name__ == '__main__':
    print(json.dumps(verify_package(package), ensure_ascii=False))
    print('Sin motor SPL ni ejecución de Splunk/ES/SOAR; revisión humana pendiente.')
