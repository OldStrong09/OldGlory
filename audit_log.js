(()=>{
 const KEY='apex-ledger-audit-v2',MAX=500;
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
 const digest=async text=>{try{if(window.crypto?.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}return 'NO_WEBCRYPTO'}catch{return 'HASH_ERROR'}};
 async function record(type,payload={}){const rows=read(),prev=rows.length?rows[rows.length-1].hash:'GENESIS',row={id:crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(16).slice(2),at:new Date().toISOString(),type:String(type),payload,prevHash:prev};row.hash=await digest(JSON.stringify(row));rows.push(row);localStorage.setItem(KEY,JSON.stringify(rows.slice(-MAX)));window.dispatchEvent(new Event('apex-audit-updated'));return row}
 function verify(){const rows=read();for(let i=1;i<rows.length;i++)if(rows[i].prevHash!==rows[i-1].hash)return {valid:false,index:i,reason:'Cadena de auditoría rota'};return {valid:true,count:rows.length}};
 window.tradePilotAudit={record,read,count:()=>read().length,verify};
 record('SYSTEM_READY',{mode:window.tradePilotAutomation?.status?.().mode||'DEMO',liveLocked:true});
})();
