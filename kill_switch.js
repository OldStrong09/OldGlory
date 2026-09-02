(()=>{
  const KEY='apex-ledger-kill-switch-v1';
  const read=()=>localStorage.getItem(KEY)==='ARMED';
  const arm=()=>{localStorage.setItem(KEY,'ARMED');window.tradePilotAutomation?.armKillSwitch();window.dispatchEvent(new Event('apex-kill-switch'));return true};
  const disarm=()=>{localStorage.setItem(KEY,'SAFE');window.tradePilotAutomation?.resetKillSwitch();window.dispatchEvent(new Event('apex-kill-switch'));return false};
  window.tradePilotKillSwitch={isArmed:read,arm,disarm};
})();
