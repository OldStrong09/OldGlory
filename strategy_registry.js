(()=>{
 const registry={
  'RR_DISCIPLINE_V1':{version:1,name:'RR Discipline',description:'Prototipo transparente basado en compatibilidad de niveles y R:R.',rules:['LONG: SL < entry < TP','SHORT: SL > entry > TP','R:R objetivo >= 1.5'],riskModel:'fixed-percent'},
  'WAIT_FIRST_V1':{version:1,name:'Wait First',description:'Regla conservadora que prioriza ESPERAR cuando faltan datos.',rules:['Datos incompletos => ESPERAR','Niveles incompatibles => ESPERAR','No ejecuta operaciones reales'],riskModel:'fixed-percent'}
 };
 function list(){return Object.entries(registry).map(([id,x])=>({id,...x}))}
 function get(id){return registry[String(id)]||null}
 function validate(id,input={}){const s=get(id);if(!s)return {valid:false,reasons:['Estrategia no registrada']};const side=input.side,entry=Number(input.entry),stop=Number(input.stop),target=Number(input.target);if(!['LONG','SHORT'].includes(side))return {valid:false,reasons:['Dirección inválida']};if(![entry,stop,target].every(Number.isFinite))return {valid:false,reasons:['Niveles inválidos']};const ok=side==='LONG'?stop<entry&&target>entry:stop>entry&&target<entry;const rr=Math.abs(target-entry)/Math.abs(entry-stop);return {valid:ok&&rr>=1.5,reasons:[...(ok?[]:['Niveles incompatibles']),...(rr>=1.5?[]:['R:R < 1.5'])],strategy:id}}
 window.tradePilotStrategies={list,get,validate};
})();