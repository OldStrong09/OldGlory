(()=>{
  const LOCKED=true;
  function execute(){throw new Error('EXECUTION_GATEWAY_LOCKED: Apex Ledger no puede ejecutar operaciones reales en esta versión.')} 
  window.tradePilotExecution={locked:LOCKED,execute};
})();
