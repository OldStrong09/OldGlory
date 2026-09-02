(()=>{
  const KEY='apex-ledger-paper-v1';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const write=x=>localStorage.setItem(KEY,JSON.stringify(x.slice(-1000)));
  function submit(order){
    const p={id:crypto?.randomUUID?.()||String(Date.now()),status:'SIMULATED',createdAt:new Date().toISOString(),symbol:String(order?.symbol||''),side:order?.side==='SHORT'?'SHORT':'LONG',entry:Number(order?.entry),stop:Number(order?.stop),target:Number(order?.target),units:Number(order?.units||0),note:String(order?.note||'')};
    if(!p.symbol||![p.entry,p.stop,p.target].every(Number.isFinite))throw new Error('Orden paper incompleta');
    const rows=read();rows.push(p);write(rows);window.tradePilotAudit?.record('PAPER_ORDER',p);window.dispatchEvent(new Event('apex-paper-updated'));return p;
  }
  function cancel(id){const rows=read().map(x=>x.id===id?{...x,status:'CANCELLED',cancelledAt:new Date().toISOString()}:x);write(rows);window.tradePilotAudit?.record('PAPER_CANCEL',{id});window.dispatchEvent(new Event('apex-paper-updated'))}
  window.tradePilotPaper={orders:read,submit,cancel};
})();
