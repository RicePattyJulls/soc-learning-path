// Illustration metadata only. No lesson payloads, unlock rules, rewards or storage.
export type Vegetation = 'round' | 'pine' | 'slender' | 'crystal' | 'reed' | 'cactus' | 'mushroom';
export type LandmarkKind = 'gate' | 'bastion' | 'intake' | 'vault' | 'observatory' | 'beacon' | 'nexus' | 'ruin' | 'watchtower' | 'forge' | 'greenhouse' | 'library';
export interface RegionVisual {
  id: string; name: string;
  horizon: 'peaks' | 'canopy' | 'mesas' | 'skyline';
  terrain: 'terraces' | 'islets' | 'slabs' | 'buttes' | 'steps' | 'beds';
  ridge: readonly number[];
  vegetation: readonly Vegetation[];
  landmark: LandmarkKind;
  river: readonly [number, number, number, number];
  riverWidth: number;
  palette: { sky: string; skyDeep: string; ground: string; light: string; cliff: string; shade: string; ridge: string; far: string; water: string; foliage: string; accent: string };
}
const valley = { sky:'#d1eeff',skyDeep:'#86c7f4',ground:'#a8d965',light:'#dbef98',cliff:'#ac9470',shade:'#586b63',ridge:'#728ead',far:'#94afd0',water:'#168ddd',foliage:'#328661',accent:'#9ed7f5' };
function region(id:string,name:string,shape:Pick<RegionVisual,'horizon'|'terrain'|'ridge'|'vegetation'|'landmark'|'river'>,palette:Partial<RegionVisual['palette']>,riverWidth=67):RegionVisual {
  return {id,name,...shape,palette:{...valley,...palette},riverWidth};
}
export const regionVisuals: readonly RegionVisual[] = [
  region('capitulo-1-licencia-y-onboarding','Valle de acceso',{horizon:'peaks',terrain:'terraces',ridge:[260,201,252,111,240,155,235,138,227],vegetation:['round','pine','slender'],landmark:'gate',river:[.79,.91,.25,.47]},{}),
  region('capitulo-2-permisos-y-rbac','Arboleda de las puertas',{horizon:'canopy',terrain:'beds',ridge:[260,220,270,205,255,210,275,230,265],vegetation:['round','slender','pine'],landmark:'gate',river:[.24,.08,.83,.62]},{skyDeep:'#91cfbb',sky:'#e1f4d2',ground:'#8fc76a',light:'#d7eda1',cliff:'#9c9770',shade:'#557654',ridge:'#568f7f',far:'#9ac5ab',water:'#22a9b1',accent:'#c2e48e'}),
  region('capitulo-3-proteccion-y-configuracion-de-workloads','Bastión de cristal',{horizon:'peaks',terrain:'slabs',ridge:[270,140,260,60,235,120,270,75,240],vegetation:['crystal','pine','crystal'],landmark:'bastion',river:[.86,.69,.18,.4]},{skyDeep:'#9cb9ef',sky:'#e2eafb',ground:'#afd5bd',light:'#e4f2c7',cliff:'#a0adc0',shade:'#5a6f91',ridge:'#7294bd',far:'#b4bce2',water:'#4f9edc',accent:'#93ebf6'}),
  region('capitulo-4-ingesta','Delta de las corrientes',{horizon:'skyline',terrain:'islets',ridge:[275,245,270,230,265,240,280,220,260],vegetation:['reed','round','reed'],landmark:'intake',river:[.67,.2,.91,.35]},{skyDeep:'#81cdda',sky:'#d6f5f5',ground:'#9bcf9c',light:'#d5efb3',cliff:'#c5ae81',shade:'#668b7f',ridge:'#67a2b0',far:'#a0c9d1',water:'#1ba8c7',foliage:'#438b6a',accent:'#ffd58b'},96),
  region('capitulo-5-almacenamiento-y-retencion','Archivo glaciar',{horizon:'peaks',terrain:'slabs',ridge:[235,130,250,90,240,160,260,80,210],vegetation:['crystal','pine','crystal'],landmark:'vault',river:[.2,.14,.83,.67]},{skyDeep:'#a1cfe9',sky:'#edf8ff',ground:'#d3e8e0',light:'#f3fbf0',cliff:'#b2cbd3',shade:'#7898ad',ridge:'#7b9dbb',far:'#becfe3',water:'#67b9d8',foliage:'#4d8a84',accent:'#fff2b1'}),
  region('capitulo-6-threat-intelligence','Observatorio de horizontes',{horizon:'mesas',terrain:'buttes',ridge:[250,175,175,230,130,130,245,185,185],vegetation:['slender','crystal','pine'],landmark:'observatory',river:[.78,.93,.31,.5]},{skyDeep:'#99a8de',sky:'#eee2f6',ground:'#b1c993',light:'#e6eac1',cliff:'#b9a18a',shade:'#6a7d89',ridge:'#8d91bc',far:'#b8acd1',water:'#6aaed2',accent:'#f9dda1'}),
  region('capitulo-7-deteccion-y-alertas','Cañón de las señales',{horizon:'mesas',terrain:'buttes',ridge:[245,150,150,260,180,180,250,115,115],vegetation:['cactus','slender','cactus'],landmark:'beacon',river:[.22,.35,.86,.58]},{skyDeep:'#edbb9b',sky:'#fff0cb',ground:'#d7bd7c',light:'#f6df9f',cliff:'#c48c61',shade:'#8b6259',ridge:'#be917e',far:'#d9b39a',water:'#52b9ba',foliage:'#7b9b58',accent:'#ffd75f'}),
  region('capitulo-8-correlacion-e-incidentes','Islas del nexo',{horizon:'peaks',terrain:'islets',ridge:[275,220,265,175,270,215,265,190,275],vegetation:['round','reed','crystal'],landmark:'nexus',river:[.73,.18,.83,.28]},{skyDeep:'#96cde3',sky:'#dcf4ee',ground:'#a5ceaa',light:'#def0c1',cliff:'#b6ab90',shade:'#5e8f8c',ridge:'#76a9af',far:'#aac9d3',water:'#3ab4ca',accent:'#e4bcff'},90),
  region('capitulo-9-investigacion','Ruinas de los indicios',{horizon:'mesas',terrain:'steps',ridge:[260,210,210,260,170,170,260,225,225],vegetation:['round','mushroom','slender'],landmark:'ruin',river:[.18,.31,.9,.64]},{skyDeep:'#abc7bd',sky:'#edf0d3',ground:'#b6cb83',light:'#e8e8ae',cliff:'#b1a17e',shade:'#7b8270',ridge:'#95a78a',far:'#bdc9b1',water:'#59aaa1',accent:'#f1d78b'}),
  region('capitulo-10-hunting','Bosque de las huellas',{horizon:'canopy',terrain:'terraces',ridge:[260,180,270,210,255,175,270,200,260],vegetation:['pine','mushroom','round'],landmark:'watchtower',river:[.84,.6,.17,.43]},{skyDeep:'#a6b7c9',sky:'#e1ecd9',ground:'#8bb278',light:'#cbe1a0',cliff:'#a28f76',shade:'#4e7468',ridge:'#5c8c80',far:'#9db5a6',water:'#439eab',foliage:'#286951',accent:'#f7d49c'}),
  region('capitulo-11-respuesta-y-remediacion','Forja de restauración',{horizon:'peaks',terrain:'slabs',ridge:[265,190,260,115,245,160,270,140,260],vegetation:['cactus','crystal','slender'],landmark:'forge',river:[.25,.12,.74,.57]},{skyDeep:'#dbb9a9',sky:'#fae8d1',ground:'#c3b48b',light:'#ead8ae',cliff:'#9c8d80',shade:'#586d76',ridge:'#9a8e9c',far:'#c6b2b7',water:'#67b7c2',foliage:'#718c68',accent:'#ffc477'}),
  region('capitulo-12-automatizacion','Jardines de los mecanismos',{horizon:'skyline',terrain:'beds',ridge:[270,240,260,215,270,225,260,200,270],vegetation:['round','reed','slender'],landmark:'greenhouse',river:[.71,.92,.24,.44]},{skyDeep:'#99d0d1',sky:'#edf5dc',ground:'#a6d39b',light:'#e0efad',cliff:'#b9ad87',shade:'#6d8c80',ridge:'#79a6a3',far:'#b4ccc2',water:'#49aebe',accent:'#ffd591'}),
  region('capitulo-13-mapa-de-tablas-y-relaciones-kql','Ciudad de las conexiones',{horizon:'skyline',terrain:'steps',ridge:[260,190,240,165,245,180,260,150,245],vegetation:['crystal','slender','pine'],landmark:'library',river:[.21,.4,.87,.62]},{skyDeep:'#a8c5eb',sky:'#edf1ff',ground:'#c2d9cc',light:'#ecf2d3',cliff:'#b3b8be',shade:'#72859a',ridge:'#879ec3',far:'#c1c9e6',water:'#6aaed9',accent:'#f7db9a'}),
];
const visualsById=new Map(regionVisuals.map(visual=>[visual.id,visual]));
export const regionVisual=(id:string)=>visualsById.get(id);
