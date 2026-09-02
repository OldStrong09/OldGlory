(()=>{
  const $=s=>document.querySelector(s),KEY='tradepilot-trades-v2';
  const sessions=['ASIA','LONDRES','NY','LONDRES+NY','OTRA'];
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  function addField(){
    const form=$('#trade-form'),strategy=$('#trade-strategy');
    if(!form||!strategy||$('#trade-session'))return;
    const label=document.createElement('label');label.id='trade-session-label';label.innerHTML='<span>Sesión de mercado</span><select id="trade-session">'+sessions.map(x=>`<option value="${x}">${x}</option>`).join('')+'</select>';
    strategy.parentElement.insertAdjacentElement('afterend',label);
    form.addEventListener('submit',()=>setTimeout(patchLatest,60));
  }
  function patchLatest(){
    const a=read();if(!a.length)return;const s=$('#trade-session')?.value||'OTRA',i=a.length-1;
    if(a[i]&&a[i].result!==''){a[i].session=s;a[i].recordedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(a));window.tradePilotAnalytics?.render();}
  }
  function addSummary(){
    const host=$('#view-journal');if(!host||$('#journal-quality'))return;
    const card=document.createElement('div');card.id='journal-quality';card.className='card';card.innerHTML='<div class="section-head"><div><h2>Calidad del registro</h2><p>La calidad del análisis depende de la calidad de los datos.</p></div></div><div class="risk-grid" id="journal-quality-grid"></div>';
    host.appendChild(card);const a=read(),closed=a.filter(x=>Number.isFinite(Number(x.result))),withSession=closed.filter(x=>x.session),withStrategy=closed.filter(x=>String(x.strategy||'').trim());
    $('#journal-quality-grid').innerHTML=`<div><span>Trades cerrados</span><strong>${closed.length}</strong></div><div><span>Con sesión</span><strong>${withSession.length}/${closed.length}</strong></div><div><span>Con estrategia</span><strong>${withStrategy.length}/${closed.length}</strong></div>`;
  }
  function init(){addField();addSummary()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',init);
})();
