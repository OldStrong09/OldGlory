(()=>{
 const KEY='apex-ledger-paper-v1';
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
 const write=x=>localStorage.setItem(KEY,JSON.stringify(x.slice(-1000)));
 function submit(order={}){
  const p={id:crypto?.randomUUID?.()||String(Date.now()),status:'OPEN',createdAt:new Date().toISOString(),symbol:String(order.symbol||''),side:order.side,entry:Number(order.entry),stop:Number(order.stop),target:Number(order.target),units:Number(order.units||0),strategy:String(order.strategy||''),decisionId:String(order.decisionId||''),note:String(order.note||'')};
  if(!p.symbol||!['LONG','SHORT'].includes(p.side)||![p.entry,p.stop,p.target].every(Number.isFinite)||!Number.isFinite(p.units)||p.units<=0)throw new Error('Orden paper incompleta o inválida');
  const check=window.tradePilotRisk?.preflightOrder?.(p);if(check&&!check.allowed)throw new Error(check.reasons.join(' · '));
  const rows=read();rows.push(p);write(rows);window.tradePilotAudit?.record('PAPER_ORDER_OPEN',{...p,riskCheck:check});window.dispatchEvent(new Event('apex-paper-updated'));return p;
 }
 function close(id,exit,reason='MANUAL'){const rows=read(),i=rows.findIndex(x=>x.id===id);if(i<0)throw new Error('Orden paper no encontrada');const p=rows[i];const e=Number(exit);if(!Number.isFinite(e))throw new Error('Salida inválida');const pnl=(p.side==='LONG'?(e-p.entry):(p.entry-e))*p.units;p.status='CLOSED';p.exit=e;p.reason=String(reason);p.closedAt=new Date().toISOString();p.pnl=Number(pnl.toFixed(4));rows[i]=p;write(rows);window.tradePilotAudit?.record('PAPER_ORDER_CLOSE',p);window.dispatchEvent(new Event('apex-paper-updated'));return p}
 function cancel(id){const rows=read().map(x=>x.id===id&&x.status==='OPEN'?{...x,status:'CANCELLED',cancelledAt:new Date().toISOString()}:x);write(rows);window.tradePilotAudit?.record('PAPER_CANCEL',{id});window.dispatchEvent(new Event('apex-paper-updated'))}
 window.tradePilotPaper={orders:read,submit,close,cancel};
})();
