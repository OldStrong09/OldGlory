(()=>{
  const $=s=>document.querySelector(s);
  function sync(){const asset=$('#calc-asset'),contract=$('#calc-contract');if(!asset||!contract)return;if(asset.value==='generic'){contract.value='1';contract.dataset.auto='1'}else if(contract.dataset.auto==='1'){contract.value='';delete contract.dataset.auto}}
  function init(){const asset=$('#calc-asset');if(!asset)return;asset.addEventListener('change',sync);sync();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
