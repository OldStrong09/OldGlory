(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=v=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(v)||0);
  function stats(){
    const a=read().filter(t=>Number.isFinite(Number(t.result))),n=a.length,net=a.reduce((s,t)=>s+Number(t.result),0),wins=a.filter(t=>Number(t.result)>0),loss=a.filter(t=>Number(t.result)<0),grossW=wins.reduce((s,t)=>s+Number(t.result),0),grossL=Math.abs(loss.reduce((s,t)=>s+Number(t.result),0));
    const expectancy=n?net/n:0,pf=grossL?grossW/grossL:null;
    let peak=0,eq=0,maxDD=0;a.forEach(t=>{eq+=Number(t.result);peak=Math.max(peak,eq);maxDD=Math.min(maxDD,eq-peak)});
    const group=(key)=>{const m={};a.forEach(t=>{const k=String(t[key]||'Sin dato');(m[k]??=[]).push(Number(t.result))});return Object.entries(m).map(([k,v])=>({k,n:v.length,net:v.reduce((x,y)=>x+y,0),avg:v.reduce((x,y)=>x+y,0)/v.length})).sort((x,y)=>y.net-x.net)};
    return {n,net,expectancy,pf,maxDD,sessions:group('session'),strategies:group('strategy')};
  }
  function card(title,value,sub=''){return `<div class="card"><div class="card-label">${esc(title)}</div><div class="metric">${esc(value)}</div><div class="muted">${esc(sub)}</div></div>`}
  function render(){
    const host=$('#view-dashboard');if(!host||$('#dashboard-pro'))return;
    const c=document.createElement('div');c.id='dashboard-pro';c.className='card';c.innerHTML='<div class="section-head"><div><h2>Panel de rendimiento</h2><p>Lectura rápida para mejorar el proceso, no para perseguir beneficios.</p></div></div><div class="hero-grid" id="dashboard-pro-grid"></div><div class="two-col"><div><h3>Mejor sesión</h3><div id="dashboard-best-session" class="insight">—</div></div><div><h3>Mejor estrategia</h3><div id="dashboard-best-strategy" class="insight">—</div></div></div>';
    const footer=host.querySelector('.app-footer');host.insertBefore(c,footer||null);update();
  }
  function update(){
    const host=$('#dashboard-pro');if(!host)return;const s=stats(),risk=window.tradePilotRisk?.riskStatus?.();
    $('#dashboard-pro-grid').innerHTML=card('EXPECTATIVA / TRADE',money(s.expectancy),`${s.n} operaciones cerradas`)+card('DRAWDOWN MÁXIMO',money(s.maxDD),'sobre la curva acumulada')+card('PROFIT FACTOR',s.pf===null?'—':s.pf.toFixed(2),'ganancia bruta / pérdida bruta')+card('RESULTADO NETO',money(s.net),'resultado acumulado');
    const bs=s.sessions[0],bt=s.strategies[0];
    $('#dashboard-best-session').innerHTML=bs?`<strong>${esc(bs.k)}</strong> · ${money(bs.net)} · ${bs.n} trades · media ${money(bs.avg)}`:'Necesitas operaciones cerradas con sesión registrada.';
    $('#dashboard-best-strategy').innerHTML=bt?`<strong>${esc(bt.k)}</strong> · ${money(bt.net)} · ${bt.n} trades · media ${money(bt.avg)}`:'Necesitas operaciones cerradas con estrategia registrada.';
    if(risk&&risk.blocked){const p=document.createElement('div');p.className='notice warning';p.textContent='⚠️ El límite de riesgo diario está bloqueado. No abras otra operación demo hasta revisar el diario.';host.appendChild(p)}
  }
  function init(){render();update()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);window.addEventListener('risk-updated',update);
})();
