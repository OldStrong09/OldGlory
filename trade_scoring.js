(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const esc=v=>String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const n=v=>Number.isFinite(Number(v))?Number(v):null;
  const riskPerTrade=()=>{const s=window.tradePilotRisk?.riskSettings?.();return s?Math.abs(Number(s.capital||0)*Number(s.riskPct||0)/100):null};
  function score(t,all){
    let points=0,errors=[]; const sl=n(t.sl),tp=n(t.tp),entry=n(t.entry),rr=n(t.rr),result=n(t.result),risk=riskPerTrade();
    if(sl!==null&&tp!==null){points+=20}else errors.push('SL/TP incompleto');
    if(String(t.strategy||'').trim()){points+=15}else errors.push('Sin estrategia');
    if(String(t.notes||'').trim()){points+=15}else errors.push('Sin notas');
    if(rr!==null&&rr>=1.5){points+=15}else if(rr!==null&&rr>=1){points+=8;errors.push('R:R ajustado')}else errors.push('R:R bajo');
    if(String(t.session||'').trim()){points+=10}else errors.push('Sin sesión');
    if(entry!==null&&sl!==null&&tp!==null){const valid=t.side==='LONG'?(sl<entry&&tp>entry):(sl>entry&&tp<entry);if(valid)points+=15;else errors.push('Niveles incompatibles')}else errors.push('Plan incompleto');
    if(result!==null&&risk!==null){if(Math.abs(result)<=risk*1.05)points+=10;else errors.push('Pérdida > riesgo planificado')}
    const same=all.filter(x=>String(x.strategy||'').trim()===String(t.strategy||'').trim());
    if(String(t.strategy||'').trim()&&same.length>=3){const recent=same.slice(-3);if(recent.every(x=>n(x.result)!==null&&n(x.result)<0))errors.push('3 pérdidas seguidas en estrategia')}
    return {score:Math.max(0,Math.min(100,points)),errors};
  }
  function decorate(){
    const table=$('#journal-table');if(!table)return;const rows=[...table.querySelectorAll('tbody tr')];const data=read().slice().reverse();const head=table.querySelector('thead tr');
    if(head&&!head.querySelector('.score-head')){const th=document.createElement('th');th.className='score-head';th.textContent='Calidad';head.insertBefore(th,head.lastElementChild)}
    rows.forEach((row,i)=>{const old=row.querySelector('.trade-score');if(old)old.remove();const t=data[i];if(!t)return;const x=score(t,data),td=document.createElement('td');td.className='trade-score';td.innerHTML=`<strong>${x.score}/100</strong>${x.errors.length?`<div class="muted">${esc(x.errors.slice(0,2).join(' · '))}${x.errors.length>2?'…':''}</div>`:'<div class="muted">Sin errores clave</div>'}`;row.insertBefore(td,row.lastElementChild)});
  }
  function patterns(){const a=read().filter(t=>n(t.result)!==null),errors={};a.forEach(t=>score(t,a).errors.forEach(e=>errors[e]=(errors[e]||0)+1));return Object.entries(errors).sort((a,b)=>b[1]-a[1]).slice(0,5)}
  function renderPanel(){const host=$('#view-journal');if(!host)return;let c=$('#trade-quality-panel');if(!c){c=document.createElement('div');c.id='trade-quality-panel';c.className='card';c.innerHTML='<div class="section-head"><div><h2>Control de calidad del proceso</h2><p>La puntuación mide disciplina y calidad del registro; no premia ganar dinero.</p></div></div><div class="hero-grid" id="quality-grid"></div><div class="two-col"><div><h3>Errores repetidos</h3><div id="quality-errors" class="insight"></div></div><div><h3>Regla de mejora</h3><div class="insight">Un trade ganador con mala disciplina sigue siendo un trade de mala calidad. Corrige el proceso antes de aumentar el riesgo.</div></div></div>';host.appendChild(c)}updatePanel()}
  function updatePanel(){const a=read().filter(t=>n(t.result)!==null),scores=a.map(t=>score(t,a).score),avg=scores.length?scores.reduce((x,y)=>x+y,0)/scores.length:0,good=scores.filter(x=>x>=80).length,grid=$('#quality-grid'),err=$('#quality-errors');if(grid)grid.innerHTML=`<div class="card"><div class="card-label">CALIDAD MEDIA</div><div class="metric">${scores.length?Math.round(avg)+'/100':'—'}</div><div class="muted">disciplina registrada</div></div><div class="card"><div class="card-label">TRADES ≥ 80</div><div class="metric">${scores.length?good+'/'+scores.length:'—'}</div><div class="muted">alta calidad de proceso</div></div><div class="card"><div class="card-label">ERRORES RECURRENTES</div><div class="metric">${patterns().reduce((s,x)=>s+x[1],0)||0}</div><div class="muted">incidencias detectadas</div></div>`;if(err){const p=patterns();err.innerHTML=p.length?p.map(x=>`<div>• ${esc(x[0])}: <strong>${x[1]}</strong></div>`).join(''):'<div>✓ No hay errores recurrentes detectables.</div>'}}
  let last='';function refresh(){const snap=JSON.stringify(read());if(snap===last){decorate();updatePanel();return}last=snap;decorate();renderPanel();window.dispatchEvent(new Event('apex-data-updated'))}
  function init(){refresh();const j=$('#journal-table');if(j)new MutationObserver(()=>{decorate();updatePanel()}).observe(j,{childList:true,subtree:true});setInterval(refresh,1000)}
  window.tradePilotScoring={score,patterns,refresh};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
