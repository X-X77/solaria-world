/* Solaria — forbidden resonance experiment v3: scripted branching event */
(()=>{
'use strict';
const root=document.getElementById('resonance');
if(!root)return;
const area=document.getElementById('resContent'),gem=document.getElementById('resGem'),phase=document.getElementById('resPhase');
const SAVE='solaria-forbidden-experiment-v1';
const variants={
 boost:{name:'출력 증폭',line:'마력 출력이 허용 범위를 넘어섭니다. 수정 내부의 빛이 붉게 갈라집니다.',code:'OUTPUT +25%',effect:'과출력으로 장치의 손상 위험이 높아졌습니다.',route:'west',stone:'황혼의 결단석',note:'증폭된 파장이 서부의 거친 마석과 유사합니다.'},
 hold:{name:'현상 유지',line:'출력은 안정적입니다. 그러나 마석 내부에서 외부 파장이 관측됩니다.',code:'OUTPUT NORMAL',effect:'기록이 안정적으로 보존되었으나 간섭은 사라지지 않았습니다.',route:'north',stone:'빙설의 수호석',note:'고요한 파장이 북부의 수호석과 유사합니다.'},
 stabilize:{name:'안정화 각인',line:'각인이 작동합니다. 마석의 외곽은 가라앉았지만 중심에서 미지의 신호가 남습니다.',code:'SEALING GLYPH',effect:'간섭을 억제했으나 잔류 신호가 내부에 갇혔습니다.',route:'tower',stone:'성운의 탐구석',note:'잔류 파장을 분석한 결과 마탑의 탐구석과 유사합니다.'}
};
const contacts={
 west:{region:'west',faction:'west',no:6,person:'발레리아 베스퍼'},
 north:{region:'north',faction:'north',no:3,person:'카시안 보레알'},
 tower:{region:'capital',faction:'tower',no:8,person:'노바'}
};
let phaseKey='intro',first=null,last=null,rare=false,history={force:false,seal:false,rare:false},timer=0;
try{
 const saved=JSON.parse(localStorage.getItem(SAVE)||'null');
 if(saved&&typeof saved==='object'){
  for(const name of ['force','seal','rare'])history[name]=!!saved.history?.[name];
  const v=saved.last;
  if(v&&variants[v.first]&&['force','stop','seal'].includes(v.last)){
   first=v.first;last=v.last;rare=!!v.rare;phaseKey='end';
  }
 }
}catch(e){}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){
 try{localStorage.setItem(SAVE,JSON.stringify({version:1,last:first&&last?{first,last,rare}:null,history}))}catch(e){}
}
function announceArchive(){
 window.dispatchEvent(new CustomEvent('solaria-forbidden-log',{detail:{history:{...history}}}));
}
function decorate(){
 root.dataset.experimentPhase=phaseKey;
 root.dataset.experimentTone=phaseKey==='end'?(last==='force'?'critical':last==='seal'?'sealed':'safe'):phaseKey==='warning'||phaseKey==='decision'?'warning':'normal';
 gem.innerHTML='<div class="forbidden-apparatus" aria-hidden="true"><span class="forbidden-circuit one"></span><span class="forbidden-circuit two"></span><span class="forbidden-gem"></span><span class="forbidden-spark"></span></div>';
 phase.textContent={
  intro:'SPECIMEN READY · EXPERIMENT 07',
  calibration:'MEASUREMENT IN PROGRESS',
  warning:'UNKNOWN INTERFERENCE',
  decision:'EMERGENCY PROTOCOL',
  end:last==='force'?'UNCLASSIFIED · FILE SEALED':last==='seal'?'SEAL COMPLETE':'PROCEDURE TERMINATED'
 }[phaseKey]||'EXPERIMENT 07';
}
function button(action,title,description,tone=''){
 return '<button type="button" class="forbidden-choice '+tone+'" data-forbidden="'+action+'"><b>'+esc(title)+'</b><span>'+esc(description)+'</span><em aria-hidden="true">↗</em></button>';
}
function miniLog(code,value){
 return '<div class="forbidden-logline"><span>'+esc(code)+'</span><b>'+esc(value)+'</b></div>';
}
function start(){
 clearTimeout(timer);first=null;last=null;rare=Math.random()<0.08;
 phaseKey='calibration';render();
}
function decide(value){
 if(phaseKey!=='calibration'||!variants[value])return;
 first=value;phaseKey='warning';render();
}
function finish(value){
 if(phaseKey!=='decision'||!['force','stop','seal'].includes(value))return;
 last=value;phaseKey='end';
 if(value==='force')history.force=true;
 if(value==='seal')history.seal=true;
 if(rare)history.rare=true;
 persist();announceArchive();render();
}
function reset(){
 clearTimeout(timer);first=null;last=null;rare=false;phaseKey='intro';persist();render();
}
function displayIntro(){
 return '<span class="forbidden-overline">MAGIC TOWER / EXPERIMENT NO.07</span>'+
  '<h3>마탑의 금지된 실험</h3>'+
  '<p class="res-copy">제7실험기의 정상 감응 검사 기록이 일부 훼손되었습니다. 현재 관측된 이상 현상의 원인은 확인되지 않았습니다.</p>'+
  '<div class="forbidden-report"><span>실험 경고</span><p>마석의 중심부에서 원인 불명의 간섭이 반복되고 있습니다. 검사를 계속한다면 대응 조치는 관측자가 직접 결정해야 합니다.</p></div>'+
  '<div class="forbidden-status"><span>장치 상태</span><b>가동 대기</b><span class="forbidden-dot"></span></div>'+
  '<div class="res-actions"><button type="button" class="res-primary" data-forbidden="start">감응 실험 시작 ↗</button>'+
  (history.force||history.seal?'<a class="res-secondary" href="#archive">보관된 기록 열람 ↗</a>':'')+'</div>';
}
function displayCalibration(){
 return '<span class="forbidden-overline">PHASE Ⅰ / INITIAL OBSERVATION</span>'+
  '<h3>마력이 흐르기 시작합니다.</h3>'+
  '<div class="forbidden-console">'+miniLog('00:01','마력 흐름 안정')+miniLog('00:03','외부 간섭 미약')+miniLog('00:04','출력 조정 명령 대기')+'</div>'+
  '<p class="res-copy">중앙 마석이 희미하게 발광합니다. 연구실은 조용합니다. 지금 어떤 조치를 취하시겠습니까?</p>'+
  '<div class="forbidden-choices">'+
   button('boost','출력을 조금 더 높인다','간섭의 정체를 확인하기 위해 출력을 올린다.')+
   button('hold','현재 상태를 유지한다','측정값이 충분히 쌓일 때까지 기다린다.')+
   button('stabilize','안정화 각인을 삽입한다','장치가 흔들리기 전에 보호 각인을 사용한다.')+
  '</div>';
}
function displayWarning(){
 const v=variants[first];
 return '<span class="forbidden-overline">PHASE Ⅱ / ANOMALOUS SIGNAL</span>'+
  '<h3 class="forbidden-warning-title">비정상적인 파장 감지</h3>'+
  '<div class="forbidden-console warning">'+miniLog('01:09',v.code)+miniLog('01:11','기존 마석 분류와 불일치')+miniLog('01:12','외부 간섭 경고')+
  (rare?miniLog('01:13','관측자가 먼저 관측되었습니다'):'')+'</div>'+
  '<p class="res-copy">'+esc(v.line)+'</p>'+
  '<p class="forbidden-whisper">'+(rare?'「…드디어.」 — 출처를 특정할 수 없는 음성 기록':'기록되지 않은 짧은 울림이 관측실을 지나갑니다.')+'</p>'+
  '<div class="res-actions"><button type="button" class="res-primary" data-forbidden="continue">대응 조치 결정 ↗</button></div>';
}
function displayDecision(){
 return '<span class="forbidden-overline">PHASE Ⅲ / EMERGENCY PROTOCOL</span>'+
  '<h3>장치가 정지를 거부합니다.</h3>'+
  '<p class="res-copy">'+esc(variants[first].effect)+' 마석의 가장 안쪽에서 붉은 빛이 한 번 깜빡였습니다.</p>'+
  '<div class="forbidden-console danger">'+miniLog('경고','측정 불가능한 파장 감지')+miniLog('명령','관측자 결정 대기')+'</div>'+
  '<div class="forbidden-choices">'+
  button('force','실험을 강행한다','안전을 포기하고 원인을 끝까지 관측한다.','danger')+
  button('stop','즉시 장치를 정지한다','측정 가능한 값만 남기고 검사를 종료한다.')+
  button('seal','봉인 절차를 실행한다','알 수 없는 신호를 장치 안에 가둔다.','special')+
  '</div>';
}
function displayEnd(){
 const v=variants[first];
 const common='<span class="forbidden-overline">EXPERIMENT RESULT / '+(last==='force'?'UNCLASSIFIED':last==='stop'?'NORMAL RECORD':'SEALED EVIDENCE')+'</span>';
 const rareNote=rare?'<p class="forbidden-rare">[추가 음성 기록] “관측자가 먼저 관측되었다.” 연구실의 누구도 이 문장을 입력하지 않았다.</p>':'';
 if(last==='force')return common+
  '<h3 class="forbidden-warning-title">결과: 분류 불가</h3>'+
  '<div class="forbidden-console danger">'+miniLog('출력','측정 범위를 초과했습니다')+miniLog('대상','기존 마석 계열과 일치하지 않음')+miniLog('처리','기밀 등급 자동 상향')+'</div>'+
  '<p class="res-copy">'+esc(v.effect)+' 기록의 마지막에는 관측실 외부에서 발생한 것으로 보이는 신호가 남아 있습니다. 그것이 무엇인지는 밝혀지지 않았습니다.</p>'+
  rareNote+
  '<div class="forbidden-reward"><b>◆ 비정규 기록 EX-07 획득</b><p>분류 불가 반응 보고서가 기밀 기록실에 보관되었습니다.</p></div>'+endActions();
 if(last==='seal')return common+
  '<h3>결과: 임시 봉인 성공</h3>'+
  '<div class="forbidden-console sealed">'+miniLog('각인','봉인 조치 완료')+miniLog('잔류','내부 신호 감쇠')+miniLog('로그','정지 후 추가 기록 확인')+'</div>'+
  '<p class="res-copy">마석이 어두워집니다. 모든 장치가 멈춘 뒤에도 기록 장치의 잉크가 잠깐 움직였습니다. '+esc(v.effect)+'</p>'+
  rareNote+
  '<div class="forbidden-reward"><b>◆ 비정규 기록 EX-07 획득</b><p>봉인 후 잔류 신호 보고서가 기밀 기록실에 보관되었습니다.</p></div>'+endActions();
 const c=contacts[v.route];
 return common+'<h3>결과: 일반 공명 확인</h3>'+
 '<div class="forbidden-console safe">'+miniLog('차단','외부 간섭 측정 중단')+miniLog('잔여 값','정상 범위 내 기록 확보')+'</div>'+
 '<p class="res-copy">장치가 천천히 멈춥니다. '+esc(v.note)+'</p>'+
 '<div class="forbidden-reward"><b>◇ '+esc(v.stone)+'</b><p>정상 공명값을 복구했습니다. 단, 외부 간섭의 원인은 확인하지 못했습니다.</p></div>'+
 '<div class="forbidden-result-links"><button type="button" class="res-secondary" data-res-region="'+c.region+'">관련 권역 보기 ↗</button><button type="button" class="res-secondary" data-res-person="'+v.route+'">'+esc(c.person)+' 기록 ↗</button></div>'+endActions();
}
function endActions(){
 return '<div class="res-actions"><button type="button" class="res-primary" data-forbidden="restart">다른 선택으로 다시 실험 ↻</button>'+
 ((last==='force'||last==='seal')?'<a class="res-secondary" href="#archive">기밀 기록실 확인 ↗</a>':'')+'</div>';
}
function render(){
 decorate();
 area.innerHTML=phaseKey==='intro'?displayIntro():phaseKey==='calibration'?displayCalibration():phaseKey==='warning'?displayWarning():phaseKey==='decision'?displayDecision():displayEnd();
}
root.addEventListener('click',e=>{
 const choice=e.target.closest('[data-forbidden]');
 if(choice){
  const act=choice.dataset.forbidden;
  if(act==='start')start();
  else if(['boost','hold','stabilize'].includes(act))decide(act);
  else if(act==='continue'&&phaseKey==='warning'){phaseKey='decision';render()}
  else if(['force','stop','seal'].includes(act))finish(act);
  else if(act==='restart')reset();
  return;
 }
 const reg=e.target.closest('[data-res-region]');
 if(reg){if(typeof setRegion==='function')setRegion(reg.dataset.resRegion,false);document.getElementById('regions')?.scrollIntoView({behavior:'smooth',block:'start'});return}
 const person=e.target.closest('[data-res-person]');
 if(person){const c=contacts[person.dataset.resPerson];if(c&&typeof setFilter==='function')setFilter(c.faction,c.no);document.getElementById('people')?.scrollIntoView({behavior:'smooth',block:'start'});}
});
render();announceArchive();
})();