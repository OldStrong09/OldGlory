(()=>{
 const KEY='apex-ledger-qualification-v3';
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function evaluate(metrics={}){
  const m={backtestTrades:0,backtestPF:0,backtestExpectancyR:0,backtestMaxDD:100,backtestTestTrades:0,backtestTestPF:0,backtestTestExpectancyR:0,generalizationRatio:null,regimeWarnings:0,paperTrades:0,paperViolations:0,health:'UNKNOWN',processScore:0,killSwitch:false,...metrics};
  const gates=[
   ['BACKTEST_MUESTRA',m.backtestTrades>=100,`≥100 trades (${m.backtestTrades})`],
   ['BACKTEST_PF',m.backtestPF>=1.2,`PF ≥ 1.20 (${Number(m.backtestPF).toFixed(2)})`],
   ['BACKTEST_EXPECTATIVA',m.backtestExpectancyR>0,`Expectativa R > 0 (${Number(m.backtestExpectancyR).toFixed(2)})`],
   ['BACKTEST_DRAWDOWN',m.backtestMaxDD<=20,`DD máximo ≤ 20% (${Number(m.backtestMaxDD).toFixed(1)}%)`],
   ['OOS_MUESTRA',m.backtestTestTrades>=30,`Test/OOS ≥30 trades (${m.backtestTestTrades})`],
   ['OOS_PF',m.backtestTestPF>=1.1,`PF OOS ≥ 1.10 (${Number(m.backtestTestPF).toFixed(2)})`],
   ['OOS_EXPECTATIVA',m.backtestTestExpectancyR>0,`Expectativa OOS R > 0 (${Number(m.backtestTestExpectancyR).toFixed(2)})`],
   ['GENERALIZACION',m.generalizationRatio===null||m.generalizationRatio>=.5,`OOS conserva ≥50% de la expectativa de train (${m.generalizationRatio===null?'—':Number(m.generalizationRatio).toFixed(2)})`],
   ['REGIMENES',Number(m.regimeWarnings||0)===0,`Sin regímenes débiles con muestra suficiente (${Number(m.regimeWarnings||0)})`],
   ['PAPER_MUESTRA',m.paperTrades>=50,`≥50 trades paper (${m.paperTrades})`],
   ['PAPER_VIOLACIONES',m.paperViolations===0,`0 violaciones de riesgo (${m.paperViolations})`],
   ['BOT_HEALTH',m.health==='HEALTHY',`Estado HEALTHY (${m.health})`],
   ['KILL_SWITCH',m.killSwitch===false,'Kill switch desarmado']
  ];
  const backtestReady=gates.slice(0,9).every(g=>g[1]),paperReady=gates.slice(9).every(g=>g[1]);
  let stage='NO APTO';
  if(backtestReady)stage='OBSERVACIÓN';
  if(backtestReady&&paperReady)stage='PAPER VALIDADO';
  const supervised=backtestReady&&paperReady&&m.paperTrades>=100&&m.processScore>=80;
  if(supervised)stage='SUPERVISADO';
  const result={stage,passed:gates.filter(g=>g[1]).length,total:gates.length,gates,liveLocked:true,evaluatedAt:new Date().toISOString(),metrics:{...m}};
  save(result);window.tradePilotAudit?.record('QUALIFICATION_GATE',result);return result;
 }
 function get(){return read()}
 window.tradePilotGates={evaluate,get};
})();
