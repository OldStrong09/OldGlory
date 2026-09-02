(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  function addSessionFilter(){
    const host=$('#journal-filter');if(!host||$('#journal-session-filter'))return;
    const s=document.createElement('select');s.id='journal-session-filter';s.className='compact-input';s.innerHTML='<option value="all">Todas las sesiones</option><option value="ASIA">Asia</option><option value="LONDRES">Londres</option><option value="NY">Nueva York</option><option value="LONDRES+NY">Londres + NY</option><option value="OTRA">Otra</option>';
    host.insertAdjacentElement('afterend',s);s.onchange=renderJournalSafe;
  }
  function renderJournalSafe(){
    const q=($('#journal-search')?.value||'').trim().toLowerCase(),f=$('#journal-filter')?.value||'all',session=$('#journal-session-filter')?.value||'all';
    const data=read().reverse().filter(t=>(!q||[t.symbol,t.strategy,t.notes].map(x=>String(x||'')).join(' ').toLowerCase().includes(q))&&(f==='all'||(f==='win'&&Number(t.result)>0)||(f==='loss'&&Number(t.result)<0)||t.side===f)&&(session==='all'||t.session===session));
    if(typeof window.tradePilotRenderTable==='function')window.tradePilotRenderTable(data);
    else document.dispatchEvent(new CustomEvent('apex-journal-filter',{detail:data}));
  }
  function calculatorGuard(){
    const asset=$('#calc-asset'),warning=$('#calc-warning');if(!asset||!warning)return;
    const map={generic:'Acciones / Crypto: introduce el valor por unidad si el precio no representa directamente el P&L en euros.',forex:'Forex: el tamaño depende del par, divisa de la cuenta y valor del pip. Confirma la especificación de tu broker.',gold:'Oro / CFD: confirma tamaño de contrato y valor por punto/pip del instrumento antes de usar el resultado.'};
    const old=warning.textContent; if(!warning.dataset.apexBase)warning.dataset.apexBase=old;
    const update=()=>{const text=map[asset.value];if(text&&warning.textContent.startsWith('✓'))warning.textContent='✓ '+warning.textContent.slice(2)+' · '+text};
    asset.addEventListener('change',update);update();
  }
  function improvePlanButton(){
    const b=$('#plan-to-calc');if(!b||b.dataset.apexFixed)return;b.dataset.apexFixed='1';
    b.title='ESPERAR no se convierte automáticamente en LONG';
    b.addEventListener('click',()=>{const bias=$('#plan-bias')?.value;if(bias==='ESPERAR')setTimeout(()=>alert('El plan está marcado como ESPERAR. Revisa el sesgo antes de calcular una posición.'),120)},true);
  }
  function init(){addSessionFilter();calculatorGuard();improvePlanButton()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);
})();
