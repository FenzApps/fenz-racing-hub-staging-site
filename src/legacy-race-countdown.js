/** Race start countdown display. Extracted without changing existing rules. */
export function createRaceCountdown({}){
  function countdownText(r){ const t=new Date((r.date||'')+'T'+(r.time||'00:00')).getTime(); const ms=t-Date.now(); if(!Number.isFinite(t)||ms<=0) return ''; const d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000), m=Math.floor(ms%3600000/60000); return `${d?d+'d ':''}${h}h ${m}m`; }
  return {countdownText};
}
