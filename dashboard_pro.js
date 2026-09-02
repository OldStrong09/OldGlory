(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=v=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(v)||0);
  function stats(){
    const a=read().filter(t=>String(t.result??'').trim()!==''&&Number.isFinite(Number(t.result))),n=a.length;
    const net=a.reduce((s,t)=>s+Number(t.result),0),wins=a.filter(t=>Number(t.result)>0),loss=a.filter(t=>Number(t.result)<0);
    const grossW=wins.reduce((s,t)=>s+Number(t.result),0),grossL=Math.abs(loss.reduce((s,t)=>s+Number(t.result),0));
    const expectancy=n?net/n:0,pf=grossL?grossW/grossL:null;
    let peak=0,eq=0,maxDD=0;a.forEach(t=>{eq+=Number(t.result);peak=Math.max(peak,eq);maxDD=Math.min(maxDD,eq-peak)});
    const group=(key,requireData=false)=>{const m={};a.forEach(t=>{const raw=String(t[key]||'').trim();if(requireData&&!raw)return;const k=raw||'Sin dato';(m[k]??=[]).push(Number(t.result))});return Object.entries(m).map(([k,v])=>({k,n:v.length,net:v.reduce((x,y)=>x+y,0),avg:v.reduce((x,y)=>x+y,0)/v.length})).sort((x,y)=>y.net-x.net)};
    const complete=a.filter(t=>String(t.session||'').trim()&&String(t.strategy||'').trim()&&String(t.sl||'').trim()&&String(t.tp||'').trim()&&String(t.notes||'').trim()).length;
    const quality=n?Math.round(complete/n*100):0;
    const monthly={};a.forEach(t=>{const k=/^\d{4}-\d{2}/.test(t.date)?String(t.date).slice(0,7):'Sin fecha';(monthly[k]??=[]).push(Number(t.result))});
    const months=Object.entries(monthly).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,6).map(([k,v])=>({k,n:v.length,net:v.reduce((x,y)=>x+y,0),wr:v.filter(x=>x>0).length/v.length*100}));
    let streak=0,best=0,worst=0; a.forEach(t=>{if(Number(t.result)>0){streak=streak>=0?streak+1:1;best=Math.max(best,streak)}else if(Number(t.result)<0){streak=streak<=0?streak-1:-1;worst=Math.min(worst,streak)}});
    return {n,net,expectancy,pf,maxDD,sessions:group('session',true),strategies:group('strategy',true),quality,months,bestStreak:best,worstStreak:Math.abs(worst)};
  }
  function card(title,value,sub=''){return `<div class="card"><div class="card-label">${esc(title)}</div><div class="metric">${esc(value)}</div><div class="muted">${esc(sub)}</div></div>`}
  function render(){
    const host=$('#view-dashboard');if(!host||$('#dashboard-pro'))return;
    const c=document.createElement('div');c.id='dashboard-pro';c.className='card';c.innerHTML='<div class="section-head"><div><h2>Panel de rendimiento</h2><p>Lectura rápida para mejorar el proceso, no para perseguir beneficios.</p></div></div><div class="hero-grid" id="dashboard-pro-grid"></div><div class="two-col"><div><h3>Mejor sesión</h3><div id="dashboard-best-session" class="insight">—</div></div><div><h3>Mejor estrategia</h3><div id="dashboard-best-strategy" class="insight">—</div></div></div><div class="two-col"><div><h3>Calidad del registro</h3><div id="dashboard-quality" class="insight">—</div></div><div><h3>Rachas</h3><div id="dashboard-streaks" class="insight">—</div></div></div><div><h3>Evolución mensual</h3><div id="dashboard-monthly" class="table-wrap">—</div></div><div id="dashboard-risk-warning"></div>';
    const footer=host.querySelector('.app-footer');host.insertBefore(c,footer||null);update();
  }
  function update(){
    const host=$('#dashboard-pro');if(!host)return;const s=stats(),risk=window.tradePilotRisk?.riskStatus?.();
    $('#dashboard-pro-grid').innerHTML=card('EXPECTATIVA / TRADE',money(s.expectancy),`${s.n} operaciones cerradas`)+card('DRAWDOWN MÁXIMO',money(s.maxDD),'sobre la curva acumulada')+card('PROFIT FACTOR',s.pf===null?'—':s.pf.toFixed(2),'ganancia bruta / pérdida bruta')+card('RESULTADO NETO',money(s.net),'resultado acumulado');
    const bs=s.sessions[0],bt=s.strategies[0];
    $('#dashboard-best-session').innerHTML=bs?`<strong>${esc(bs.k)}</strong> · ${money(bs.net)} · ${bs.n} trades · media ${money(bs.avg)}`:'Necesitas operaciones cerradas con sesión registrada.';
    $('#dashboard-best-strategy').innerHTML=bt?`<strong>${esc(bt.k)}</strong> · ${money(bt.net)} · ${bt.n} trades · media ${money(bt.avg)}`:'Necesitas operaciones cerradas con estrategia registrada.';
    $('#dashboard-quality').innerHTML=s.n?`<strong>${s.quality}%</strong> de los trades tienen sesión, estrategia, SL, TP y notas completos.`:'Registra operaciones cerradas para medir la calidad.';
    $('#dashboard-streaks').innerHTML=s.n?`Mejor racha: <strong>${s.bestStreak} W</strong> · Peor racha: <strong>${s.worstStreak} L</strong>`:'—';
    $('#dashboard-monthly').innerHTML=s.months.length?`<table class="table"><thead><tr><th>Mes</th><th>Trades</th><th>Resultado</th><th>Win rate</th></tr></thead><tbody>${s.months.map(m=>`<tr><td>${esc(m.k)}</td><td>${m.n}</td><td class="${m.net>=0?'positive':'negative'}">${money(m.net)}</td><td>${m.wr.toFixed(1)}%</td></tr>`).join('')}</tbody></table>`:'Aún no hay datos mensuales.';
    const w=$('#dashboard-risk-warning');if(w)w.innerHTML=risk&&risk.blocked?'<div class="notice warning" id="dashboard-risk-warning-box">⚠️ El límite de riesgo diario está bloqueado. Revisa el diario antes de registrar otra operación demo.</div>':'';
  }
  function init(){render();update()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);window.addEventListener('risk-updated',update);window.addEventListener('apex-data-updated',update);
})();
