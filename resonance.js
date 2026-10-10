
/* Magical stone attunement — fictional world experience, no account required. */
(()=>{
'use strict';
const root=document.getElementById('resonance');if(!root)return;
const el=document.getElementById('resContent'),gem=document.getElementById('resGem'),phase=document.getElementById('resPhase');
const key='solaria-resonance-v1';
const types={
 north:{title:'빙설의 수호석',code:'BOREAL · GUARDIAN',color:'#A7CEEC',intro:'소란이 닥칠수록 먼저 주변을 지키려는 마음에 마석이 응답했습니다.',note:'북부의 차가운 마석은 오래 버티는 결의를 알아봅니다. 당신에게서 감지된 파장은 단단하고 조용합니다.',region:'north',person:'카시안 보레알',personNo:3,group:'north'},
 capital:{title:'태양의 권능석',code:'AURUM · SOVEREIGN',color:'#E5C278',intro:'질서를 세우고 선택의 결과를 감당하려는 마음에 마석이 공명했습니다.',note:'황도의 태양 마석은 선명한 의지에 반응합니다. 그 빛은 눈부시지만, 때로는 그늘을 길게 드리웁니다.',region:'capital',person:'아우구스 솔라리아',personNo:1,group:'capital'},
 tower:{title:'성운의 탐구석',code:'ARCANA · SCHOLAR',color:'#BCABE6',intro:'알려지지 않은 것을 이해하려는 호기심에 마석이 반응했습니다.',note:'마탑의 기록에 따르면 이 파장은 탐구와 해석의 성질을 띱니다. 답을 찾기 위해 더 깊은 질문을 던지는 유형입니다.',region:'capital',person:'노바',personNo:8,group:'tower'},
 east:{title:'녹음의 공명석',code:'AURORA · WARDEN',color:'#98CBA3',intro:'변화를 서두르기보다 생명의 흐름을 살피는 마음에 마석이 공명했습니다.',note:'동부의 숲은 모든 것을 기억합니다. 이 감응은 기다림과 회복, 오래된 기억을 보듬는 힘을 연상시킵니다.',region:'east',person:'일리아나',personNo:5,group:'east'},
 west:{title:'황혼의 결단석',code:'VESPER · VANGUARD',color:'#E2A878',intro:'위험 앞에서 물러서지 않는 선택이 강한 파장을 만들었습니다.',note:'서부 변경에서 발견되는 거친 감응은 행동과 결단을 상징합니다. 결과를 두려워하면서도 길을 여는 사람의 빛입니다.',region:'west',person:'발레리아 베스퍼',personNo:6,group:'west'},
 south:{title:'조류의 교섭석',code:'AUSTRAL · VOYAGER',color:'#86C7CE',intro:'사람 사이에 다리를 놓고 새로운 기회를 찾는 마음에 마석이 반응했습니다.',note:'남부의 바다처럼 유연하게 움직이는 감응입니다. 낯선 사람과 낯선 이야기 사이에서 가능성을 발견합니다.',region:'south',person:'루치안 베르가',personNo:4,group:'south'}
};
const questions=[
 {title:'성문 밖에서 낯선 사람이 도움을 요청한다면?',opts:[['먼저 위험을 막고 안전한 곳으로 데려간다','north'],['상황을 파악한 뒤 책임질 수 있는 선택을 한다','capital'],['왜 여기까지 왔는지 원인을 조사한다','tower'],['당장의 상태를 돌보고 이야기를 들어준다','east']]},
 {title:'당신에게 낯선 지역으로 떠날 기회가 생겼다.',opts:[['아무도 가려 하지 않는 변경으로 향한다','west'],['항구에서 다양한 사람과 정보를 모은다','south'],['오래된 숲과 잊힌 유적을 살펴본다','east'],['마탑에서 관련 문헌부터 조사한다','tower']]},
 {title:'위험한 비밀을 알게 되었다면?',opts:[['사람들이 다치기 전에 단호하게 움직인다','north'],['정식 권한을 가진 사람과 질서를 세운다','capital'],['증거를 모아 진실을 확인한다','tower'],['신뢰할 수 있는 사람과 정보를 교환한다','south']]},
 {title:'함께하는 사람들 사이에 갈등이 생겼다.',opts:[['중재하며 서로의 입장을 이어 준다','south'],['기다리고 경청해 감정을 가라앉힌다','east'],['문제를 정면으로 마주하고 결정한다','west'],['모두에게 공정한 원칙을 마련한다','capital']]},
 {title:'당신이 가장 소중하게 생각하는 것은?',opts:[['지키겠다는 약속','north'],['스스로 내리는 결단','west'],['아직 발견하지 못한 지식','tower'],['사람과 사람을 잇는 인연','south'],['오래 이어질 평온','east'],['흔들리지 않는 책임','capital']]}
];
let answers=[],step=0,finalType=null;
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&Array.isArray(saved.answers)&&saved.answers.length===5&&saved.answers.every((a,i)=>questions[i].opts.some(o=>o[1]===a))){answers=saved.answers;step=5;finalType=typeof saved.type==='string'&&types[saved.type]?saved.type:null}}catch(e){}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function chooseType(){
 const scores=Object.fromEntries(Object.keys(types).map(k=>[k,0]));
 answers.forEach(k=>{scores[k]=(scores[k]||0)+1});
 const max=Math.max(...Object.values(scores));
 // Stable ties: earlier answers carry more weight, then established order.
 return Object.keys(types).filter(k=>scores[k]===max).sort((a,b)=>answers.indexOf(a)-answers.indexOf(b))[0]||'north';
}
function save(){try{localStorage.setItem(key,JSON.stringify({answers,type:finalType}))}catch(e){}}
function render(){
 const done=step>=questions.length;
 gem.style.setProperty('--gem',done&&types[finalType]?types[finalType].color:'#A9B8ED');
 phase.textContent=done?'RESONANCE CONFIRMED':'AWAITING RESONANCE';
 if(done){
  if(!finalType)finalType=chooseType();
  const t=types[finalType];save();
  el.innerHTML='<span class="res-result-type">EXAMINATION COMPLETE / '+esc(t.code)+'</span>'+
   '<h3 class="res-result-title">'+esc(t.title)+'</h3><p class="res-copy">'+esc(t.intro)+'</p>'+
   '<div class="res-result-note" style="--r-color:'+t.color+'">'+esc(t.note)+'</div>'+
   '<div class="res-result-links"><button type="button" class="res-secondary" data-res-region="'+t.region+'">관련 권역 보기 ↗</button><button type="button" class="res-secondary" data-res-person="'+finalType+'">'+esc(t.person)+' 기록 ↗</button></div>'+
   '<div class="res-actions"><button type="button" class="res-primary" id="resRestart">다시 검사하기 ↻</button></div>';
  el.querySelector('#resRestart').onclick=()=>{answers=[];step=0;finalType=null;try{localStorage.removeItem(key)}catch(e){}render()};
  return;
 }
 const q=questions[step];
 el.innerHTML='<div class="res-eyebrow"><span>RESONANCE TEST</span><span>QUESTION '+String(step+1).padStart(2,'0')+' / 05</span></div>'+
 '<div class="res-progress"><i style="width:'+((step+1)/questions.length*100)+'%"></i></div>'+
 '<h3>'+esc(q.title)+'</h3><p class="res-copy">가장 마음이 끌리는 선택지를 골라 주세요.</p>'+
 '<div class="res-choices">'+q.opts.map((o,i)=>'<button type="button" class="res-choice" data-res-choice="'+i+'" aria-pressed="'+(answers[step]===o[1])+'"><span>'+String.fromCharCode(65+i)+'</span>'+esc(o[0])+'</button>').join('')+'</div>'+
 '<div class="res-actions">'+(step?'<button type="button" class="res-secondary" id="resBack">← 이전</button>':'')+'<button type="button" class="res-primary" id="resNext" '+(answers[step]?'':'disabled')+'>'+(step===4?'감응 결과 확인 ↗':'다음 질문 ↗')+'</button></div>';
 el.querySelectorAll('[data-res-choice]').forEach(b=>b.onclick=()=>{
  answers[step]=q.opts[+b.dataset.resChoice][1];
  el.querySelectorAll('[data-res-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  el.querySelector('#resNext').disabled=false;
 });
 const back=el.querySelector('#resBack');
 if(back)back.onclick=()=>{step--;render()};
 el.querySelector('#resNext').onclick=()=>{
  if(!answers[step])return;
  step++;
  if(step>=questions.length)finalType=chooseType();
  render();
 };
}
el.addEventListener('click',e=>{
 const r=e.target.closest('[data-res-region]');
 if(r){if(typeof setRegion==='function')setRegion(r.dataset.resRegion,false);document.getElementById('regions').scrollIntoView({behavior:'smooth'});}
 const p=e.target.closest('[data-res-person]');
 if(p){const t=types[p.dataset.resPerson];if(t&&typeof setFilter==='function')setFilter(t.group,t.personNo);document.getElementById('people').scrollIntoView({behavior:'smooth'});}
});
render();
})();
