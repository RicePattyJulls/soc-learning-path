import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function parseCsv(text){
 const rows=[];let row=[],value='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value='';}else if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);value='';if(row.some(Boolean))rows.push(row);row=[];}else value+=c;}
 if(quoted)throw Error('CSV no terminado');if(value||row.length){row.push(value);rows.push(row);}const header=rows.shift();if(!header||new Set(header).size!==header.length)throw Error('Cabecera CSV inválida');
 return rows.map(values=>{if(values.length!==header.length)throw Error('Columnas CSV desiguales');return Object.fromEntries(header.map((h,i)=>[h,values[i]]));});
}
const sources={
 auth:{file:'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/auth_activity.csv'},
 context:{file:'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/authorized_context.csv'},
 basic:{file:'SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R01_R03/PRACTICAS/fixtures/auth_sintetico.csv'},
 microsoft:{file:'scripts/simulator/microsoft-events.json'},
};
export async function buildSimulator(){
 const read=async file=>readFile(path.join(root,file),'utf8');
 const provenance={};const contents={};
 for(const [key,entry] of Object.entries(sources)){
  const text=await read(entry.file);contents[key]=text;provenance[key]={file:entry.file,sha256:sha(text)};
  if(key!=='microsoft'){
   const pkg=entry.file.split('/').slice(0,2).join('/');const manifest=JSON.parse(await read(pkg+'/VALIDACION/MANIFIESTO.json'));
   const relative=entry.file.slice(pkg.length+1);if(manifest.sha256_by_path[relative]!==sha(text))throw Error('Fuente alterada: '+entry.file);
  }
 }
 const ms=JSON.parse(contents.microsoft),datasets={};
 for(const id of ['microsoft-access','microsoft-legitimate'])datasets[id]={synthetic:true,scenarioId:id,sources:[provenance.microsoft],events:ms[id].map(e=>({...e,fields:{...e.fields,[e.source.startsWith('Device')?'Timestamp':e.source==='TrainingContext'?'fixture_time_utc':'TimeGenerated']:e.time},availableAt:e.time,provenance:provenance.microsoft.file+'#'+e.id}))};
 datasets['splunk-identities']={synthetic:true,scenarioId:'splunk-identities',sources:[provenance.basic],events:parseCsv(contents.basic).map((r,i)=>({id:'S'+(301+i),time:r.timestamp_utc,availableAt:r.timestamp_utc,source:r.source,user:r.user,ip:r.src,host:'',code:r.action,summary:r.action==='failure'?'Autenticación fallida':'Autenticación correcta',fields:{_time:r.timestamp_utc,src:r.src,user:r.user,action:r.action,source:r.source},provenance:provenance.basic.file+':'+(i+2)}))};
 const auth=parseCsv(contents.auth).map(r=>({id:r.event_id,time:r.event_time_utc,availableAt:r.indexed_at_utc,source:'WinSecurity (fixture)',user:r.user,ip:r.src,host:r.host,code:r.EventCode,summary:r.EventCode==='4625'?'Fallo de logon':'Logon correcto',fields:{_time:r.event_time_utc,fixture_indexed_at:r.indexed_at_utc,EventCode:r.EventCode,user:r.user,src:r.src,host:r.host,dest:r.dest,LogonType:r.LogonType},provenance:provenance.auth.file+'#'+r.event_id}));
 const context=parseCsv(contents.context).map((r,i)=>({id:'C00'+(i+1),time:r.from_utc,availableAt:r.from_utc,source:'TrainingContext (fixture)',user:r.user,ip:r.src,host:r.asset,code:'context',summary:r.context,fields:{...r,TrainingOnly:'Contexto sintético local, no tabla o funcionalidad de Enterprise Security'},provenance:provenance.context.file+':'+(i+2)}));
 datasets['splunk-incomplete']={synthetic:true,scenarioId:'splunk-incomplete',sources:[provenance.auth,provenance.context],events:[...auth,...context]};
 const outputs=[];const manifest={schemaVersion:1,synthetic:true,datasets:{}};
 for(const [id,data] of Object.entries(datasets)){
  if(new Set(data.events.map(e=>e.id)).size!==data.events.length)throw Error('IDs duplicados');
  const text=JSON.stringify(data,null,2)+'\n',file=`simulator-data/${id}.json`;outputs.push(['public/'+file,text]);manifest.datasets[id]={file,sha256:sha(text),sources:data.sources};
 }
 outputs.push(['public/simulator-data/manifest.json',JSON.stringify(manifest,null,2)+'\n']);return {manifest,outputs};
}
export async function prepareSimulator(){const result=await buildSimulator();for(const [file,text] of result.outputs){const target=path.join(root,file);if(await readFile(target,'utf8').catch(e=>{if(e.code!=='ENOENT')throw e;return '';})===text)continue;await mkdir(path.dirname(target),{recursive:true});await writeFile(target+'.staging',text,{flag:'wx'});await rename(target+'.staging',target);}return {datasets:4,events:Object.fromEntries(result.outputs.filter(([file])=>!file.endsWith('/manifest.json')).map(([file,text])=>[file,JSON.parse(text).events.length])),outputs:result.outputs.length};}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(process.argv.length!==2)throw Error('Sin overrides');console.log(JSON.stringify(await prepareSimulator()));}
