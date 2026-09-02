(()=>{
 const readJSON=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));return x}catch{return fallback}};
 function evaluate(){
  const trades=readJSON('tradepilot-trades-v2',[]),closed=Array.isArray(trades)?trades.filter(t=>Number.isFinite(Number(t.result))):[];
  const s=window.tradePilotRisk?.riskSettings?.()||{capital:10000,riskPct:1};
  const maxRisk=Math.abs(Number(s.capital||0)*Number(s.riskPct||0)/100),riskAnomalies=closed.filter(t=>maxRisk>0&&Math.abs(Number(t.result))>maxRisk*1.5).length;
  const quality=window.tradePilotScoring?closed.map(t=>Number(window.tradePilotScoring.score(t,closed).score)||0):[],avg=quality.length?quality.reduce((a,b)=>a+b,0)/quality.length:0;
  const paper=window.tradePilotPaper?.orders?.()||[],paperClosed=paper.filter(x=>x.status==='CLOSED'),paperViolations=Number(window.tradePilotPaper?.violations?.()||0);
  const backtest=readJSON('apex-ledger-backtest-latest-v1',{})||{},oos=backtest.test||{},gen=backtest.generalization||{};
  const regimeWarnings=Array.isArray(backtest.regimeWarnings)?backtest.regimeWarnings.length:0;
  const dataQuality=Number(backtest.sampleSize||0)>=100&&Number(oos.count||0)>=30;
  const backtestHealthy=dataQuality&&Number(backtest.profitFactor||0)>=1.2&&Number(backtest.expectancyR||0)>0&&Number(backtest.maxDrawdownPct||100)<=20&&Number(oos.profitFactor||0)>=1.1&&Number(oos.expectancyR||0)>0&&gen.acceptable!==false&&regimeWarnings===0;
  const kill=window.tradePilotKillSwitch?.isArmed?.()||false,violations=riskAnomalies+paperViolations;
  return {status:kill||violations||!backtestHealthy?'ATTENTION':'HEALTHY',closedTrades:closed.length,paperClosedTrades:paperClosed.length,paperViolations,riskAnomalies,avgProcessScore:Number(avg.toFixed(1)),killSwitch:kill,backtestHealthy,dataQuality,regimeWarnings,generalizationAcceptable:gen.acceptable!==false,automationEnabled:false,liveExecutionEnabled:false};
 }
 window.tradePilotBotHealth={evaluate};
})();
