(()=>{
  const KEY='apex-ledger-audit-v1',MAX=500;
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  function record(type,payload={}){const rows=read();rows.push({id:crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(16).slice(2),at:new Date().toISOString(),type:String(type),payload});localStorage.setItem(KEY,JSON.stringify(rows.slice(-MAX)));window.dispatchEvent(new Event('apex-audit-updated'))}
  window.tradePilotAudit={record,read,count:()=>read().length};
  record('SYSTEM_READY',{mode:window.tradePilotAutomation?.status?.().mode||'DEMO'});
})();
