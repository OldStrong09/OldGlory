(()=>{
 function simulate(bars,order,opts={}){
  if(!Array.isArray(bars)||!bars.length)throw new Error('Simulación requiere velas');
  const start=Math.max(0,Math.min(bars.length-1,Math.floor(Number.isFinite(Number(opts.startIndex))?Number(opts.startIndex):0)));
  const side=order?.side,entry=Number(order?.entry),stop=Number(order?.stop),target=Number(order?.target),units=Number(order?.units||0),slip=Math.abs(Number(opts.slippage||0)),fee=Math.max(0,Number(opts.fee||0));
  if(!['LONG','SHORT'].includes(side)||![entry,stop,target,units].every(Number.isFinite)||units<=0)throw new Error('Orden de simulación inválida');
  const valid=side==='LONG'?stop<entry&&target>entry:stop>entry&&target<entry;if(!valid)throw new Error('SL/TP incompatibles con la dirección');
  let state='OPEN',exit=null,reason='',exitIndex=null,exitTime=null;
  const effectiveEntry=side==='LONG'?entry+slip:entry-slip;
  for(let i=start;i<bars.length;i++){
   const b=bars[i],high=Number(b.high),low=Number(b.low);if(![high,low].every(Number.isFinite))continue;
   const s=side==='LONG'?stop-slip:stop+slip,t=side==='LONG'?target-slip:target+slip;
   const hitSL=side==='LONG'?low<=s:high>=s,hitTP=side==='LONG'?high>=t:low<=t;
   if(hitSL){exit=s;reason='SL';state='CLOSED';exitIndex=i;exitTime=b.time??null;break}
   if(hitTP){exit=t;reason='TP';state='CLOSED';exitIndex=i;exitTime=b.time??null;break}
  }
  const pnl=state==='CLOSED'?(side==='LONG'?(exit-effectiveEntry):(effectiveEntry-exit))*units-fee:0,risk=Math.abs(entry-stop)*units,r=risk?pnl/risk:0;
  return {state,entry:effectiveEntry,exit,reason,pnl:Number(pnl.toFixed(4)),r:Number(r.toFixed(4)),risk:Number(risk.toFixed(4)),startIndex:start,barsScanned:Math.max(0,bars.length-start),exitIndex,exitTime,fees:Number(fee.toFixed(4)),slippage:Number((slip*units).toFixed(4)),conservativeSameBarRule:'SL_FIRST',lookaheadSafe:true,contract:'simulation only inspects bars from startIndex forward'};
 }
 window.tradePilotSimulation={simulate};
})();
