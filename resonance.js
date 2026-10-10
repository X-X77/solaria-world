/* Solaria — independent random press-and-hold resonance. */
(()=>{
'use strict';
const root=document.getElementById('resonance');if(!root)return;
const device=document.getElementById('resDevice'),phase=document.getElementById('resPhase'),panel=document.getElementById('resResult');
const SAVE='solaria-forbidden-experiment-v1',MIN_HOLD=1200;
const outcomes=[
 {limit:.68,state:'success',title:'일반 공명 반응',line:'은빛 파장이 고요하게 퍼집니다. 마석은 당신의 접촉을 받아들이고, 다시 일정한 빛으로 돌아갑니다.'},
 {limit:.88,state:'success',title:'강화 공명 반응',line:'푸른빛이 수정 깊숙한 곳까지 번집니다. 맑고 강한 울림이 연구실을 채웠습니다.'},
 {limit:.96,state:'unstable',title:'불안정 반응',line:'보랏빛 파장이 서로 어긋납니다. 장치가 떨리며 정체를 알 수 없는 잔류 신호를 남겼습니다.',record:'seal'},
 {limit:.99,state:'burst',title:'폭주 반응 · 장치 손상',line:'마력이 허용 범위를 넘어섰습니다. 고리에 검붉은 균열이 번지고, 측정값이 끊겼습니다.',record:'force'},
 {limit:1,state:'nox',title:'기록 외 반응 감지',line:'빛이 깨지는 순간, 정지된 장치 너머에서 목소리가 들렸습니다.',quote:'“……찾았다.” — 녹스',record:'rare'}
];
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
 // A fresh unbiased draw for every valid release; no history or hold duration input.
 const n=new Uint32Array(1);crypto.getRandomValues(n);
 const roll=n[0]/4294967296;
 return outcomes.find(o=>roll<o.limit);
}
function renderOutcome(o){
 setState(o.state);phase.textContent=o.state==='nox'?'기록 외 반응 · 발신자 불명':o.title;
 panel.replaceChildren();
 const label=document.createElement('span');label.textContent='관측 기록';
 const title=document.createElement('h4');title.textContent=o.title;
 const text=document.createElement('p');text.textContent=o.line;
 panel.append(label,title,text);
 if(o.quote){const quote=document.createElement('blockquote');quote.textContent=o.quote;panel.append(quote)}
 if(o.record){saveSeenRareEvent(o.record);const note=document.createElement('small');note.textContent='발견한 반응이 기밀 기록실에 보관되었습니다.';panel.append(note)}
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
 source=input;started=performance.now();ready=false;setState('charging');phase.textContent='접촉 중 · 빛이 모이고 있습니다';tick();return true;
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
