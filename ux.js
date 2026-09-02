(()=>{
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function readPlan(){try{return JSON.parse(localStorage.getItem('tradepilot-plan-v1')||'{}')}catch{return {}}}
  function addPlanJournal(){
    const save=$('#save-plan'),calc=$('#plan-to-calc');
    if(!save||!calc||$('#plan-to-journal'))return;
    const b=document.createElement('button');b.id='plan-to-journal';b.className='ghost-btn';b.textContent='Enviar plan al diario →';
    calc.insertAdjacentElement('afterend',b);
    b.onclick=()=>{
      const p=readPlan();
      if(p.bias==='ESPERAR'){alert('El plan está en ESPERAR. No se puede convertir en una operación hasta definir LONG o SHORT.');return}
      if(!p.entry||!p.sl||!p.tp){alert('Completa Entrada, Stop Loss y Take Profit antes de enviar el plan.');return}
      const go=window.go;
      if(typeof go==='function')go('journal');
      setTimeout(()=>{
        $('#trade-form-card')?.classList.remove('hidden');
        if($('#trade-symbol'))$('#trade-symbol').value=String(p.symbol||'').toUpperCase();
        if($('#trade-side'))$('#trade-side').value=p.bias==='SHORT'?'SHORT':'LONG';
        if($('#trade-entry'))$('#trade-entry').value=p.entry;
        if($('#trade-sl'))$('#trade-sl').value=p.sl;
        if($('#trade-tp'))$('#trade-tp').value=p.tp;
        if($('#trade-strategy'))$('#trade-strategy').value='Plan de mercado';
        if($('#trade-notes'))$('#trade-notes').value=p.thesis||'';
        $('#trade-form-card')?.scrollIntoView({behavior:'smooth',block:'start'});
      },80);
    };
  }
  function addDataHealth(){
    const host=$('#view-dashboard');if(!host||$('#data-health'))return;
    const card=document.createElement('div');card.id='data-health';card.className='card';
    card.innerHTML='<div class="section-head"><div><h2>Estado de la cuenta demo</h2><p>Comprobación rápida de tus datos locales.</p></div></div><div class="discipline-list" id="data-health-list"></div>';
    const footer=host.querySelector('.app-footer');host.insertBefore(card,footer||null);
    updateHealth();
  }
  function updateHealth(){const list=$('#data-health-list');if(!list)return;let trades=[];try{trades=JSON.parse(localStorage.getItem('tradepilot-trades-v2')||'[]')}catch{}const plan=readPlan(),valid=Array.isArray(trades);list.innerHTML=`<div><span>Operaciones guardadas</span><strong>${valid?trades.length:0}</strong></div><div><span>Plan guardado</span><strong>${plan.entry&&plan.sl&&plan.tp?'✓':'—'}</strong></div><div><span>Almacenamiento</span><strong>LOCAL</strong></div><div><span>Ejecución real</span><strong>DESACTIVADA</strong></div>`}
  function init(){addPlanJournal();addDataHealth();updateHealth()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);window.addEventListener('apex-data-updated',updateHealth);
})();
