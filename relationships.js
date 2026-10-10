/* Regional relationship atlas — public-only arcs, all 53 personas. */
(()=>{
'use strict';
const tabs=document.getElementById('bondRegionTabs'),roster=document.getElementById('bondRoster'),detail=document.getElementById('bondDetail');
if(!tabs||!roster||!detail)return;
const factions=[['north','북부'],['capital','황도'],['south','남부'],['west','서부'],['east','동부'],['tower','마탑'],['temple','교단'],['rift','균열']];
const relationPairs=[
[1,2,'대립','서로 다른 방식으로 계승권을 준비하는 남매'],[1,13,'가족','황제의 계승 결정을 기다리는 제1황자'],[2,13,'가족','황제의 결정과 궁정의 움직임을 주시하는 황녀'],
[1,14,'가족','황후의 아들'],[2,14,'가족','황후의 딸'],[14,19,'가문','황후의 친정인 세베루스 공작가'],[19,20,'가족','세베루스 가문의 공작과 영애'],[1,20,'혼담','확정되지 않은 정치적 혼담 후보'],
[1,16,'충성','황자 직속 호위기사'],[1,21,'협력','군부의 강경한 지지 세력'],[2,17,'친밀','어릴 적부터 가까운 호위기사와 황녀'],[2,22,'스승','정치와 재무를 가르치는 조언자'],
[1,15,'중립','근위기사단의 충성 대상은 황제 개인'],[2,15,'중립','근위기사단은 계승전 어느 편도 들지 않음'],
[13,15,'충성','황제 개인에게 충성하는 근위기사단장'],[15,18,'지휘','기록고 경비기사에게 절차를 강조'],[18,23,'협력','황실 기록고의 경비와 기록관 업무'],[16,17,'경쟁','양 진영 호위기사 사이의 경호 동선 갈등'],
[21,22,'대립','군비 증액과 재정 부담을 둘러싼 충돌'],[19,22,'협상','재정과 가문 이해관계를 둘러싼 거래'],[20,22,'관계','정략 혼담과 거래의 조건을 검토'],
[3,24,'가족 같은 돌봄','어릴 때부터 대공을 돌본 성 집사장'],[3,25,'전우','대공의 오른팔인 방벽 수비대장'],[3,27,'충성','대공가의 오랜 충신이자 방벽 영주'],[3,28,'영지','물자난을 견디는 북부 영주와 대공'],[3,26,'지역','성하 마을의 약사와 북부 수호자'],
[24,25,'일상 마찰','성의 질서와 거친 전선 생활을 두고 티격태격'],[25,26,'대립·협력','부상병 치료와 전선 복귀 시점을 두고 충돌'],[24,26,'지원','약재와 환자 관리를 둘러싼 협력'],[25,27,'협력','방벽의 병력 배치와 보수에 대한 상의'],[27,28,'긴장','방벽 예비 물자와 주민 구호를 둘러싼 이견'],[24,28,'지원','북부 구호 물자를 마련하기 위한 협력'],[26,28,'지원','약품 지원과 비용 책임을 두고 의견 조율'],
[4,31,'협력','베르가 상단의 주인과 엄격한 실무 담당자'],[4,32,'경쟁','남부 상권을 둘러싼 상단의 정적'],[4,29,'거래','해상 운송과 선원 보호를 둘러싼 조건 협상'],[4,30,'정보','부두의 정보 거래'],[4,33,'협상','곡창 회복과 곡물 유통에 대한 협의'],
[31,29,'계약','호위 비용과 선원 안전 조항을 확인'],[31,30,'정보','소문의 출처와 정보 가격을 검증'],[31,32,'경계','경쟁 상가의 유리한 제안을 경계'],[31,33,'협상','구호와 상환 조건을 조정'],[32,33,'긴장','곡창 위기를 둘러싼 계약 협상'],[29,30,'정보','항로 소식을 거래하되 서로를 전적으로 믿지 않음'],
[6,35,'충성·제동','변경백의 부관이며 돌발 출병에 제동을 건다'],[6,34,'협력','광산 이권과 채굴 안전을 두고 협의'],[6,36,'계약','임무별로 계약을 맺는 용병단'],[6,37,'대립','변경의 자치권과 황실의 감독권 갈등'],[6,38,'신뢰','변경백에게 아버지뻘인 토착 귀족'],[34,35,'협력','광산 안전과 군수 공급을 협의'],[34,36,'계약','갱도 호위와 위험 수당의 계약'],[34,37,'대립','생산량 압박과 광부 안전을 둘러싼 대립'],[35,36,'긴장','군의 규율과 용병 계약의 충돌'],[35,38,'조언','변경 운영에 관한 연장자의 조언'],[37,38,'대립','황실의 감독 관행과 서부 토착 관습의 충돌'],
[5,40,'사제 관계','대마법사의 제자격인 석판 지킴이'],[5,39,'오랜 접점','숲의 질서와 석판을 둘러싼 조심스러운 관계'],[5,41,'오랜 친분','숲 신전의 사제장과 대마법사'],[5,42,'중재','황실 총독과 숲 사이의 완충 역할'],[39,40,'훈육','규율과 호기심으로 충돌하는 족장과 지킴이'],[39,41,'협력·갈등','숲을 지키되 외부인을 대하는 방식이 다름'],[39,42,'대립','출입 허가와 관할권 다툼'],[40,41,'신뢰','고민을 털어놓는 석판 지킴이와 사제장'],[40,42,'경계','석판 관리와 총독부의 조사 권한'],[41,42,'중재','신앙과 행정의 문제를 놓고 협의'],
[7,8,'후임','마탑주와 후임자로 지목된 천재'],[7,46,'견제','실험 예산과 사고 책임을 둘러싼 논쟁'],[7,47,'평가','재능을 인정받고 싶은 마법사'],[7,48,'조직','마탑주의 지휘 아래 연구하는 구성원'],[8,47,'경쟁','논문·실험 성과를 놓고 다투는 라이벌'],[8,48,'동료','마탑 소수파의 공동 연구자'],[46,47,'평가','무심한 평가와 상처 입는 자존심'],[46,48,'감독','실험 보고서의 누락을 지적하는 이사'],[47,48,'긴장·협력','이론과 실험 방식으로 다투면서도 필요하면 협업'],
[9,10,'신념 차이','교리와 성녀의 자비가 충돌하기도 함'],[9,45,'충성','교주의 심문과 기록을 담당하는 오른팔'],[9,44,'후원','교단에 많은 물자를 후원하는 후작'],[10,43,'호위','성녀의 안전을 최우선으로 지키는 기사단장'],[10,44,'후원','치유와 구휼 활동을 위한 물자 지원'],[43,45,'조사','현장의 판단과 기록을 서로 검증'],[44,45,'긴장','후원금 집행 기록에 대한 감사와 확인'],
[3,6,'경쟁·협력','변경을 지키는 서로 다른 지휘관'],[3,4,'교역','북부에 필요한 물자와 운송의 거래'],[4,6,'긴장','마석 거래와 변경의 이해관계'],[4,5,'의견 차이','작물 오염의 원인을 두고 의견 차이'],[5,10,'신앙','숲의 관점과 성녀의 치유가 맞닿는 접점'],[41,10,'조언','성녀에게 조언하는 숲 신전의 사제장'],
[11,12,'신뢰','마왕과 가장 가까운 측근'],[11,49,'충성','마왕을 섬기는 기사단장'],[11,50,'참모','공존 협상을 설계하는 참모'],[11,52,'의무','마왕궁의 치유와 마력 감별'],[11,53,'보호','마왕궁의 애완 마물'],[12,49,'대립·협력','계략과 군 규율을 두고 충돌'],[12,50,'협력','정무와 정보의 신빙성을 논의'],[12,51,'훈육','정찰병이 사고를 치면 뒷수습하는 측근'],[49,50,'견해 차이','군사적 경계와 공존 협상 사이의 충돌'],[49,52,'의무','부상병의 복귀와 치료를 둘러싼 협의'],[49,51,'훈육','무단 잠입을 꾸짖는 기사단장'],[50,51,'업무','정찰 보고에서 누락된 정보를 점검'],[51,52,'보호','다친 정찰병을 돌보는 의관'],[51,53,'친근','정찰병이 아기 늑대를 알아보고 말을 붙임']
];
const byId=new Map(P.map(p=>[p.no,p]));
const edges=relationPairs.map(([a,b,type,desc])=>({a,b,type,desc})).filter(e=>byId.has(e.a)&&byId.has(e.b));
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const nameOf=p=>(p.sealed&&!window.SOLARIA_RIFT_UNLOCKED)?'열람 제한':p.name;
const isLocked=p=>p.sealed&&!window.SOLARIA_RIFT_UNLOCKED;
let region='north',selected=3;
const available=()=>P.filter(p=>p.aff===region).sort((a,b)=>b.main-a.main||a.no-b.no);
const relationFor=no=>edges.filter(e=>e.a===no||e.b===no).map(e=>({p:byId.get(e.a===no?e.b:e.a),type:e.type,desc:e.desc})).filter(e=>!!e.p);
function preview(no){
 const p=byId.get(Number(no));
 if(!p)return '';
 const rel=relationFor(p.no).filter(x=>!isLocked(x.p)).slice(0,4);
 return '<h4>이 인물의 관계</h4>'+(rel.length?rel.map(x=>'<button type="button" data-cast-relation="'+x.p.no+'">'+esc(x.p.name)+' · '+esc(x.type)+' ↗</button>').join(''):'<p>아직 공개된 관계가 없습니다.</p>')+
 '<button type="button" data-cast-relation="'+p.no+'">관계도에서 모두 보기 ↗</button>';
}
function focus(no){
 const p=byId.get(Number(no));if(!p)return;
 if(p.sealed&&!window.SOLARIA_RIFT_UNLOCKED){region='rift';selected=11}else{region=p.aff;selected=p.no}
 render();document.getElementById('bonds')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function openDossier(no){
 const p=byId.get(Number(no));if(!p||isLocked(p))return;
 if(typeof setFilter==='function')setFilter(p.aff,p.no);
 document.getElementById('people')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function render(){
 tabs.innerHTML=factions.map(([id,label])=>'<button type="button" class="bond-region-tab'+(region===id?' active':'')+'" data-region="'+id+'" aria-pressed="'+(region===id)+'">'+label+'</button>').join('');
 const cast=available();
 document.getElementById('bondRegionName').textContent=(factions.find(x=>x[0]===region)?.[1]||'제국')+' 인물 관계';
 document.getElementById('bondRegionSummary').textContent=cast.length+'명 · 전체 '+P.length+'명';
 const lockedRegion=region==='rift'&&!window.SOLARIA_RIFT_UNLOCKED;
 roster.innerHTML=(lockedRegion?'<div class="bond-lock-note"><b>균열 너머 · 열람 제한</b><p>마왕궁의 인물 기록에는 이야기의 진행에 영향을 줄 수 있는 내용이 포함됩니다.</p><button type="button" data-unlock-rift>스포일러를 확인하고 열람 ↗</button></div>':'')+
 cast.map(p=>{
 const locked=isLocked(p);
 return '<button type="button" class="bond-person'+(selected===p.no?' selected':'')+'" data-person="'+p.no+'" aria-pressed="'+(selected===p.no)+'">'+
 (locked?'<span class="bond-person-hidden">◇</span>':'<img src="img/t/'+pad(p.no)+'.jpg" alt="" loading="lazy">')+
 '<span><b>'+esc(nameOf(p))+'</b><small>'+esc(locked?'비공개 인물':p.role)+'</small></span><em>↗</em></button>';
 }).join('');
 const p=byId.get(selected);
 if(!p||p.aff!==region){selected=cast[0]?.no??3;return render()}
 if(isLocked(p)){
  detail.innerHTML='<div class="bond-detail-stamp">RESTRICTED / RIFT</div><h3>열람 제한 기록</h3><p>이 인물의 초상과 관계는 선택적으로 열람할 수 있습니다.</p><button class="bond-unlock" type="button" data-unlock-rift>균열 인물 정보 열람 ↗</button>';
  return;
 }
 const relation=relationFor(p.no);
 const visible=relation.filter(x=>!isLocked(x.p));
 const sections=visible.filter(x=>x.p.aff===p.aff),outside=visible.filter(x=>x.p.aff!==p.aff);
 const group=(title,items)=>!items.length?'':'<h4 class="bond-group-title">'+title+' <span>'+items.length+'</span></h4><div class="bond-connections">'+items.map(({p:q,type,desc})=>
 '<article class="bond-connection"><button type="button" class="bond-face" data-portrait="'+q.no+'" aria-label="'+esc(q.name)+' 일러스트 확대"><img src="img/t/'+pad(q.no)+'.jpg" alt="" loading="lazy"></button><div><button type="button" class="bond-name-link" data-select="'+q.no+'">'+esc(q.name)+' ↗</button><strong>'+esc(type)+'</strong><p>'+esc(desc)+'</p></div><button class="bond-doc-link" type="button" data-dossier="'+q.no+'">도감</button></article>').join('')+'</div>';
 detail.innerHTML='<div class="bond-detail-stamp">PERSONNEL CONNECTIONS / '+pad(p.no)+'</div>'+
 '<div class="bond-focus-head"><button class="bond-portrait-main" type="button" data-portrait="'+p.no+'" aria-label="'+esc(p.name)+' 일러스트 확대"><img src="img/t/'+pad(p.no)+'.jpg" alt="" loading="lazy"></button>'+
 '<div><h3>'+esc(p.name)+'</h3><small>'+esc(p.group)+' · '+esc(p.role)+'</small><p>'+esc(p.pers)+'</p><button type="button" data-dossier="'+p.no+'">인물 도감에서 자세히 보기 ↗</button></div></div>'+
 '<p class="bond-total-relations">공개된 관계 '+visible.length+'개 · 지역 내 관계 '+sections.length+'개</p>'+
 (visible.length?group('같은 권역의 관계',sections)+group('다른 권역과의 연결',outside):'<p class="bond-no-record">아직 공개된 직접 관계가 없습니다. 같은 권역 인물을 선택해 살펴보세요.</p>');
}
tabs.addEventListener('click',e=>{const b=e.target.closest('[data-region]');if(!b)return;region=b.dataset.region;selected=available()[0]?.no||3;render()});
roster.addEventListener('click',e=>{const unlock=e.target.closest('[data-unlock-rift]');if(unlock){window.SOLARIA_RIFT_UNLOCKED=true;window.setFilter?.('rift');render();return}const b=e.target.closest('[data-person]');if(b){selected=Number(b.dataset.person);render()}});
detail.addEventListener('click',e=>{
 if(e.target.closest('[data-unlock-rift]')){window.SOLARIA_RIFT_UNLOCKED=true;window.setFilter?.('rift');render();return}
 const select=e.target.closest('[data-select]');if(select){focus(select.dataset.select);return}
 const dossier=e.target.closest('[data-dossier]');if(dossier){openDossier(dossier.dataset.dossier);return}
 const portrait=e.target.closest('[data-portrait]');if(portrait)showPortrait(portrait.dataset.portrait);
});
const dlg=document.createElement('dialog');dlg.className='bond-gallery-dialog';dlg.innerHTML='<div class="bond-gallery-frame"><header><b id="bondGalleryName"></b><button type="button" data-close>닫기 ×</button></header><img id="bondGalleryImage" alt=""><footer><span id="bondGalleryRole"></span><button type="button" data-gallery-dossier>인물 도감 ↗</button></footer></div>';document.body.append(dlg);
let displayed=null;
function showPortrait(no){const p=byId.get(Number(no));if(!p||isLocked(p))return;displayed=p;dlg.querySelector('#bondGalleryName').textContent=p.name;dlg.querySelector('#bondGalleryRole').textContent=p.role;const img=dlg.querySelector('img');img.src='img/c/'+pad(p.no)+'.jpg';img.alt=p.name+' 인물 일러스트';if(!dlg.open)dlg.showModal()}
dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-close]'))dlg.close();if(e.target.closest('[data-gallery-dossier]')&&displayed){dlg.close();openDossier(displayed.no)}});
window.SOLARIA_ATLAS={focus,preview,refresh:render};
render();
})();