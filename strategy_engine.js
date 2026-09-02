(()=>{
  function analyse(input={}){
    const entry=Number(input.entry),stop=Number(input.stop),target=Number(input.target),side=input.side;
    const reasons=[];let decision='ESPERAR',confidence=0;
    if(!Number.isFinite(entry)||!Number.isFinite(stop)||!Number.isFinite(target))reasons.push('Faltan niveles válidos');
    else if(side==='LONG'&&stop<entry&&target>entry){decision='LONG';confidence=60;reasons.push('Estructura de niveles compatible con LONG')}
    else if(side==='SHORT'&&stop>entry&&target<entry){decision='SHORT';confidence=60;reasons.push('Estructura de niveles compatible con SHORT')}
    else reasons.push('Niveles incompatibles: esperar');
    const rr=Number.isFinite(entry)&&Number.isFinite(stop)&&Number.isFinite(target)?Math.abs(target-entry)/Math.abs(entry-stop):0;
    if(rr>=1.5)confidence+=20;else if(rr>0)reasons.push('R:R inferior al objetivo');
    if(confidence<70)decision='ESPERAR';
    const result={decision,confidence:Math.min(100,confidence),rr:Number(rr.toFixed(2)),reasons,timestamp:new Date().toISOString()};
    window.tradePilotAudit?.record('DECISION_ENGINE',result);return result;
  }
  window.tradePilotStrategy={analyse};
})();
