(()=>{
 const safe=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
 function classify(bars,i,opts={}){
  const look=Math.max(5,Math.round(safe(opts.lookback,20))),start=Math.max(0,i-look+1),slice=bars.slice(start,i+1),closes=slice.map(x=>safe(x.close,NaN)).filter(Number.isFinite);
  if(closes.length<5)return 'UNKNOWN';
  const first=closes[0],last=closes[closes.length-1],move=first?Math.abs(last-first)/Math.abs(first):0;
  const mean=closes.reduce((s,x)=>s+x,0)/closes.length,variance=closes.reduce((s,x)=>s+(x-mean)**2,0)/closes.length,vol=mean?Math.sqrt(variance)/Math.abs(mean):0;
  const volHi=vol>safe(opts.highVol,.02),trend=move>safe(opts.trendMove,.015);
  if(volHi&&trend)return 'HIGH_VOL_TREND';
  if(volHi)return 'HIGH_VOL_RANGE';
  if(trend)return 'TREND';
  return 'RANGE';
 }
 function evaluate(bars,trades,opts={}){
  if(!Array.isArray(bars)||!Array.isArray(trades))return {regimes:{},sampleSize:0,warnings:['Datos de regímenes inválidos']};
  const regimes={};
  const add=r=>regimes[r]||(regimes[r]={trades:0,net:0,wins:0,losses:0,grossWin:0,grossLoss:0,rSum:0});
  trades.forEach(t=>{const i=Number(t.i),r=Number.isInteger(i)&&i>=0&&i<bars.length?classify(bars,i,opts):'UNKNOWN',g=add(r),p=safe(t.pnl),rv=safe(t.r);g.trades++;g.net+=p;g.rSum+=rv;if(p>0){g.wins++;g.grossWin+=p}else if(p<0){g.losses++;g.grossLoss+=Math.abs(p)}});
  const min=Math.max(5,Math.round(safe(opts.minSample,20))),warnings=[];
  Object.entries(regimes).forEach(([name,g])=>{g.net=Number(g.net.toFixed(4));g.grossWin=Number(g.grossWin.toFixed(4));g.grossLoss=Number(g.grossLoss.toFixed(4));g.winRate=g.trades?Number((100*g.wins/g.trades).toFixed(2)):0;g.expectancyR=g.trades?Number((g.rSum/g.trades).toFixed(4)):0;g.profitFactor=g.grossLoss?Number((g.grossWin/g.grossLoss).toFixed(2):(g.grossWin?Infinity:0);g.sampleSufficient=g.trades>=min;g.weak=g.sampleSufficient&&g.expectancyR<safe(opts.weakExpectancy,-.10);if(g.weak)warnings.push(`${name}: expectativa R débil (${g.expectancyR})`)});
  return {regimes,sampleSize:trades.length,minSample:min,warnings,heuristic:true};
 }
 window.tradePilotRegime={classify,evaluate};
})();
