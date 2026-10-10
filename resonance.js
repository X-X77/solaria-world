/* Solaria — magical resonance alignment minigame v2. No personality quiz. */
(()=>{
'use strict';
const root=document.getElementById('resonance');
if(!root)return;
const area=document.getElementById('resContent'),gem=document.getElementById('resGem'),phaseText=document.getElementById('resPhase');
const storage='solaria-resonance-alignment-v1';
const values=[
 {key:'north',title:'빙설의 수호석',latin:'BOREAL · GUARDIAN',color:'#A7CEEC',region:'north',person:'카시안 보레알',faction:'north',no:3,desc:'차갑고 단단한 수호의 파장. 북부의 마석처럼 오래 버티며 흔들리지 않는 울림이 감지되었습니다.'},
 {key:'capital',title:'태양의 권능석',latin:'AURUM · SOVEREIGN',color:'#E5C278',region:'capital',person:'아우구스 솔라리아',faction:'capital',no:1,desc:'금빛으로 맥동하는 권능의 파장. 제국의 중심에서 울리는 태양 마석의 공명을 감지했습니다.'},
 {key:'tower',title:'성운의 탐구석',latin:'ARCANA · SCHOLAR',color:'#BCA9EB',region:'capital',person:'노바',faction:'tower',no:8,desc:'별빛처럼 분기하는 탐구의 파장. 아직 밝혀지지 않은 마력 구조와 반응하는 공명입니다.'},
 {key:'east',title:'녹음의 공명석',latin:'AURORA · WARDEN',color:'#98CAA2',region:'east',person:'일리아나',faction:'east',no:5,desc:'고요하면서도 오래 이어지는 숲의 파장. 고대의 녹음과 비슷한 회복의 울림이 감지되었습니다.'},
 {key:'west',title:'황혼의 결단석',latin:'VESPER · VANGUARD',color:'#E3A579',region:'west',person:'발레리아 베스퍼',faction:'west',no:6,desc:'날카롭고 빠르게 떨리는 황혼의 파장. 서부 변경의 거친 마석과 유사한 반응이 나타났습니다.'},
 {key:'south',title:'조류의 교섭석',latin:'AUSTRAL · VOYAGER',color:'#87C8CF',region:'south',person:'루치안 베르가',faction:'south',no:4,desc:'흐름을 따라 변하는 조류의 파장. 남부의 항로처럼 자유롭게 이어지는 마력의 결이 감지되었습니다.'}
];
let mode='idle',steps=[3,6,2],moves=0,result=null,lock=false,winTimer=0;
try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&saved.result&&values.some(t=>t.key===saved.result)){result=values.find(t=>t.key===saved.result);mode='result'}}catch(e){}
function persist(){try{localStorage.setItem(storage,JSON.stringify({result:result?.key||null}))}catch(e){}}
function crystalMarkup(){
 gem.innerHTML='<div class="res-game-device" aria-label="3개의 마력 고리를 기준선에 정렬하는 장치">'+
 '<span class="res-axis" aria-hidden="true"></span>'+
 [0,1,2].map(i=>'<button type="button" class="res-ring res-ring-'+i+'" data-res-ring="'+i+'" aria-label="제'+(i+1)+'고리 시계 방향 회전" title="이 고리를 눌러 시계 방향 회전"><span class="res-ring-track"><span class="res-ring-mark">◆</span></span></button>').join('')+
 '<div class="res-core"><div class="res-core-gem"></div><span class="res-core-aura"></span></div>'+
 '</div>';
 updateDevice();
}
function updateDevice(){
 gem.style.setProperty('--gem',result?.color||'#A9B8ED');
 gem.classList.toggle('res-success',mode==='resolving'||mode==='result');
 for(let i=0;i<3;i++){
  const ring=gem.querySelector('[data-res-ring="'+i+'"]');if(!ring)continue;
  const done=steps[i]===0;
  ring.classList.toggle('is-aligned',done);
  ring.disabled=mode!=='playing'||done;
  ring.querySelector('.res-ring-track').style.transform='rotate('+(steps[i]*45)+'deg)';
  ring.setAttribute('aria-label','제'+(i+1)+'고리 '+(done?'정렬 완료':'현재 '+steps[i]*45+'도, 클릭하여 시계 방향 회전'));
 }
}
function begin(){
 clearTimeout(winTimer);
 mode='playing';lock=false;moves=0;result=null;
 steps=Array.from({length:3},()=>1+Math.floor(Math.random()*7));
 crystalMarkup();render();
}
function reset(){
 clearTimeout(winTimer);
 result=null;mode='idle';steps=[3,6,2];moves=0;lock=false;
 try{localStorage.removeItem(storage)}catch(e){}
 crystalMarkup();render();
}
function turn(index,delta){
 if(mode!=='playing'||lock||!Number.isInteger(index)||index<0||index>2||steps[index]===0)return;
 steps[index]=(steps[index]+delta+8)%8;moves++;
 updateDevice();
 renderProgress();
 if(steps.every(v=>v===0)){
  lock=true;mode='resolving';phaseText.textContent='RESONANCE STABILIZED';
  gem.classList.add('res-success');
  const status=area.querySelector('.res-game-status');
  if(status)status.textContent='모든 고리가 정렬되었습니다. 마석이 파장을 판독하고 있습니다.';
  area.querySelectorAll('.res-turn-btn').forEach(b=>b.disabled=true);
  winTimer=setTimeout(()=>{
   // A stone's resonance is an in-world random magical reading, not a personality diagnosis.
   result=values[Math.floor(Math.random()*values.length)];mode='result';persist();updateDevice();render();
  },1150);
 }
}
function renderProgress(){
 const n=steps.filter(v=>v===0).length;
 phaseText.textContent=n===3?'RESONANCE STABILIZED':'ALIGNMENT '+String(n).padStart(2,'0')+' / 03';
 const counter=document.getElementById('resAligned'),bar=document.getElementById('resProgressBar');
 if(counter)counter.textContent=n+' / 3 정렬';
 if(bar)bar.style.width=(n/3*100)+'%';
 steps.forEach((v,i)=>{
  const line=area.querySelector('[data-res-row="'+i+'"]');
  if(!line)return;
  const done=v===0;
  line.classList.toggle('is-aligned',done);
  const st=line.querySelector('.res-ring-state');if(st)st.textContent=done?'✓ 정렬 완료':'미정렬 · 조율 필요';
  line.querySelectorAll('.res-turn-btn').forEach(b=>b.disabled=done);
 });
 const st=area.querySelector('.res-game-status');
 if(st&&!lock)st.textContent=n?'빛이 안정되고 있습니다. 남은 고리를 조율하세요.':'고리의 마력 표식을 위쪽 기준선에 맞춰 주세요.';
}
function render(){
 if(mode==='idle'){
  phaseText.textContent='RESONANCE DEVICE / STANDBY';
  area.innerHTML='<span class="res-game-overline">AURUM · ARCANE EXAMINATION</span><h3>마석 공명 조율</h3>'+
  '<p class="res-copy">마석은 질문하지 않습니다. 대신 당신의 손길에 따라 세 개의 마력 고리가 반응합니다.</p>'+
  '<div class="res-instructions"><b>검사 방법</b><p>고리를 클릭하거나 좌우 화살표로 회전시키세요. 각 고리의 빛나는 ◆ 표식이 <strong>맨 위의 기준선</strong>에 닿으면 자동으로 고정됩니다.</p></div>'+
  '<div class="res-game-stat"><span>조율 단계</span><strong>3개의 마력 고리</strong></div>'+
  '<div class="res-actions"><button type="button" class="res-primary" data-res-start>장치 활성화 ↗</button></div>';
 }else if(mode==='playing'||mode==='resolving'){
  area.innerHTML='<div class="res-game-head"><span>MAGIC STONE ALIGNMENT</span><b id="resAligned">0 / 3 정렬</b></div>'+
   '<div class="res-progress"><i id="resProgressBar"></i></div>'+
   '<h3>공명 고리를 맞춰 주세요</h3><p class="res-copy">각 고리의 <strong>◆ 표식</strong>을 위쪽 기준선에 맞추면 됩니다. 왼쪽 장치의 고리를 직접 눌러도 회전해요.</p>'+
   '<div class="res-ring-controls">'+[0,1,2].map(i=>'<div class="res-ring-row" data-res-row="'+i+'">'+
   '<div class="res-ring-label"><b>제 '+['Ⅰ','Ⅱ','Ⅲ'][i]+' 고리</b><small class="res-ring-state">미정렬 · 조율 필요</small></div>'+
   '<div class="res-ring-buttons"><button class="res-turn-btn" type="button" data-res-turn="'+i+'" data-res-dir="-1" aria-label="제'+(i+1)+'고리 반시계 방향 회전">↶</button>'+
   '<button class="res-turn-btn" type="button" data-res-turn="'+i+'" data-res-dir="1" aria-label="제'+(i+1)+'고리 시계 방향 회전">↷</button></div></div>').join('')+'</div>'+
   '<p class="res-game-status" role="status">고리의 마력 표식을 위쪽 기준선에 맞춰 주세요.</p>'+
   '<div class="res-actions"><button type="button" class="res-secondary" data-res-restart>처음부터 다시 조율</button></div>';
  renderProgress();
 }else if(mode==='result'){
  const t=result;phaseText.textContent='RESONANCE CONFIRMED';
  area.innerHTML='<span class="res-result-type">EXAMINATION COMPLETE · '+t.latin+'</span>'+
  '<h3 class="res-result-title">'+t.title+'</h3>'+
  '<p class="res-copy">세 개의 공명 고리가 하나의 파장으로 결합되었습니다.</p>'+
  '<div class="res-result-note" style="--r-color:'+t.color+'">'+t.desc+'</div>'+
  '<p class="res-game-status">이 결과는 성격 진단이 아닌, 마석이 이번 조율에서 보여준 가상의 공명 기록입니다.</p>'+
  '<div class="res-result-links"><button class="res-secondary" type="button" data-res-region="'+t.region+'">관련 권역 보기 ↗</button>'+
  '<button class="res-secondary" type="button" data-res-person="'+t.key+'">'+t.person+' 기록 ↗</button></div>'+
  '<div class="res-actions"><button class="res-primary" type="button" data-res-restart>다시 조율하기 ↻</button></div>';
 }
 updateDevice();
}
root.addEventListener('click',e=>{
 const start=e.target.closest('[data-res-start]');if(start){begin();return}
 const restart=e.target.closest('[data-res-restart]');if(restart){reset();return}
 const direct=e.target.closest('[data-res-ring]');if(direct){turn(+direct.dataset.resRing,1);return}
 const b=e.target.closest('[data-res-turn]');if(b){const idx=+b.dataset.resTurn,dir=+b.dataset.resDir;turn(idx,dir);return}
 const reg=e.target.closest('[data-res-region]');
 if(reg){if(typeof setRegion==='function')setRegion(reg.dataset.resRegion,false);document.getElementById('regions')?.scrollIntoView({behavior:'smooth',block:'start'});return}
 const person=e.target.closest('[data-res-person]');
 if(person){const t=values.find(x=>x.key===person.dataset.resPerson);if(t&&typeof setFilter==='function')setFilter(t.faction,t.no);document.getElementById('people')?.scrollIntoView({behavior:'smooth',block:'start'});}
});
crystalMarkup();render();
})();
