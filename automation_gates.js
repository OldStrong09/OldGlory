(()=>{
 const KEY='apex-ledger-qualification-v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
 const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
 function evaluate(metrics={}){
   const m={backtestTrades:0,backtestPF:0,backtestExpectancyR:0,backtestMaxDD:100,paperTrades:0,paperViolations:0,health:'UNKNOWN',killSwitch:false,...metrics};
   const gates=[
    ['BACKTEST_MUESTRA',m.backtestTrades>=100,`≥100 trades (${m.backtestTrades})`],
    ['BACKTEST_PF',m.backtestPF>=1.2,`PF ≥ 1.20 (${Number(m.backtestPF).toFixed(2)})`],
    ['BACKTEST_EXPECTATIVA',m.backtestExpectancyR>0,`Expectativa R > 0 (${Number(m.backtestExpectancyR).toFixed(2)})`],
    ['BACKTEST_DRAWDOWN',m.backtestMaxDD<=20,`DD máximo ≤ 20% (${Number(m.backtestMaxDD).toFixed(1)}%)`],
    ['PAPER_MUESTRA',m.paperTrades>=50,`≥50 trades paper (${m.paperTrades})`],
    ['PAPER_VIOLACIONES',m.paperViolations===0,`0 violaciones de riesgo (${m.paperViolations})`],
    ['BOT_HEALTH',m.health==='HEALTHY',`Estado HEALTHY (${m.health})`],
    ['KILL_SWITCH',m.killSwitch===false,'Kill switch desarmado']
   ];
   const passed=gates.filter(g=>g[1]).length;
   let stage='NO APTO';
   if(passed>=3)stage='OBSERVACIÓN';
   if(passed===gates.length)stage='PAPER VALIDADO';
   const result={stage,passed,total:gates.length,gates,liveLocked:true,evaluatedAt:new Date().toISOString()};
   save(result);window.tradePilotAudit?.record('QUALIFICATION_GATE',result);return result;
 }
 function get(){return read()}
 window.tradePilotGates={evaluate,get};
})();