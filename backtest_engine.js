(()=>{
 const KEY='apex-ledger-backtest-latest-v1';
 const readLast=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
 const n=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
 function stats(a){const sum=a.reduce((s,t)=>s+t.pnl,0),sumR=a.reduce((s,t)=>s+t.r,0),wins=a.filter(t=>t.pnl>0),losses=a.filter(t=>t.pnl<0),grossWin=wins.reduce((s,t)=>s+t.pnl,0),grossLoss=Math.abs(losses.reduce((s,t)=>s+t.pnl,0));return {count:a.length,net:Number(sum.toFixed(4)),winRate:a.length?Number((100*wins.length/a.length).toFixed(2)):0,profitFactor:grossLoss?Number((grossWin/grossLoss).toFixed(2)):(grossWin?Infinity:0),expectancyR:a.length?Number((sumR/a.length).toFixed(4)):0};}
 function run(bars=[],strategy,opts={}){
  if(!Array.isArray(bars)||bars.length<20)throw new Error('Backtest requiere al menos 20 velas');
  const capital=Math.max(0,n(opts.capital,10000)),riskPct=Math.min(10,Math.max(0,n(opts.riskPct,1))),slip=Math.abs(n(opts.slippage)),fee=Math.max(0,n(opts.fee)),split=Math.min(.9,Math.max(.5,n(opts.trainPct,.7)));
  const trades=[];let equity=capital,peak=capital,maxDD=0,consecutiveLosses=0,maxConsecutiveLosses=0;
  for(let i=1;i<bars.length;i++){
   const b=bars[i],prev=bars[i-1],signal=typeof strategy==='function'?strategy(b,prev,i):null;
   if(!signal||!['LONG','SHORT'].includes(signal.side))continue;
   const entry=n(signal.entry??b.open,NaN),exit=n(signal.exit??b.close,NaN),stop=n(signal.stop,NaN),dist=Math.abs(entry-stop);
   if(![entry,exit,dist].every(Number.isFinite)||dist<=0)continue;
   const riskCash=Math.max(0,equity)*riskPct/100,units=riskCash/dist,move=signal.side==='LONG'?exit-entry:entry-exit,pnl=move*units-slip*units-fee,r=riskCash?pnl/riskCash:0;
   equity+=pnl;peak=Math.max(peak,equity);maxDD=Math.max(maxDD,peak-equity);consecutiveLosses=pnl<0?consecutiveLosses+1:0;maxConsecutiveLosses=Math.max(maxConsecutiveLosses,consecutiveLosses);
   trades.push({i,time:b.time??null,side:signal.side,entry,exit,stop,units:Number(units.toFixed(6)),pnl:Number(pnl.toFixed(4)),r:Number(r.toFixed(4))});
  }
  const trainCount=Math.floor(trades.length*split),train=trades.slice(0,trainCount),test=trades.slice(trainCount),overall=stats(trades),trainStats=stats(train),testStats=stats(test);
  const regime=window.tradePilotRegime?.evaluate?.(bars,trades,{minSample:20})||{regimes:{},warnings:[],heuristic:true};
  const degradation=trainStats.expectancyR>0?testStats.expectancyR/trainStats.expectancyR:null;
  const result={trades:trades.slice(-1000),...overall,maxDrawdown:Number(maxDD.toFixed(4)),maxDrawdownPct:capital?Number((maxDD/capital*100).toFixed(2)):0,maxConsecutiveLosses,sampleSize:trades.length,train:trainStats,test:testStats,generalization:{expectancyRatio:degradation===null?null:Number(degradation.toFixed(4)),acceptable:degradation===null?true:degradation>=.5},regimes:regime.regimes,regimeWarnings:regime.warnings,assumptions:{capital,riskPct,slippage:slip,fee,trainPct:split,positionSizing:'current-equity',signalContract:'strategy(currentBar,previousBar,index)',lookaheadSafe:false,regimeClassifier:'heuristic'}};
  localStorage.setItem(KEY,JSON.stringify({...result,savedAt:new Date().toISOString()}));window.tradePilotAudit?.record('BACKTEST_RUN',{count:result.sampleSize,net:result.net,pf:result.profitFactor,expectancyR:result.expectancyR,testExpectancyR:result.test.expectancyR,maxDD:result.maxDrawdownPct,regimeWarnings:result.regimeWarnings.length});window.dispatchEvent(new Event('apex-backtest-updated'));return result;
 }
 window.tradePilotBacktest={run,last:readLast};
})();
