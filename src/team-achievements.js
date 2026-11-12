/** Read-only automatic GT7 achievements derived from team race results. */
export function deriveTeamAchievements(results,events=[]){
 const eventDates=new Map(events.map(e=>[e.id,e.scheduled_at||'']));
 const groups=new Map();
 for(const result of results||[]){if(!result?.racer_id)continue;const list=groups.get(result.racer_id)||[];list.push(result);groups.set(result.racer_id,list);}
 const cards=[];
 for(const [racer_id,items] of groups){
  const sorted=items.slice().sort((a,b)=>String(eventDates.get(a.event_id)||'').localeCompare(String(eventDates.get(b.event_id)||''))||String(a.event_id).localeCompare(String(b.event_id)));
  const finished=sorted.filter(x=>!x.dnf);
  const wins=finished.filter(x=>x.finishing_position===1).length;
  const podiums=finished.filter(x=>Number.isInteger(x.finishing_position)&&x.finishing_position<=3).length;
  const poles=sorted.filter(x=>x.grid_position===1).length;
  const fastest=sorted.filter(x=>x.fastest_lap===true).length;
  let run=0,streaks=0;
  for(const result of sorted){if(!result.dnf&&Number.isInteger(result.finishing_position)&&result.finishing_position<=3){run++;if(run===3){streaks++;run=0;}}else run=0;}
  for(const [title,description,count,icon] of [
   ['GT7 Race Winner','Finished first in a race',wins,'🏆'],
   ['GT7 Pole Position','Started from pole position',poles,'👍'],
   ['GT7 Fastest Lap','Recorded fastest lap',fastest,'⏱️'],
   ['GT7 Podium Finisher','Finished inside the top three',podiums,'🎯'],
   ['GT7 Podium Streak','Three consecutive podium finishes',streaks,'🥇']
  ])if(count>0)cards.push({racer_id,title,description,count,icon,automatic:true});
 }
 return cards.sort((a,b)=>a.racer_id.localeCompare(b.racer_id)||a.title.localeCompare(b.title));
}
