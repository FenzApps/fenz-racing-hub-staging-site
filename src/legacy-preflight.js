/** Pure, non-destructive preflight for V22.x export manifests. */
export const REQUIRED_TABLES = Object.freeze({
  drivers:16, events:49, results:312, trophies:75,
  leagues:21, users:4, rosters:37, cars:1, tracks:91, messages:6,
  protests:0, notifications:0, settings:15
});
export function legacyDataChecksum(obj){let str='';try{str=JSON.stringify(obj);}catch{str=String(obj||'');}let h=0;for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i);h|=0;}return Math.abs(h).toString(16).padStart(8,'0');}
export function validateLegacyExport(exportData, expected=REQUIRED_TABLES) {
  const errors=[];
  if (!exportData || typeof exportData!=='object' || Array.isArray(exportData)) return {ok:false,errors:['Export must be an object'],counts:{}};
  const tables=exportData.data && typeof exportData.data==='object' ? exportData.data : exportData;
  const counts={};
  if(exportData.manifest?.checksum&&legacyDataChecksum(tables)!==exportData.manifest.checksum)errors.push('Backup checksum mismatch');
  if(exportData.manifest?.tables){for(const [name,count] of Object.entries(exportData.manifest.tables)){if(Array.isArray(tables[name])&&tables[name].length!==count)errors.push('Manifest count mismatch for '+name);}}
  for(const [name,count] of Object.entries(expected)){
    const rows=tables[name];
    if(!Array.isArray(rows)){errors.push('Missing array: '+name);continue;}
    counts[name]=rows.length;
    if(rows.length!==count) errors.push(name+': expected '+count+', got '+rows.length);
    const ids=new Set();
    for(const [i,row] of rows.entries()){
      if(!row || typeof row!=='object' || Array.isArray(row)){errors.push(name+'['+i+'] invalid row');continue;}
      if(row.id!=null){
        const id=String(row.id);
        if(ids.has(id))errors.push(name+': duplicate id '+id);
        ids.add(id);
      }
    }
  }
  return {ok:errors.length===0,errors,counts};
}
