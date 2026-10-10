/* Solaria Six Restricted Volumes: keep seal links and clue data. */
(()=>{
'use strict';
const shelf=document.getElementById('sgrid'),detail=document.getElementById('sealDetail');
if(!shelf||!detail)return;
const volumes=[
 {id:'north',name:'북부의 지워진 기록',sub:'보레알 대공령',symbol:'❄',color:'#9DB8D6',line:'얼음 아래 묻힌 약속은 한 번도 녹은 적이 없다.',note:'글라시스 방벽은 지금도 마물 숲을 가로막는다. 그러나 방벽에서 일어난 모든 일이 대공가의 공식 기록에 남는 것은 아니다.',caseId:'a'},
 {id:'capital',name:'황궁의 공백',sub:'솔라리아 황도',symbol:'♛',color:'#E5C57E',line:'태양 아래에서 지워진 글자일수록 그림자가 짙다.',note:'황제는 아직 후계자를 정하지 않았다. 옥좌를 둘러싼 모든 말 가운데 정작 마지막 결정만은 남아 있지 않다.',caseId:'c'},
 {id:'south',name:'상단의 봉인 장부',sub:'오스트랄 대항구',symbol:'✥',color:'#88BFCF',line:'가장 비싼 보석은 한때 뛰고 있었다.',note:'남부는 거래와 항로로 번영하지만, 어떤 장부에는 매매 내역보다 말하지 않은 약속이 더 중요하다.',caseId:null},
 {id:'east',name:'숲의 기억',sub:'아우로라 숲',symbol:'✧',color:'#9BCC9E',line:'숲은 그날을 기억한다. 눈이 붉게 내리던 스무 해 전을.',note:'외부인에게 닫힌 숲과 깊은 곳의 석판. 그날의 진상을 말해줄 증언은 아직 기록되지 않았다.',caseId:null},
 {id:'west',name:'잘려 나간 첫 문장',sub:'서부 변경',symbol:'⚔',color:'#E1A074',line:'먼저 칼을 뽑은 쪽은 언제나 기록되지 않는다.',note:'변경백은 황실의 편입 요구를 거절했다. 그러나 서부의 갈등을 어느 쪽이 먼저 시작했는지는 문서만으로 확정할 수 없다.',caseId:null},
 {id:'rift',name:'이름 없는 기록',sub:'균열',symbol:'◇',color:'#B9A0EF',line:'부르는 소리는 처음부터 하나의 이름을 향했다.',note:'균열에서 들려온 소리가 누구를 찾았는지는 아직 밝혀지지 않았다. 보고서의 마지막 문장은 복원되지 않았다.',caseId:'a'}
];
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let selected=0;
shelf.innerHTML=volumes.map((v,i)=>'<button type="button" class="lib-seal" data-lib-volume="'+i+'" aria-pressed="false" style="--seal-color:'+v.color+';--seal-image:url(img/r/'+v.id+'.jpg)"><span class="lib-seal-number">RECORD '+String(i+1).padStart(2,'0')+' / 06</span><span class="lib-seal-symbol" aria-hidden="true">'+v.symbol+'</span><b class="lib-seal-title">'+esc(v.name)+'</b><span class="lib-seal-sub">'+esc(v.sub)+'</span></button>').join('');
function render(){
 const v=volumes[selected];
 shelf.querySelectorAll('[data-lib-volume]').forEach((b,i)=>b.setAttribute('aria-pressed',String(selected===i)));
 detail.style.setProperty('--lib-region-color',v.color);
 detail.innerHTML='<div class="lib-detail-top"><span>CLASSIFIED DOCUMENT / '+String(selected+1).padStart(2,'0')+'</span><span>DOCUMENT INCOMPLETE</span></div>'+
 '<h3 class="lib-detail-title">'+esc(v.name)+'</h3>'+
 '<blockquote class="lib-detail-quote">“'+esc(v.line)+'”</blockquote>'+
 '<p class="lib-detail-body">'+esc(v.note)+'</p>'+
 '<div class="lib-document-damage" aria-hidden="true"><span></span><span></span><span></span></div>'+
 '<div class="lib-detail-top"><span>삭제된 부분은 복구되지 않았습니다.</span><span>RESTRICTED</span></div>'+
 '<div class="lib-document-actions"><button type="button" data-lib-region="'+v.id+'">관련 권역으로 이동 ↗</button>'+
 (v.caseId?'<button type="button" data-lib-case="'+v.caseId+'">연결된 사건 조사 ↗</button>':'')+'</div>';
}
shelf.addEventListener('click',e=>{
 const button=e.target.closest('[data-lib-volume]');if(!button)return;
 selected=Number(button.dataset.libVolume);render();
 if(window.matchMedia('(max-width:740px)').matches)detail.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
});
detail.addEventListener('click',e=>{
 const region=e.target.closest('[data-lib-region]');
 if(region){if(typeof setRegion==='function')setRegion(region.dataset.libRegion,false);document.getElementById('regions')?.scrollIntoView({behavior:'smooth',block:'start'});return}
 const nextCase=e.target.closest('[data-lib-case]');
 if(nextCase){document.querySelector('#arcFiles [data-record="'+nextCase.dataset.libCase+'"]')?.click();document.getElementById('libCases')?.scrollIntoView({behavior:'smooth',block:'start'});}
});
render();
})();