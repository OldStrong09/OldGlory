(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=v=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(v)||0);
  function renderTable(data){
    const host=$('#journal-table');if(!host)return;
    if(!data.length){host.innerHTML='<div class="empty">No hay operaciones que coincidan con los filtros.</div>';return}
    host.innerHTML='<table class="table"><thead><tr><th>Fecha</th><th>Activo</th><th>Dir.</th><th>Entrada</th><th>Salida</th><th>Resultado</th><th>R:R</th><th></th></tr></thead><tbody>'+data.map(t=>`<tr><td>${esc(t.date)}</td><td><strong>${esc(t.symbol)}</strong></td><td>${esc(t.side)}</td><td>${esc(t.entry)}</td><td>${esc(t.exit)}</td><td class="${Number(t.result)>=0?'positive':'negative'}">${money(t.result)}</td><td>${t.rr?esc(Number(t.rr).toFixed(2)):'—'}</td><td></td></tr>`).join('')+'</tbody></table>';
  }
  window.tradePilotRenderTable=renderTable;
  function addSessionFilter(){
    const host=$('#journal-filter');if(!host||$('#journal-session-filter'))return;
    const s=document.createElement('select');s.id='journal-session-filter';s.className='compact-input';s.innerHTML='<option value="all">Todas las sesiones</option><option value="ASIA">Asia</option><option value="LONDRES">Londres</option><option value="NY">Nueva York</option><option value="LONDRES+NY">Londres + NY</option><option value="OTRA">Otra</option>';
    host.insertAdjacentElement('afterend',s);s.onchange=renderJournalSafe;
    $('#journal-search')?.addEventListener('input',renderJournalSafe);host.addEventListener('change',renderJournalSafe);
  }
  function renderJournalSafe(){
    const q=($('#journal-search')?.value||'').trim().toLowerCase(),f=$('#journal-filter')?.value||'all',session=$('#journal-session-filter')?.value||'all';
    const data=read().reverse().filter(t=>(!q||[t.symbol,t.strategy,t.notes].map(x=>String(x||'')).join(' ').toLowerCase().includes(q))&&(f==='all'||(f==='win'&&Number(t.result)>0)||(f==='loss'&&Number(t.result)<0)||t.side===f)&&(session==='all'||t.session===session));
    renderTable(data);
  }
  function calculatorGuard(){
    const asset=$('#calc-asset'),warning=$('#calc-warning');if(!asset||!warning)return;
    const map={generic:'Acciones / Crypto: confirma si el precio representa directamente el P&L por unidad.',forex:'Forex: el tamaño depende del par, divisa de la cuenta y valor del pip. Confirma la especificación de tu broker.',gold:'Oro / CFD: confirma tamaño de contrato y valor por punto/pip del instrumento antes de usar el resultado.'};
    const update=()=>{const text=map[asset.value];if(text&&!warning.textContent.includes('Confirma')&&!warning.textContent.includes('confirma'))warning.textContent+=' · '+text};
    asset.addEventListener('change',()=>setTimeout(update,0));update();
  }
  function improvePlanButton(){
    const b=$('#plan-to-calc');if(!b||b.dataset.apexFixed)return;b.dataset.apexFixed='1';b.title='ESPERAR no se convierte automáticamente en LONG';
    b.addEventListener('click',()=>{if($('#plan-bias')?.value==='ESPERAR')setTimeout(()=>alert('El plan está marcado como ESPERAR. Revisa el sesgo antes de calcular una posición.'),120)},true);
  }
  function init(){addSessionFilter();calculatorGuard();improvePlanButton()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);
})();
