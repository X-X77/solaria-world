
/* In-site evidence hunt. Pure client-side; map and person functions untouched. */
(function(){
'use strict';
const section=document.getElementById('archive');if(!section)return;
const records=[
 {key:'a',number:'001',title:'추적당한 자',lead:'마물들은 왜 방벽 대신 한 사람을 향해 움직였을까?',
  ending:'최근 마물들의 경로가 이례적으로 달라졌고, 균열과 마물 숲 사이에는 통로가 남아 있다. 북부 대공은 그날 당신을 구했다. 그러나 그들이 왜 당신을 찾았는지까지 설명해 주는 기록은 없다.',
  clues:[
   {key:'n-world',place:'세계관 · 마물과 북부',hint:'방벽과 마물의 이동을 다룬 장',name:'달라진 행로',text:'마물들이 한 사람을 향해 움직이기 시작했다는 기록을 발견했다.',target:'world'},
   {key:'n-map',place:'제국 지도 · 마물 숲',hint:'방벽 너머 검은 숲을 지도에서 조사',name:'북쪽의 틈',text:'마물 숲은 균열 북쪽 끝의 틈과 맞닿아 있다.',target:'world'},
   {key:'n-person',place:'인물 도감 · 카시안',hint:'북부 방벽을 지키는 대공의 기록',name:'목격자',text:'카시안은 글라시스 방벽 지휘자이자 당신을 구한 인물이다.',target:'people'}]},
 {key:'b',number:'002',title:'꺼지지 않는 등불',lead:'모두가 사용하는 마석, 그러나 출처를 말하는 이는 드물다.',
  ending:'마탑은 마석을 정제해 제국의 불을 밝힌다. 하지만 출처에 관해서는 황실과 마탑만이 알고 있다고 전해진다. 이 비밀이 무엇을 감추고 있는지는 여전히 밝혀지지 않았다.',
  clues:[
   {key:'m-world',place:'세계관 · 균열과 마석',hint:'제국의 등불에 대한 설명',name:'숨겨진 출처',text:'마석의 출처는 황실과 마탑만이 안다고 한다.',target:'world'},
   {key:'m-map',place:'제국 지도 · 마탑',hint:'황도에 있는 마법사들의 탑',name:'정제의 탑',text:'마탑은 마석을 정제하는 곳이다.',target:'world'},
   {key:'m-person',place:'인물 도감 · 노바',hint:'마석 분석을 전공한 마법사',name:'분석자의 기록',text:'노바는 마석 분석을 전공한 마탑의 후계자다.',target:'people'}]},
 {key:'c',number:'003',title:'황금빛 그림자',lead:'황궁은 찬란하지만 옥좌를 바라보는 시선은 하나가 아니다.',
  ending:'황제의 병상과 두 후계자의 경쟁은 제국의 현재를 흔든다. 황녀가 가진 정보망 역시 계승전의 일부다. 기록 어디에도 황제가 누구에게 옥좌를 넘길지는 쓰여 있지 않다.',
  clues:[
   {key:'c-world',place:'세계관 · 태양의 제국',hint:'황실의 현 상황을 알리는 장',name:'흔들리는 옥좌',text:'병상의 황제와 두 후계자의 다툼을 확인했다.',target:'world'},
   {key:'c-map',place:'제국 지도 · 황궁',hint:'황실이 머무는 제국의 중심',name:'황실의 심장',text:'황궁은 황제의 병상이 자리한 곳이다.',target:'world'},
   {key:'c-person',place:'인물 도감 · 셀레네',hint:'황실의 정보망을 쥔 인물',name:'조용한 경쟁자',text:'셀레네는 사교계와 정보망을 쥔 황녀다.',target:'people'}]}
];
const recovered={
 a:{code:'NORTH / MISSING ROUTE',title:'방벽을 향하지 않은 행로',fact:'마물의 움직임은 방벽이 아니라 한 사람을 향했다. 그날 북부 대공이 그 사람을 구했다.',question:'만약 목적이 단순한 공격이었다면, 왜 그 한 사람만을 쫓았는가?',missing:'지시자의 흔적 / 추적 목적 / 당시 진술 일부'},
 b:{code:'TOWER / ORIGIN UNKNOWN',title:'출처가 없는 마석 장부',fact:'마탑이 마석을 정제하고 제국은 그것을 사용한다. 하지만 마석의 원산지는 공개되지 않았다.',question:'제국 전역에 공급되는 마석의 출처를 황실과 마탑만 알고 있는 까닭은 무엇인가?',missing:'원산지 / 최초 공급 경로 / 정제 이전 문서'},
 c:{code:'PALACE / NO DECREE',title:'작성되지 않은 계승 승인서',fact:'황제는 병상에 있지만 계승자를 정하지 않았다. 황자와 황녀의 권력 기반은 서로 다르게 자라고 있다.',question:'모두가 다음 황제를 준비하는 동안, 정작 황제는 왜 결정을 미루고 있는가?',missing:'황제의 의사 / 최종 승인 문서 / 비공개 조서'}
};
const all=records.flatMap(r=>r.clues);const valid=new Set(all.map(c=>c.key));
const files=document.getElementById('arcFiles'),paper=document.getElementById('arcPaper'),summary=document.getElementById('arcOverview'),notice=document.getElementById('arcNotice');
let found=new Set(),selected='a',hideNotice=0;
try{const s=JSON.parse(localStorage.getItem('solaria-archive-v1')||'[]');if(Array.isArray(s))found=new Set(s.filter(k=>valid.has(k)))}catch(e){}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amt=r=>r.clues.filter(c=>found.has(c.key)).length;
function persist(){try{localStorage.setItem('solaria-archive-v1',JSON.stringify([...found]))}catch(e){}}
function render(){
 summary.innerHTML='<b>수집된 단서</b><span>'+found.size+' / '+all.length+'</span><div class="arc-progress"><i style="width:'+(found.size/all.length*100)+'%"></i></div>';
 files.innerHTML=records.map(r=>'<button type="button" class="arc-tab" data-record="'+r.key+'" aria-pressed="'+(selected===r.key)+'"><small>CASE '+r.number+' · '+amt(r)+'/3</small><b>'+esc(r.title)+'</b><em>'+(amt(r)===3?'열람 가능':'미해결 기록')+'</em></button>').join('');
 const r=records.find(r=>r.key===selected),done=amt(r)===3;
 paper.innerHTML='<div class="arc-head"><span>IMPERIAL ARCHIVE / '+r.number+'</span><span>'+(done?'ACCESS GRANTED':'RESTRICTED')+'</span></div>'+
 '<div class="lib-document-code">CASE FILE · '+esc(r.number)+'</div><h3>'+esc(r.title)+'</h3><p class="arc-intro">'+esc(r.lead)+'</p><div class="arc-sub"><span>수집한 단서</span><span>'+amt(r)+' / 3</span></div>'+
 '<div class="arc-clues">'+r.clues.map((c,i)=>'<div class="arc-clue"><b>'+(found.has(c.key)?'✓ '+esc(c.name):'◇ 미발견 단서 '+(i+1))+'</b><small>'+esc(c.place)+'</small>'+
 (found.has(c.key)?'<p>'+esc(c.text)+'</p>':'<button type="button" class="arc-hint-go" data-arc-hint="'+c.key+'">이 장소로 바로 이동 ↗ <small>'+esc(c.hint)+'</small></button>')+'</div>').join('')+'</div>'+
 '<div class="arc-reward'+(done?'':' locked')+'"><span class="lib-document-code">'+esc(recovered[r.key].code)+'</span><h4>'+(done?esc(recovered[r.key].title):'훼손된 사건 기록')+'</h4>'+
 '<p>'+(done?esc(recovered[r.key].fact):'<span class="lib-redaction">█████ █████████ ███████</span>')+'</p>'+
 (done?'<div class="lib-case-dilemma"><b>아직 풀리지 않은 모순</b><p>'+esc(recovered[r.key].question)+'</p></div><small class="lib-missing">누락된 항목 · '+esc(recovered[r.key].missing)+'</small><small class="lib-caution">이 문서는 확인된 단서와 의문만 담고 있습니다. 결론은 기록되어 있지 않습니다.</small>':'<small class="lib-missing">나머지 단서를 모으면 지워진 기록과 모순된 진술을 복원할 수 있습니다.</small>')+'</div>';
}
function toast(title,msg){
 clearTimeout(hideNotice);
 notice.innerHTML='<strong>'+esc(title)+'</strong><p>'+esc(msg)+'</p><a href="#archive">기록실 확인하기 ↗</a>';
 notice.classList.add('show');hideNotice=setTimeout(()=>notice.classList.remove('show'),5300);
}
function capture(k){
 if(!valid.has(k)||found.has(k))return;
 found.add(k);persist();render();decorate();
 const r=records.find(r=>r.clues.some(c=>c.key===k));const clue=all.find(c=>c.key===k);
 toast(amt(r)===3?'기밀 기록 해금!':'단서를 발견했습니다',amt(r)===3?'「'+r.title+'」 기록을 열람할 수 있습니다.':clue.name+' · 기록실에 보관되었습니다.');
}
function button(k){
 const b=document.createElement('button');
 b.type='button';b.className='arc-find';b.dataset.clue=k;
 b.disabled=found.has(k);b.textContent=b.disabled?'단서 기록 완료':'수상한 흔적 조사';
 return b;
}
function decorateWorld(){
 const pairs=[['.world-chapter-north','n-world'],['.world-chapter-rift','m-world'],['.world-chapter-empire','c-world']];
 for(const [selector,k] of pairs){
  const host=document.querySelector('#world '+selector+' .world-chapter-content');
  if(!host)continue;
  let b=host.querySelector('[data-clue]');if(!b){b=button(k);host.append(b)}
  b.disabled=found.has(k);b.textContent=b.disabled?'단서 기록 완료':'수상한 흔적 조사';
 }
}
function decorateDynamic(containerId,headingTag,lookup,where){
 const host=document.getElementById(containerId);
 if(!host)return;
 const title=host.querySelector(headingTag)?.textContent.trim(),k=lookup[title];
 if(!k)return;
 const parent=where==='map'?host:(host.querySelector('.cinfo')||host);
 if(parent.querySelector('[data-clue]'))return;
 const b=button(k);
 const after=where==='map'?parent.querySelector('.atlas-actions'):parent.querySelector('.role');
 if(after)after.after(b);else parent.append(b);
}
const mapLookup={'마물 숲':'n-map','마탑':'m-map','황궁':'c-map'};
const personLookup={'카시안 보레알':'n-person','노바':'m-person','셀레네 솔라리아':'c-person'};
const mapAction=()=>decorateDynamic('atlasDetail','h4',mapLookup,'map');
const personAction=()=>decorateDynamic('cstage','.cinfo h3',personLookup,'person');
function decorate(){decorateWorld();mapAction();personAction()}

/* Direct hint routing. Use the existing map UI, never replace Claude's atlas logic. */
const hintTargets={
 'n-world':{type:'world',selector:'.world-chapter-north'},
 'm-world':{type:'world',selector:'.world-chapter-rift'},
 'c-world':{type:'world',selector:'.world-chapter-empire'},
 'n-map':{type:'map',region:'north',place:'north-3'},
 'm-map':{type:'map',region:'capital',place:'capital-1'},
 'c-map':{type:'map',region:'capital',place:'capital-0'},
 'n-person':{type:'person',faction:'north',no:3},
 'm-person':{type:'person',faction:'tower',no:8},
 'c-person':{type:'person',faction:'capital',no:2}
};
function openHint(key){
 const dest=hintTargets[key];if(!dest)return;
 let target=null;
 if(dest.type==='world'){
   target=document.querySelector('#world '+dest.selector);
 }else if(dest.type==='map'){
   document.querySelector('#atlasFilters [data-region="'+dest.region+'"]')?.click();
   document.querySelector('#atlasDirectory [data-place="'+dest.place+'"]')?.click();
   target=document.querySelector('#atlasDetail [data-clue="'+key+'"]')||document.getElementById('atlasDetail');
 }else if(dest.type==='person'){
   if(typeof setFilter==='function')setFilter(dest.faction,dest.no);
   target=document.querySelector('#cstage [data-clue="'+key+'"]')||document.getElementById('peopleDossier');
 }
 if(!target)return;
 target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 if(target.matches('button:not(:disabled)'))target.focus({preventScroll:true});
 target.classList.remove('arc-spotlight');
 void target.offsetWidth;
 target.classList.add('arc-spotlight');
 setTimeout(()=>target.classList.remove('arc-spotlight'),2400);
}
paper.addEventListener('click',e=>{
 const hint=e.target.closest('[data-arc-hint]');
 if(hint){e.preventDefault();openHint(hint.dataset.arcHint);}
});

files.addEventListener('click',e=>{const b=e.target.closest('[data-record]');if(!b)return;selected=b.dataset.record;render()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-clue]');if(b){e.preventDefault();capture(b.dataset.clue)}});
document.getElementById('arcReset').addEventListener('click',()=>{
 if(!confirm('수집한 단서와 해금한 기밀 기록을 초기화할까요?'))return;
 found.clear();persist();render();decorateWorld();
 for(const b of document.querySelectorAll('[data-clue]')){b.disabled=false;b.textContent='수상한 흔적 조사'}
});
if('MutationObserver' in window){
 const m=document.getElementById('atlasDetail'),p=document.getElementById('cstage');
 if(m)new MutationObserver(mapAction).observe(m,{childList:true,subtree:true});
 if(p)new MutationObserver(personAction).observe(p,{childList:true,subtree:true});
}

/* A single hidden audio record, displayed ONLY after a genuine rare Nox encounter.
   The original nine clues and all their localStorage progress are unchanged. */
const rareSlot=section.querySelector('.archive-records-slot');
const libNav=section.querySelector('.lib-nav');
function showRareAudio(){
 let discovered=false;
 try{
  discovered=JSON.parse(localStorage.getItem('solaria-forbidden-experiment-v1')||'null')?.history?.rare===true;
 }catch(e){}
 let audio=document.getElementById('arcExperimentRecords');
 let navLink=libNav.querySelector('[data-rare-audio-link]');
 if(!discovered){
  if(audio)audio.remove();
  if(navLink)navLink.remove();
  return;
 }
 if(!audio){
  audio=document.createElement('section');
  audio.id='arcExperimentRecords';
  audio.className='arc-experiment-records';
  audio.setAttribute('aria-labelledby','arcUnknownVoice');
  rareSlot.append(audio);
 }
 audio.innerHTML='<div class="arc-experiment-head"><span>UNLISTED ARCHIVE · EX-07X</span>'+
  '<h3 id="arcUnknownVoice">정체불명의 음성 기록</h3>'+
  '<p>마탑 제7실험기에서 채집된 비정규 음성.</p></div>'+
  '<div class="arc-audio-transcript"><div class="arc-audio-top"><span>RECORDING / CORRUPTED</span><span>발신자 미확인</span></div>'+
  '<p>장치가 멈춘 직후, 누구도 입력하지 않은 목소리가 기록되었다.</p>'+
  '<div class="arc-audio-redacted" aria-label="음성 원문은 손상되어 판독할 수 없음">████ ███████ ███</div>'+
  '<small>발화 내용과 발신자의 정보는 복원할 수 없습니다.</small></div>';
 if(!navLink){
  navLink=document.createElement('a');
  navLink.href='#arcExperimentRecords';
  navLink.dataset.rareAudioLink='';
  navLink.innerHTML='<span>Ⅲ</span> 비공개 음성 · 01';
  libNav.append(navLink);
 }
}
window.addEventListener('solaria-forbidden-log',showRareAudio);
render();decorate();showRareAudio();
})();
