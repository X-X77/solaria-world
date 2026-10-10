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
const FRAGMENTS={
 north:{text:"방벽 관측일지에는 평소의 습격과 다른 마물들의 움직임이 기록되어 있다. 방벽의 손상보다 그들이 향하던 방향이 더 큰 문제로 남았다.",missing:"최초 발견자 · 추적 목적"},
 capital:{text:"황실 계승 문서의 승인란은 비어 있다. 두 후계자의 이름은 여러 차례 등장하지만 황제의 최종 서명이 남겨진 페이지는 확인되지 않았다.",missing:"최종 승인 · 비공개 조서"},
 south:{text:"항구의 운송 장부에는 곡물과 금화가 빼곡하다. 그러나 특정 물품의 명칭만 검은 잉크로 덮여 있고, 금액 대신 서명이 남은 페이지가 있다.",missing:"물품의 정체 · 서명자"},
 east:{text:"수호자 일족의 구술 기록에는 스무 해 전의 징후가 짧게 언급된다. 숲 깊은 석판에 관한 기록은 남았지만 그날의 증언은 끊겨 있다.",missing:"석판 원문 · 목격자"},
 west:{text:"변경군 보고서와 황실 측 문서는 같은 사건을 다르게 적었다. 한쪽은 명령에 대한 저항, 다른 쪽은 변경을 지키기 위한 거절이라 기록한다.",missing:"첫 명령 · 충돌의 시작"},
 rift:{text:"균열 관측 기록은 반복된 울림과 방향만 남겼다. 소리를 들었다는 증언은 있지만, 누구의 이름이었는지는 기록마다 일치하지 않는다.",missing:"호명된 이름 · 마지막 문장"}
};
const FRAGMENT_KEY='solaria-volume-fragments-v1';
let recovered=new Set();
try{const saved=JSON.parse(localStorage.getItem(FRAGMENT_KEY)||'[]');if(Array.isArray(saved))recovered=new Set(saved.filter(k=>Object.hasOwn(FRAGMENTS,k)))}catch(e){}
function saveRecovery(){try{localStorage.setItem(FRAGMENT_KEY,JSON.stringify([...recovered]))}catch(e){}}
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let selected=0;
shelf.innerHTML=volumes.map((v,i)=>'<button type="button" class="lib-seal" data-lib-volume="'+i+'" aria-pressed="false" style="--seal-color:'+v.color+';--seal-image:url(img/r/'+v.id+'.jpg)"><span class="lib-seal-number">RECORD '+String(i+1).padStart(2,'0')+' / 06</span><span class="lib-seal-symbol" aria-hidden="true">'+v.symbol+'</span><b class="lib-seal-title">'+esc(v.name)+'</b><span class="lib-seal-sub">'+esc(v.sub)+'</span></button>').join('');
function render(){
 const item=volumes[selected],fragment=FRAGMENTS[item.id],opened=recovered.has(item.id);
 shelf.querySelectorAll('[data-lib-volume]').forEach(b=>{
  const isSelected=Number(b.dataset.libVolume)===selected;
  b.setAttribute('aria-pressed',String(isSelected));
  b.classList.toggle('lib-visited',recovered.has(volumes[Number(b.dataset.libVolume)].id));
 });
 detail.style.setProperty('--lib-region-color',item.color);
 detail.innerHTML='<div class="lib-detail-top"><span>CLASSIFIED DOCUMENT / '+String(selected+1).padStart(2,'0')+'</span><span>'+(opened?'PARTIALLY RESTORED':'DOCUMENT INCOMPLETE')+'</span></div>'+
 '<h3 class="lib-detail-title">'+esc(item.name)+'</h3>'+
 '<blockquote class="lib-detail-quote">“'+esc(item.line)+'”</blockquote>'+
 '<p class="lib-detail-body">'+esc(item.note)+'</p>'+
 (opened?'<section class="lib-fragment" tabindex="-1"><small>RECOVERED / PARTIAL TRANSCRIPT</small><h4>복원된 문서 일부</h4><p>'+esc(fragment.text)+'</p>'+
 '<div class="lib-fragment-remainder"><span>여전히 판독 불가</span><b>████ █████ ████</b><small>'+esc(fragment.missing)+'</small></div></section>':
 '<button type="button" class="lib-recovery" data-lib-recover="'+item.id+'" aria-label="'+esc(item.name)+'의 지워진 문장 판독하기">'+
 '<span class="lib-document-damage" aria-hidden="true"><span></span><span></span><span></span></span>'+
 '<b>지워진 문장 조사하기 <i aria-hidden="true">↗</i></b><small>누르면 판독 가능한 일부 문장만 드러납니다.</small></button>')+
 '<div class="lib-detail-top lib-document-footer"><span>'+(opened?'중요한 부분은 여전히 지워져 있습니다.':'문서의 잉크 아래에 희미한 흔적이 남아 있습니다.')+'</span><span>RESTRICTED</span></div>'+
 '<div class="lib-document-actions"><button type="button" data-lib-region="'+item.id+'">관련 권역으로 이동 ↗</button>'+
 (item.caseId?'<button type="button" data-lib-case="'+item.caseId+'">연결된 사건 조사 ↗</button>':'')+'</div>';
}
shelf.addEventListener('click',e=>{
 const button=e.target.closest('[data-lib-volume]');if(!button)return;
 selected=Number(button.dataset.libVolume);render();
 if(window.matchMedia('(max-width:740px)').matches)detail.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
});
detail.addEventListener('click',e=>{
 const recover=e.target.closest('[data-lib-recover]');
 if(recover&&recover.dataset.libRecover===volumes[selected].id){
  recovered.add(recover.dataset.libRecover);saveRecovery();render();
  detail.querySelector('.lib-fragment')?.focus({preventScroll:true});return;
 }
 const region=e.target.closest('[data-lib-region]');
 if(region){if(typeof setRegion==='function')setRegion(region.dataset.libRegion,false);document.getElementById('regions')?.scrollIntoView({behavior:'smooth',block:'start'});return}
 const nextCase=e.target.closest('[data-lib-case]');
 if(nextCase){document.querySelector('#arcFiles [data-record="'+nextCase.dataset.libCase+'"]')?.click();document.getElementById('libCases')?.scrollIntoView({behavior:'smooth',block:'start'});}
});
render();
})();