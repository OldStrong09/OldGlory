(()=>{
  function run(bars=[],strategy){
    if(!Array.isArray(bars)||bars.length<2)throw new Error('Backtest requiere al menos 2 velas');
    const trades=[];let equity=0,peak=0,maxDD=0,wins=0,losses=0;
    for(let i=1;i<bars.length;i++){const b=bars[i],signal=typeof strategy==='function'?strategy(b,bars[i-1],i):null;if(!signal||!['LONG','SHORT'].includes(signal.side))continue;const entry=Number(signal.entry??b.open),exit=Number(signal.exit??b.close),r=signal.side==='LONG'?exit-entry:entry-exit;if(!Number.isFinite(r))continue;equity+=r;peak=Math.max(peak,equity);maxDD=Math.min(maxDD,equity-peak);r>0?wins++:losses++;trades.push({i,side:signal.side,entry,exit,r})}
    const net=trades.reduce((s,t)=>s+t.r,0),pf=losses?trades.filter(t=>t.r>0).reduce((s,t)=>s+t.r,0)/Math.abs(trades.filter(t=>t.r<0).reduce((s,t)=>s+t.r,0)):wins?Infinity:0;
    const result={trades,net:Number(net.toFixed(4)),wins,losses,winRate:trades.length?Number((wins/trades.length*100).toFixed(2)):0,profitFactor:Number.isFinite(pf)?Number(pf.toFixed(2)):pf,maxDrawdown:Number(maxDD.toFixed(4))};window.tradePilotAudit?.record('BACKTEST_RUN',{count:trades.length,net:result.net});return result;
  }
  window.tradePilotBacktest={run};
})();
