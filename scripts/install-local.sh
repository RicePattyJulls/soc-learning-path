#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
destination='/home/tommy/Documentos/SOC_LEARNING_PATH'

if [[ "$project_root" == "$destination" ]]; then
  printf '%s\n' 'El proyecto ya está en la ubicación solicitada.'
  exit 0
fi
if [[ -e "$destination" || -L "$destination" ]]; then
  printf '%s\n' "El destino ya existe. No se ha modificado: $destination" >&2
  exit 1
fi
cp -a -- "$project_root" "$destination"
printf '%s\n' "Proyecto copiado a $destination" 'Para arrancar:' "cd '$destination'" 'npm run dev'
