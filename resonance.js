/* Solaria — independent random press-and-hold resonance. */
(()=>{
'use strict';
const root=document.getElementById('resonance');if(!root)return;
const device=document.getElementById('resDevice'),phase=document.getElementById('resPhase'),panel=document.getElementById('resResult');
const SAVE='solaria-forbidden-experiment-v1',MIN_HOLD=1200;
const outcomes=[
 {limit:.14,state:'quiet',title:'무반응',line:'마석은 침묵을 지켰습니다. 외부의 파장에 흔들리지 않는 고요함도 하나의 성질입니다. 아직 드러나지 않은 적성을 천천히 살펴보세요.'},
 {limit:.38,state:'faint',title:'미약 반응',line:'수정 깊숙한 곳에서 작은 빛이 숨을 쉽니다. 지금은 희미하지만, 섬세한 파장을 감지할 가능성이 남아 있습니다.'},
 {limit:.69,state:'success',title:'안정 반응',line:'마력이 일정한 리듬으로 흐릅니다. 흔들림 없이 파장을 유지하는 균형 잡힌 공명입니다.'},
 {limit:.89,state:'high',title:'고출력 반응',line:'마석 중심에서 강한 빛이 솟아납니다. 풍부한 마력을 다루기 위한 제어와 수련이 필요합니다.'},
 {limit:.99,state:'unstable',title:'불안정 반응',line:'서로 다른 파장이 부딪칩니다. 변동이 큰 마력도 자신만의 흐름을 찾으면 새로운 가능성이 됩니다.',record:'seal'},
 {limit:1,state:'burst',title:'기록 외 이상 반응',line:'분류표에 없는 파장이 관측되었습니다. 수정에 균열이 번지고 측정 장치가 경고를 남깁니다.',record:'force'}
];
const attributes=[
 {name:'불',color:'255,119,76',line:'열을 일으키고 변화를 이끄는 파장입니다.'},
 {name:'물',color:'77,174,255',line:'흐름을 읽고 유연하게 이어지는 파장입니다.'},
 {name:'바람',color:'138,231,205',line:'보이지 않는 움직임을 따라 퍼지는 파장입니다.'},
 {name:'땅',color:'213,169,98',line:'단단한 기반을 세우고 형태를 지탱하는 파장입니다.'},
 {name:'번개',color:'210,157,255',line:'순간의 집중으로 길을 여는 파장입니다.'},
 {name:'얼음',color:'169,232,255',line:'고요한 결정 안에 힘을 응축하는 파장입니다.'},
 {name:'빛',color:'255,238,173',line:'감춰진 흔적을 비추고 밝혀내는 파장입니다.'},
 {name:'그림자',color:'147,114,211',line:'빛이 닿지 않는 경계에 머무는 파장입니다.'}
];
function randomUnit(){const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]/4294967296}
const noxReactions=[
 {id:'dismiss',text:'너무 미미하군.'},
 {id:'curious',text:'성장할 여지는 있나?'},
 {id:'heir',text:'역시, 후계자……'}
];
function drawNoxReaction(){
 // One independent uniform choice between the three utterances after the rare 1% event.
 const n=new Uint32Array(1);crypto.getRandomValues(n);
 return noxReactions[Math.floor(n[0]/4294967296*noxReactions.length)];
}
function makeNoxQuote(){
 const reaction=drawNoxReaction();
 const quote=document.createElement('blockquote');
 quote.className='nox-quote nox-'+reaction.id;
 if(reaction.id==='heir'){
  quote.append(document.createTextNode('“역시, '));
  const distorted=document.createElement('span');
  distorted.className='nox-redacted';
  distorted.textContent='▨▨▨';
  distorted.setAttribute('aria-label','후계자');
  quote.append(distorted,document.createTextNode('……”'));
 }else{
  quote.textContent='“'+reaction.text+'”';
 }
 const who=document.createElement('cite');
 who.append(document.createTextNode('— '));
 const hiddenName=document.createElement('span');
 hiddenName.className='nox-redacted';
 hiddenName.textContent='▨▨';
 hiddenName.setAttribute('aria-label','녹스');
 who.append(hiddenName);
 quote.append(who);
 return quote;
}

let started=null,source=null,frame=0,cooldown=0,ready=false;
function setState(state){root.dataset.state=state}
function saveSeenRareEvent(key){
 try{
  let saved=JSON.parse(localStorage.getItem(SAVE)||'null');
  if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={version:1};
  saved.history={...saved.history,[key]:true};
  localStorage.setItem(SAVE,JSON.stringify(saved));
 }catch(e){}
 window.dispatchEvent(new CustomEvent('solaria-forbidden-log'));
}
function evaluateResult(){
 // Three independent draws; neither duration nor saved discovery history changes odds.
 const strengthRoll=randomUnit();
 const strength=outcomes.find(o=>strengthRoll<o.limit);
 const attribute=attributes[Math.floor(randomUnit()*attributes.length)];
 const nox=randomUnit()<.01;
 return {strength,attribute,nox};
}
function renderOutcome({strength,attribute,nox}){
 setState(nox?'nox':strength.state);
 root.style.setProperty('--res-light',nox?'236,44,78':attribute.color);
 phase.textContent=nox?'시스템 경고 · 기록 외 음성 감지':strength.title+' · '+attribute.name+' 속성';
 panel.replaceChildren();
 const label=document.createElement('span');label.textContent='마법사 적성 관측';
 const title=document.createElement('h4');title.textContent=nox?'기록 외 반응 감지':strength.title;
 const text=document.createElement('p');text.textContent=nox?'붉은 균열이 관측 기록을 침범했습니다. 속성 판독이 알 수 없는 목소리로 대체됩니다.':strength.line;
 const profile=document.createElement('dl');profile.className='res-profile';
 for(const [name,value] of [['반응 강도',strength.title],['적성 속성',nox?'판독 중단 · 기록 손상':attribute.name]]){
  const row=document.createElement('div'),term=document.createElement('dt'),definition=document.createElement('dd');
  term.textContent=name;definition.textContent=value;row.append(term,definition);profile.append(row);
 }
 panel.append(label,title,profile,text);
 if(nox){
  const warning=document.createElement('p');warning.className='res-system-warning';warning.textContent='SYSTEM WARNING / 기록 외 신호 · 속성 기록 덮어쓰기';panel.append(warning,makeNoxQuote());
 }else{
  const detail=document.createElement('p');detail.className='res-attribute-note';detail.textContent=attribute.name+' · '+attribute.line;panel.append(detail);
 }
 const records=new Set([strength.record,nox?'rare':null].filter(Boolean));
 for(const key of records)saveSeenRareEvent(key);
 if(records.size){const note=document.createElement('small');note.textContent='발견한 반응이 기밀 기록실에 보관되었습니다.';panel.append(note)}
 cooldown=performance.now()+900;
}
function tick(){
 if(started===null)return;
 const elapsed=performance.now()-started;
 root.style.setProperty('--charge',Math.min(elapsed/3000,1));
 if(!ready&&elapsed>=MIN_HOLD){ready=true;phase.textContent='파장 감지 · 손을 떼어 관측하세요'}
 frame=requestAnimationFrame(tick);
}
function holdStart(input){
 if(started!==null||performance.now()<cooldown)return false;
 root.style.removeProperty('--res-light');source=input;started=performance.now();ready=false;setState('charging');phase.textContent='접촉 중 · 빛이 모이고 있습니다';tick();return true;
}
function holdEnd(cancel=false){
 if(started===null)return;
 const elapsed=performance.now()-started;started=null;source=null;cancelAnimationFrame(frame);root.style.setProperty('--charge',0);
 if(cancel){setState('idle');phase.textContent='접촉이 중단되었습니다. 다시 손을 대어 주세요.';return}
 if(elapsed<MIN_HOLD){setState('idle');phase.textContent='반응이 약합니다. 조금 더 오래 접촉해 보세요.';return}
 renderOutcome(evaluateResult());
}
device.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0)return;
 if(holdStart(e.pointerId)){e.preventDefault();device.focus({preventScroll:true});device.setPointerCapture(e.pointerId)}
});
device.addEventListener('pointerup',e=>{if(source===e.pointerId)holdEnd()});
device.addEventListener('pointercancel',e=>{if(source===e.pointerId)holdEnd(true)});
device.addEventListener('lostpointercapture',e=>{if(source===e.pointerId)holdEnd(true)});
device.addEventListener('pointermove',e=>{
 if(source!==e.pointerId||e.pointerType!=='mouse')return;
 const r=device.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)holdEnd(true);
});
device.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)holdStart(e.key)}});
device.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&source===e.key){e.preventDefault();holdEnd()}});
device.addEventListener('blur',()=>holdEnd(true));
window.addEventListener('blur',()=>holdEnd(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)holdEnd(true)});
})();
