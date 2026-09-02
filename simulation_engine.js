(()=>{
 function simulate(bars,order,opts={}){
  if(!Array.isArray(bars)||!bars.length)throw new Error('Simulación requiere velas');
  const side=order?.side,entry=Number(order?.entry),stop=Number(order?.stop),target=Number(order?.target),units=Number(order?.units||0),slip=Math.abs(Number(opts.slippage||0)),fee=Math.max(0,Number(opts.fee||0));
  if(!['LONG','SHORT'].includes(side)||![entry,stop,target,units].every(Number.isFinite)||units<=0)throw new Error('Orden de simulación inválida');
  let state='OPEN',exit=null,reason='';
  for(let i=0;i<bars.length;i++){
   const b=bars[i],high=Number(b.high),low=Number(b.low);if(![high,low].every(Number.isFinite))continue;
   const s=side==='LONG'?stop-slip:stop+slip,t=side==='LONG'?target-slip:target+slip;
   const hitSL=side==='LONG'?low<=s:high>=s,hitTP=side==='LONG'?high>=t:low<=t;
   if(hitSL){exit=s;reason='SL';state='CLOSED';break}
   if(hitTP){exit=t;reason='TP';state='CLOSED';break}
  }
  const pnl=state==='CLOSED'?(side==='LONG'?(exit-entry):(entry-exit))*units-fee:0;
  return {state,exit,reason,pnl:Number(pnl.toFixed(4)),barsScanned:bars.length,conservativeSameBarRule:'SL_FIRST'};
 }
 window.tradePilotSimulation={simulate};
})();