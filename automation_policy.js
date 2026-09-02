(()=>{
 const KEY='apex-ledger-automation-policy-v1';
 const DEFAULT={mode:'DEMO',automationEnabled:false,liveExecutionEnabled:false,killSwitch:false};
 const read=()=>{try{return {...DEFAULT,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...DEFAULT}}};
 const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
 const allowedModes=['DEMO','PAPER','SUPERVISED','LIVE'];
 function status(){const s=read();return {...s,liveLocked:true,liveExecutionEnabled:false}};
 function setMode(mode){if(!allowedModes.includes(mode))throw new Error('Modo no permitido');const s=read();if(mode==='LIVE'){s.mode='SUPERVISED';s.liveExecutionEnabled=false;alert('LIVE permanece bloqueado. Primero deben superarse las puertas de seguridad.')}else{s.mode=mode;s.automationEnabled=false}save(s);window.tradePilotAudit?.record('MODE_CHANGE',{mode:s.mode});window.dispatchEvent(new Event('apex-automation-updated'));return status()}
 function armKillSwitch(){const s=read();s.killSwitch=true;s.automationEnabled=false;save(s);window.tradePilotAudit?.record('KILL_SWITCH_ARMED',{});window.dispatchEvent(new Event('apex-automation-updated'));return status()}
 function resetKillSwitch(){const s=read();s.killSwitch=false;s.automationEnabled=false;save(s);window.tradePilotAudit?.record('KILL_SWITCH_RESET',{});window.dispatchEvent(new Event('apex-automation-updated'));return status()}
 window.tradePilotAutomation={status,setMode,armKillSwitch,resetKillSwitch,allowedModes};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('script');s.src='qualification_ui.js';document.body.appendChild(s)});else{const s=document.createElement('script');s.src='qualification_ui.js';document.body.appendChild(s)}
})();
