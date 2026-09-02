(()=>{
  const TRADE_KEY='tradepilot-trades-v2', PLAN_KEY='tradepilot-plan-v1', RISK_KEY='tradepilot-risk-settings-v1';
  const cleanText=v=>String(v??'').replace(/[<>]/g,'').slice(0,2000);
  const cleanTrade=t=>({
    id:cleanText(t?.id||crypto.randomUUID()).slice(0,100),
    date:/^\d{4}-\d{2}-\d{2}$/.test(String(t?.date||''))?String(t.date):new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid'}).format(new Date()),
    symbol:cleanText(t?.symbol).slice(0,40).toUpperCase(),side:t?.side==='SHORT'?'SHORT':'LONG',
    entry:cleanText(t?.entry).slice(0,50),exit:cleanText(t?.exit).slice(0,50),sl:cleanText(t?.sl).slice(0,50),tp:cleanText(t?.tp).slice(0,50),
    result:cleanText(t?.result).slice(0,50),rr:cleanText(t?.rr).slice(0,50),strategy:cleanText(t?.strategy),notes:cleanText(t?.notes),
    ...(t?.session?{session:['ASIA','LONDRES','NY','LONDRES+NY','OTRA'].includes(t.session)?t.session:'OTRA'}:{}),
    ...(t?.recordedAt?{recordedAt:cleanText(t.recordedAt).slice(0,50)}:{})
  });
  try{const raw=localStorage.getItem(TRADE_KEY);const data=raw?JSON.parse(raw):[];localStorage.setItem(TRADE_KEY,JSON.stringify(Array.isArray(data)?data.map(cleanTrade):[]))}catch{localStorage.setItem(TRADE_KEY,'[]')}
  try{const raw=localStorage.getItem(PLAN_KEY);const p=raw?JSON.parse(raw):{};const safe={symbol:cleanText(p?.symbol).slice(0,40).toUpperCase(),entry:cleanText(p?.entry).slice(0,50),sl:cleanText(p?.sl).slice(0,50),tp:cleanText(p?.tp).slice(0,50),bias:['LONG','SHORT','ESPERAR'].includes(p?.bias)?p.bias:'LONG',thesis:cleanText(p?.thesis)};localStorage.setItem(PLAN_KEY,JSON.stringify(safe))}catch{localStorage.setItem(PLAN_KEY,'{}')}
  try{const raw=localStorage.getItem(RISK_KEY),s=raw?JSON.parse(raw):{};const safe={capital:Math.max(0,Number(s?.capital)||10000),riskPct:Math.min(10,Math.max(0,Number(s?.riskPct)||1)),maxDailyLossPct:Math.min(100,Math.max(0,Number(s?.maxDailyLossPct)||3)),maxTradesDay:Math.max(1,Math.round(Number(s?.maxTradesDay)||5))};localStorage.setItem(RISK_KEY,JSON.stringify(safe))}catch{localStorage.setItem(RISK_KEY,JSON.stringify({capital:10000,riskPct:1,maxDailyLossPct:3,maxTradesDay:5}))}
})();
