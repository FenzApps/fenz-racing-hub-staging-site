/** GT7 finishing points, fastest lap bonus and closed protest penalties. Pure selectors against supplied app state. */
export function createScoring({state,idName,isFastestFlag}){
  function finishNum(v){ const n = parseInt(String(v||'').replace(/[^0-9]/g,''),10); return Number.isFinite(n) ? n : 999; }
  function isDNF(v){ return String(v||'').trim().toUpperCase()==='DNF' || String(v||'').toUpperCase().includes('DNF'); }
  function basePointsForFinish(pos){ const n=finishNum(pos); const pts={1:25,2:18,3:15,4:12,5:10,6:8,7:6,8:4,9:2,10:1}; return pts[n]||0; }
  function calcBasePoints(r){ if(isDNF(r.time)||isDNF(r.finish)) return 0; return basePointsForFinish(r.finish)+(r.fastestBonus===true||isFastestFlag(r.fastestLap)?1:0); }
  function protestAdjustmentsForResult(r){ return (state.data.protests||[]).filter(p=>p.status==='closed' && idName(p.against)===idName(r.driver) && (String(p.raceId||'')===String(r.oldEventId||r.eventId||'') || idName(p.raceTitle||p.race)===idName(r.event))).reduce((a,p)=>a+Number(p.pointsAdjustment||0),0); }
  function finalPointsForResult(r){ if(isDNF(r.time)||isDNF(r.finish)) return 0; return Math.max(0, calcBasePoints(r)+protestAdjustmentsForResult(r)); }
  return {finishNum,isDNF,basePointsForFinish,calcBasePoints,protestAdjustmentsForResult,finalPointsForResult};
}
