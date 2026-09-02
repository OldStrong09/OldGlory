(()=>{
 function evaluate(){
  const trades=(()=>{try{const x=JSON.parse(localStorage.getItem('tradepilot-trades-v2')||'[]');return Array.isArray(x)?x:[]}catch{return[]}})();
  const closed=trades.filter(t=>Number.isFinite(Number(t.result))),s=window.tradePilotRisk?.riskSettings?.()||{capital:10000,riskPct:1};
  const maxRisk=Math.abs(Number(s.capital||0)*Number(s.riskPct||0)/100),riskAnomalies=closed.filter(t=>maxRisk>0&&Math.abs(Number(t.result))>maxRisk*1.5).length;
  const quality=window.tradePilotScoring?closed.map(t=>window.tradePilotScoring.score(t,closed).score):[],avg=quality.length?quality.reduce((a,b)=>a+b,0)/quality.length:0;
  const kill=window.tradePilotKillSwitch?.isArmed?.()||false;
  return {status:riskAnomalies||kill?'ATTENTION':'HEALTHY',closedTrades:closed.length,avgProcessScore:Number(avg.toFixed(1)),riskAnomalies,killSwitch:kill,automationEnabled:false};
 }
 window.tradePilotBotHealth={evaluate};
})();
