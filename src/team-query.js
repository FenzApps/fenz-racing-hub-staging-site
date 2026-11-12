/** Team-scoped REST query construction. IDs must be UUIDs. */
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED=Object.freeze({
  team_events:'id,title,scheduled_at,status,track_id,car_id,qualifying_minutes,race_minutes',
  race_results:'id,event_id,racer_id,finishing_position,points,grid_position,fastest_lap,dnf,penalty_points,race_time,time_penalty',
  team_racers:'id,racer_id,racing_number',
  team_announcements:'id,title,body,published_at',
  team_rules:'id,title,body,sort_order',
  team_championships:'id,title,season,status,league_id',
  championship_events:'id,championship_id,event_id,round_number',
  team_trophies:'id,racer_id,title,description,awarded_at',
  team_achievements:'id,racer_id,title,description,awarded_at',
  team_tracks:'id,title,body',
  team_cars:'id,title,body',
  team_leagues:'id,title,body',
  team_event_rosters:'id,event_id,racer_id,title,round_number,notes,completed'
});
export function teamQuery(table,teamId,{limit=100,order}={}){
 if(!Object.hasOwn(ALLOWED,table))throw Error('Unsupported team table');
 if(!UUID.test(teamId))throw Error('Invalid team identifier');
 if(!Number.isInteger(limit)||limit<1||limit>1000)throw Error('Invalid page limit');
 const params=new URLSearchParams({select:ALLOWED[table],team_id:'eq.'+teamId,limit:String(limit)});
 if(order){
  const valid=table==='team_events'&&order==='scheduled_at.desc'||table==='team_announcements'&&order==='published_at.desc'||table==='team_rules'&&order==='sort_order.asc';
  if(!valid)throw Error('Unsupported ordering');
  params.set('order',order);
 }
 return table+'?'+params.toString();
}
