(()=>{
 function run(bars=[],strategy,opts={}){
  if(!Array.isArray(bars)||bars.length<20)throw new Error('Backtest requiere al menos 20 velas');
  const capital=Math.max(0,Number(opts.capital||10000)),riskPct=Math.min(10,Math.max(0,Number(opts.riskPct||1))),slip=Math.abs(Number(opts.slippage||0)),fee=Math.max(0,Number(opts.fee||0)),split=Math.min(.9,Math.max(.5,Number(opts.trainPct||.7)));
  const trades=[];let equity=capital,peak=capital,maxDD=0,wins=0,losses=0,breakeven=0,grossWin=0,grossLoss=0;
  for(let i=1;i<bars.length;i++){
   const b=bars[i],prev=bars[i-1],signal=typeof strategy==='function'?strategy(b,prev,i):null;if(!signal||!['LONG','SHORT'].includes(signal.side))continue;
   const entry=Number(signal.entry??b.open),exit=Number(signal.exit??b.close),stop=Number(signal.stop),dist=Math.abs(entry-stop);if(![entry,exit,dist].every(Number.isFinite)||dist<=0)continue;
   const riskCash=capital*riskPct/100,units=riskCash/dist,move=signal.side==='LONG'?exit-entry:entry-exit,slipCost=slip*units,pnl=move*units-slipCost-fee,r=pnl/riskCash;
   equity+=pnl;peak=Math.max(peak,equity);maxDD=Math.max(maxDD,peak-equity);if(pnl>0){wins++;grossWin+=pnl}else if(pnl<0){losses++;grossLoss+=Math.abs(pnl)}else breakeven++;
   trades.push({i,time:b.time??null,side:signal.side,entry,exit,stop,units:Number(units.toFixed(6)),pnl:Number(pnl.toFixed(4)),r:Number(r.toFixed(4))});
  }
  const trainCount=Math.floor(trades.length*split),train=trades.slice(0,trainCount),test=trades.slice(trainCount),sum=a=>a.reduce((s,t)=>s+t.pnl,0),sumR=a=>a.reduce((s,t)=>s+t.r,0),wr=a=>a.length?100*a.filter(t=>t.pnl>0).length/a.length:0;
  const pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0),expectancy=trades.length?sumR(trades)/trades.length:0;
  const result={trades,net:Number(sum(trades).toFixed(4)),wins,losses,breakeven,winRate:Number(wr(trades).toFixed(2)),profitFactor:Number.isFinite(pf)?Number(pf.toFixed(2)):pf,expectancyR:Number(expectancy.toFixed(4)),maxDrawdown:Number(maxDD.toFixed(4)),maxDrawdownPct:Number((maxDD/capital*100).toFixed(2)),sampleSize:trades.length,train:{count:train.length,net:Number(sum(train).toFixed(4)),winRate:Number(wr(train).toFixed(2))},test:{count:test.length,net:Number(sum(test).toFixed(4)),winRate:Number(wr(test).toFixed(2))},assumptions:{capital,riskPct,slippage:slip,fee,trainPct:split,noLookahead:true}};
  window.tradePilotAudit?.record('BACKTEST_RUN',{count:result.sampleSize,net:result.net,pf:result.profitFactor,expectancyR:result.expectancyR});return result;
 }
 window.tradePilotBacktest={run};
})();
