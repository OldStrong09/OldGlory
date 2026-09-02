(()=>{
  function evaluate(){
    const trades=(()=>{try{const x=JSON.parse(localStorage.getItem('tradepilot-trades-v2')||'[]');return Array.isArray(x)?x:[]}catch{return[]}})();
    const closed=trades.filter(t=>Number.isFinite(Number(t.result)));const rejected=closed.filter(t=>Math.abs(Number(t.result))>10000).length;
    const quality=window.tradePilotScoring?closed.map(t=>window.tradePilotScoring.score(t,closed).score):[];
    const avg=quality.length?quality.reduce((a,b)=>a+b,0)/quality.length:0;
    return {status:rejected?'ATTENTION':'HEALTHY',closedTrades:closed.length,avgProcessScore:Number(avg.toFixed(1)),riskAnomalies:rejected,automationEnabled:false};
  }
  window.tradePilotBotHealth={evaluate};
})();
