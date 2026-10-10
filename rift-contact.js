/* Solaria: sole UI unlock gate for Rift biographies and relationship archive */
(()=>{
'use strict';
const KEY='solaria-noctis-contact-v1';
const root=document.getElementById('rift-contact');
let saved=false;
try{saved=localStorage.getItem(KEY)==='linked'}catch(_){}
window.SOLARIA_RIFT_UNLOCKED=saved;
if(!root)return;
const message=document.getElementById('riftContactMessage');
const instruction=document.getElementById('riftContactInstruction');
const indicator=document.getElementById('riftContactIndicator');
const tones=root.querySelectorAll('[data-rift-tone]');
const progress=[...document.querySelectorAll('#riftContactProgress span')];
const reset=document.getElementById('riftContactReset');
const rewards=document.getElementById('riftContactRewards');
const sequence=['silence','pulse','call'];
let position=0, linked=saved;
const words=['첫 번째 파장이 고요해집니다. 아직 응답은 없습니다.','두 번째 파장이 저편의 맥동과 맞닿습니다. 마지막 부름만 남았습니다.'];
const redraw=()=>{
 progress.forEach((e,i)=>e.classList.toggle('lit',i<position));
 root.dataset.state=linked?'linked':position?'tuning':'waiting';
 tones.forEach(button=>{button.disabled=linked;button.setAttribute('aria-pressed','false')});
 reset.hidden=linked;
 rewards.hidden=!linked;
 indicator.textContent=linked?'✦ 교신 성립':'● '+(position?'조율 진행 중':'연결되지 않음');
 const caption=root.querySelector('.rift-contact-ring-caption b');
 if(caption)caption.textContent=linked?'SIGNAL FOUND':position?'FREQUENCY TUNING':'NO SIGNAL';
};
function reveal(){
 linked=true;position=3;
 window.SOLARIA_RIFT_UNLOCKED=true;
 try{localStorage.setItem(KEY,'linked')}catch(_){}
 message.innerHTML='<span class="rift-contact-speaker">균열 너머에서 들려오는 목소리</span><strong>“……들리는구나. 너는 누구냐?”</strong><small>교신이 성립했다. 아직 답해야 할 질문은 남아 있다.</small>';
 instruction.textContent='금지된 교신 성공 · 봉인 기록이 열렸습니다.';
 redraw();
 // Refresh affected live views without navigating away from the transmitted voice.
 try{if(typeof setRegion==='function'&&document.querySelector('.rtab.on')?.dataset.r==='rift')setRegion('rift',false)}catch(_){}
 try{if(typeof filt!=='undefined'&&typeof setFilter==='function')setFilter(filt)}catch(_){}
 try{window.SOLARIA_ATLAS?.refresh?.()}catch(_){}
 window.dispatchEvent(new Event('solaria:rift-contact-success'));
}
function activate(tone){
 if(linked)return;
 if(tone!==sequence[position]){
  position=0;
  message.textContent='파장이 흩어졌다. 저편은 다시 침묵한다. 봉인문을 읽고 처음부터 조율해 보자.';
  instruction.textContent='조율 실패 · 첫 번째 파장부터 다시 시도할 수 있습니다.';
  redraw();return;
 }
 position+=1;
 if(position===sequence.length){reveal();return}
 message.textContent=words[position-1];
 instruction.textContent=position+'/3 파장 조율 완료 · 다음 파장을 선택하세요.';
 redraw();
}
tones.forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.riftTone)));
reset.addEventListener('click',()=>{if(linked)return;position=0;message.textContent='저편은 아무 말도 하지 않는다. 희미한 잡음만 들린다.';instruction.textContent='세 개의 파장을 올바른 순서로 조율하세요.';redraw()});
function navigate(where){
 if(!linked)return;
 if(where==='bonds'){window.SOLARIA_ATLAS?.focus?.(11);return}
 if(where==='people'){if(typeof setFilter==='function')setFilter('rift',11);document.getElementById('people')?.scrollIntoView({behavior:'smooth',block:'start'});return}
 if(where==='regions'){if(typeof setRegion==='function')setRegion('rift');document.getElementById('regions')?.scrollIntoView({behavior:'smooth',block:'start'})}
}
root.querySelectorAll('[data-rift-destination]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.riftDestination)));
function begin(){
 root.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 if(!linked){root.classList.remove('is-summoned');void root.offsetWidth;root.classList.add('is-summoned')}
}
window.SOLARIA_RIFT_CONTACT={begin,isLinked:()=>linked,navigate};
if(saved){
 position=3;
 message.innerHTML='<span class="rift-contact-speaker">교신 기록 · 연결 확인</span><strong>“……들리는구나. 너는 누구냐?”</strong><small>이전에 교신이 성립했습니다. 봉인 기록을 다시 열람할 수 있습니다.</small>';
 instruction.textContent='교신 성공 · 균열의 공개 기록 열람 가능';
}
redraw();
})();