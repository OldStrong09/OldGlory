(()=>{
  const $=s=>document.querySelector(s);
  const SETTINGS_KEY='apex-ledger-ui-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}catch{return {}}};
  const save=s=>localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  const euro=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(Number(n)||0);

  function install(){
    const nav=document.querySelector('aside nav');
    if(nav && !nav.querySelector('[data-view="settings"]')){
      const b=document.createElement('button');
      b.className='nav-item'; b.dataset.view='settings'; b.innerHTML='⚙ <span>Configuración</span>';
      b.onclick=()=>open(); nav.appendChild(b);
    }
    if($('#view-settings')) return;
    const main=document.querySelector('.main');
    const footer=main.querySelector('.app-footer');
    const section=document.createElement('section');
    section.id='view-settings'; section.className='view';
    section.innerHTML=`
      <div class="hero-grid stats-grid">
        <div class="card"><div class="card-label">ESTADO</div><div class="metric">DEMO</div><div class="muted">Sin ejecución real</div></div>
        <div class="card"><div class="card-label">DATOS</div><div class="metric" id="settings-trades">0</div><div class="muted">operaciones guardadas</div></div>
        <div class="card"><div class="card-label">ALMACENAMIENTO</div><div class="metric">LOCAL</div><div class="muted">solo este navegador</div></div>
        <div class="card"><div class="card-label">VERSIÓN</div><div class="metric">1.0</div><div class="muted">Apex Ledger</div></div>
      </div>
      <div class="two-col">
        <div class="card">
          <div class="section-head"><div><h2>Configuración de la cuenta</h2><p>Parámetros centrales de tu cuenta demo.</p></div></div>
          <div class="form-grid">
            <label>Capital demo (€)<input id="set-capital" type="number" min="0" step="100"></label>
            <label>Riesgo por operación (%)<input id="set-risk" type="number" min="0" max="10" step="0.1"></label>
            <label>Pérdida máxima diaria (%)<input id="set-daily" type="number" min="0" max="100" step="0.5"></label>
            <label>Máx. operaciones/día<input id="set-max-trades" type="number" min="1" max="100" step="1"></label>
          </div>
          <button id="settings-save" class="primary-btn">Guardar configuración</button>
          <span id="settings-status" class="muted"></span>
        </div>
        <div class="card">
          <div class="section-head"><div><h2>Arquitectura Apex</h2><p>Cada módulo tiene una función concreta.</p></div></div>
          <div class="discipline-list">
            <div><span>Dashboard</span><strong>Control</strong></div>
            <div><span>Mercados</span><strong>Análisis</strong></div>
            <div><span>Calculadora</span><strong>Riesgo</strong></div>
            <div><span>Diario</span><strong>Registro</strong></div>
            <div><span>Estadísticas</span><strong>Aprendizaje</strong></div>
            <div><span>Checklist</span><strong>Disciplina</strong></div>
            <div><span>Backup</span><strong>Seguridad</strong></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-head"><div><h2>Estado de la aplicación</h2><p>Controles para comprobar que Apex Ledger sigue funcionando como entorno de entrenamiento.</p></div></div>
        <div class="risk-grid">
          <div><span>Modo</span><strong>DEMO / MANUAL</strong></div>
          <div><span>Ejecución broker</span><strong>DESACTIVADA</strong></div>
          <div><span>Datos externos</span><strong>TradingView</strong></div>
        </div>
        <div class="notice success">✓ Tus operaciones y configuración se almacenan localmente. Haz exportaciones periódicas desde el Diario.</div>
      </div>`;
    main.insertBefore(section,footer);
    hydrate();
  }

  function hydrate(){
    const s=window.tradePilotRisk?.riskSettings?.()||{capital:10000,riskPct:1,maxDailyLossPct:3,maxTradesDay:5};
    $('#set-capital').value=s.capital; $('#set-risk').value=s.riskPct; $('#set-daily').value=s.maxDailyLossPct; $('#set-max-trades').value=s.maxTradesDay;
    let trades=[]; try{trades=JSON.parse(localStorage.getItem('tradepilot-trades-v2')||'[]')}catch{}
    $('#settings-trades').textContent=trades.length;
    $('#settings-save').onclick=()=>{
      const next={capital:+$('#set-capital').value||0,riskPct:+$('#set-risk').value||0,maxDailyLossPct:+$('#set-daily').value||0,maxTradesDay:Math.max(1,+$('#set-max-trades').value||1)};
      if(window.tradePilotRisk?.saveRiskSettings) window.tradePilotRisk.saveRiskSettings(next);
      else localStorage.setItem('tradepilot-risk-settings-v1',JSON.stringify(next));
      save({lastUpdated:new Date().toISOString()});
      $('#settings-status').textContent=' · Guardado correctamente';
      document.dispatchEvent(new Event('apex-settings-updated'));
    };
  }

  function open(){
    install();
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active-view'));
    $('#view-settings').classList.add('active-view');
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view==='settings'));
    $('#page-title').textContent='Configuración';
    hydrate();
  }
  window.tradePilotSettings={open,install};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install); else install();
})();