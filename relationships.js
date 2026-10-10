/* Solaria relationships: main-cast network + grounded supporting relationships. */
(()=>{
'use strict';
const svg=document.getElementById('bsvg'),side=document.getElementById('bside');
const scroller=document.getElementById('bondScroller');
if(!svg||!side||!scroller||typeof P==='undefined'||typeof EDGES==='undefined'||typeof NODES==='undefined')return;
const ns='http://www.w3.org/2000/svg';
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const person=no=>P.find(p=>p.no===Number(no));
const summary={r:'대립',a:'협력·호의',n:'긴장·얽힘'};
// These are explicitly described in the established character biographies.
/* Known direct ties and regional associations; do not imply secret relationships. */
const supporting={
 1:[
  [13,'부친 · 황제','병상에서도 황위 계승을 확정하지 않았다. 황자 역시 그 결정을 기다리고 있다.'],
  [14,'모친 · 황후','황궁의 실권을 쥔 친모. 궁정에서 황자의 입지를 뒷받침하는 황실 인물이다.'],
  [16,'직속 기사 · 충성','다미안은 황자의 명령을 절대적으로 따른다. 그의 뜻을 현장에서 실행하는 검이다.'],
  [21,'정치적 지지 · 군부','막시무스는 황자파의 강경한 군부 인사. 마물 박멸이라는 노선을 공유한다.'],
  [20,'혼담 후보 · 귀족 가문','유니아는 황자의 혼담 상대로 거론된다. 확정된 약혼 관계는 아니다.']
 ],
 2:[
  [13,'부친 · 황제','옥좌의 최종 결정권자는 여전히 황제에게 있다. 황녀도 그의 결정을 기다린다.'],
  [14,'모친 · 황후','황궁 안살림의 실권자이자 친모. 황녀에게 궁정의 중요한 연결고리다.'],
  [17,'소꿉친구 · 호위','오랜 친구이자 호위기사. 리비아는 황녀의 곁에서 직접 위험을 막아낸다.'],
  [22,'정치 스승 · 조언','코르넬리아는 황녀에게 정치와 재무를 가르쳐온 인물이다.'],
  [19,'모계 친족 · 공작가','황후의 친정인 세베루스 가문의 수장. 가문 보존을 우선하며 두 진영을 저울질한다.']
 ],
 3:[
  [24,'양육자 같은 존재 · 집사장','헬가는 대공을 어린 시절부터 돌봤다. 가신인 동시에 가장 오래된 일상의 보호자다.'],
  [25,'오른팔 · 방벽 수비대장','비고는 방벽 현장에서 대공을 보좌한다. 전선에서 가장 먼저 도끼를 드는 수비대장이다.'],
  [27,'오랜 충신 · 백작','방벽 요새의 영주이자 보레알 대공가의 오랜 충신. 북부 방어를 함께 맡는다.'],
  [28,'북부 영주 · 물자난','율리아는 지원이 줄어드는 북부를 버텨야 하는 소영주. 같은 북부의 문제에 놓여 있다.']
 ],
 4:[
  [31,'최측근 실무자 · 상단 비서','마이아는 상단주의 장부를 쥔 사람. 거래의 실무를 가까이서 담당한다.'],
  [32,'상업적 경쟁자 · 적대','가이우스는 베르가 상단의 자리를 노리는 마르카토 상가의 주인이다.'],
  [33,'곡창 지주 · 지역 이해관계','플로라는 시들어가는 작물 때문에 절박한 영주. 상단주와 같은 남부의 위기를 겪는다.']
 ],
 5:[
  [40,'제자에 가까운 존재 · 석판 지킴이','세일라는 숲의 석판을 지키는 젊은 수호자이며 대마법사의 제자격이다.'],
  [39,'숲 수호자 · 지역 이해관계','엘라르는 외부인 출입을 결정하는 수호자 일족의 족장. 숲을 둘러싼 이해관계가 맞닿는다.']
 ],
 6:[
  [35,'부관 · 제동 장치','프리마는 변경군 부관이자 변경백의 무리수를 말리는 몇 안 되는 사람이다.'],
  [34,'광산 길드장 · 현지 실력자','그라우는 실제 광산을 굴리는 길드장. 변경을 움직이는 실무의 한 축이다.'],
  [37,'황실 감독관 측 · 갈등','안토니우스의 가문은 황실의 광산 감독을 맡고 변경군과 충돌한다.'],
  [38,'변경 토착 귀족 · 연장자','두르는 변경백에게 아버지뻘인 오래된 현지 귀족이다.']
 ],
 7:[
  [46,'마탑 이사 · 중립파','이사벨라는 마탑 내부의 중립파 이사. 탑주와 같은 조직에 있지만 입장은 구분된다.'],
  [48,'마탑 연구원 · 소속 구성원','티토는 탑 내 연구원으로 활동한다. 개인적인 친분은 공식 기록에 없다.']
 ],
 8:[
  [47,'경쟁자 · 라이벌','세바스티안은 노바의 라이벌인 오만한 천재. 같은 연구 분야에서 경쟁한다.'],
  [48,'동료 · 공동 연구 조직','티토는 노바와 함께 일하는 마탑 연구원이다.']
 ],
 9:[
  [45,'오른팔 · 주교','로렌조는 심문과 기록을 맡는 교주의 오른팔. 교단 내부의 실무를 담당한다.'],
  [44,'교단 후원자 · 귀족','엘레오노라는 교단에 큰 후원을 제공하는 세라핀 가문의 후작이다.']
 ],
 10:[
  [43,'호위 · 성기사단장','아드리엘은 성녀를 지키는 성기사단장. 마물에게 가족을 잃었고 신앙에 충실하다.']
 ]
};
let current=null;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function svgElement(tag,attrs){
 const el=document.createElementNS(ns,tag);
 for(const [key,val] of Object.entries(attrs))el.setAttribute(key,String(val));
 return el;
}
svg.replaceChildren();
const defs=svgElement('defs',{}),under=svgElement('g',{class:'bond-lines'}),nodes=svgElement('g',{class:'bond-nodes'});
svg.append(defs,under,nodes);
for(const edge of EDGES){
 const [a,b,kind,desc]=edge,[x1,y1]=NODES[a],[x2,y2]=NODES[b];
 const g=svgElement('g',{class:'e '+kind,'data-a':a,'data-b':b});
 g.append(svgElement('line',{x1,y1,x2,y2}));
 const title=svgElement('title',{});title.textContent=person(a).name+' — '+person(b).name+' · '+desc;g.append(title);
 under.append(g);
}
for(const [key,point] of Object.entries(NODES)){
 const no=Number(key),p=person(no),[x,y]=point;
 if(!p)continue;
 const clip=svgElement('clipPath',{id:'bond-portrait-'+no});
 clip.append(svgElement('circle',{cx:x,cy:y,r:44}));defs.append(clip);
 const g=svgElement('g',{class:'nd','data-no':no,tabindex:0,role:'button','aria-pressed':'false','aria-label':p.name+' '+p.role+' 관계 보기'});
 g.append(svgElement('circle',{class:'bond-halo',cx:x,cy:y,r:55,stroke:COL[p.aff]||'#D9B86C'}));
 g.append(svgElement('circle',{class:'bond-shadow',cx:x,cy:y,r:46}));
 g.append(svgElement('image',{href:'img/t/'+pad(no)+'.jpg',x:x-44,y:y-58,width:88,height:117,'clip-path':'url(#bond-portrait-'+no+')',preserveAspectRatio:'xMidYMin slice'}));
 g.append(svgElement('circle',{class:'ring',cx:x,cy:y,r:46,stroke:COL[p.aff]||'#D9B86C'}));
 const name=svgElement('text',{x,y:y+73,class:'bond-name'});name.textContent=p.name.split(' ')[0];g.append(name);
 const role=svgElement('text',{x,y:y+93,class:'r'});role.textContent=p.role;g.append(role);
 g.addEventListener('click',()=>select(no));
 g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(no)}});
 nodes.append(g);
}
function recenter(no,animate){
 const x=NODES[no]?.[0]??500;
 const scale=svg.getBoundingClientRect().width/1000;
 scroller.scrollTo({left:Math.max(0,x*scale-scroller.clientWidth/2),behavior:animate&&!reduced()?'smooth':'auto'});
}
function resetStyles(){
 svg.classList.toggle('focus',current!==null);
 const edges=EDGES.filter(e=>current!==null&&(e[0]===current||e[1]===current));
 const visible=new Set([current]);edges.forEach(e=>{visible.add(e[0]);visible.add(e[1])});
 svg.querySelectorAll('.e').forEach(el=>el.classList.toggle('hl',current!==null&&(Number(el.dataset.a)===current||Number(el.dataset.b)===current)));
 svg.querySelectorAll('.nd').forEach(el=>{
  const no=Number(el.dataset.no),focused=no===current;
  el.classList.toggle('hl',visible.has(no));el.classList.toggle('sel',focused);
  el.setAttribute('aria-pressed',String(focused));
 });
}
function renderPanel(){
 if(current===null){
  side.innerHTML='<div class="bond-aside-kicker">PERSONNEL INTELLIGENCE / 00</div>'+
   '<h3>누구의 관계를 살펴볼까요?</h3>'+
   '<p class="bond-aside-intro">황실의 대립, 마탑의 후계, 방벽의 빚까지. 인물 초상을 선택하면 알려진 관계와 그를 둘러싼 조연이 열립니다.</p>'+
   '<div class="bond-stat"><span>주요 인물</span><b>10</b></div><div class="bond-stat"><span>기록된 관계</span><b>'+EDGES.length+'</b></div>'+
   '<button type="button" class="bond-explore" data-bond-select="3">카시안의 관계부터 살펴보기 ↗</button>';
  return;
 }
 const p=person(current),mine=EDGES.filter(e=>e[0]===current||e[1]===current);
 const supportingPeople=(supporting[current]||[]).map(([no,label,detail])=>({p:person(no),label,detail})).filter(o=>o.p);
 side.innerHTML='<div class="bond-aside-kicker">DOSSIER / '+pad(current)+' · '+esc(AFF[p.aff]||'제국')+'</div>'+
 '<div class="bond-aside-person"><img src="img/t/'+pad(current)+'.jpg" alt="" loading="lazy"><div><h3>'+esc(p.name)+'</h3><p class="rl">'+esc(p.role)+'</p><small>'+esc(p.group)+'</small></div></div>'+
 '<p class="bond-known">'+esc(p.known)+'</p>'+
 '<div class="bond-section-heading"><span>주요 인물과의 관계</span><small>'+mine.length+' CONNECTIONS</small></div>'+
 '<div class="bond-relations">'+mine.map(edge=>{
 const other=person(edge[0]===current?edge[1]:edge[0]);
 return '<button type="button" class="bond-relation '+edge[2]+'" data-bond-select="'+other.no+'">'+
  '<span class="bond-relation-mark" aria-hidden="true"></span>'+
  '<span><b>'+esc(other.name)+'</b><small>'+esc(edge[3])+'</small></span><em>↗</em></button>';
 }).join('')+'</div>'+
 (supportingPeople.length?'<div class="bond-section-heading support"><span>이 인물을 둘러싼 사람들</span><small>'+supportingPeople.length+' PROFILES</small></div>'+
 '<div class="bond-support">'+supportingPeople.map(({p:q,label,detail})=>
 '<button type="button" class="bond-support-person" data-bond-dossier="'+q.no+'"><img src="img/t/'+pad(q.no)+'.jpg" alt="" loading="lazy">'+
 '<span><b>'+esc(q.name)+'</b><small class="bond-support-label">'+esc(label)+'</small><small class="bond-support-detail">'+esc(detail)+'</small></span><em aria-hidden="true">↗</em></button>'
 ).join('')+'</div>':'')+
 '<button type="button" class="bond-explore" data-bond-dossier="'+current+'">선택한 인물의 상세 기록 보기 ↗</button>'+
 '<p class="bond-metadata">확인된 인물 소개를 바탕으로 정리한 관계입니다. 공개되지 않은 비밀은 포함하지 않습니다.</p>';
}
function select(no,scroll=true){
 if(!Object.hasOwn(NODES,Number(no)))return;
 current=current===Number(no)?null:Number(no);
 resetStyles();renderPanel();
 if(current!==null&&scroll)recenter(current,true);
}
side.addEventListener('click',e=>{
 const main=e.target.closest('[data-bond-select]');
 if(main){select(Number(main.dataset.bondSelect));return}
 const dossier=e.target.closest('[data-bond-dossier]');
 if(dossier){
  const p=person(dossier.dataset.bondDossier);
  if(!p)return;
  if(typeof setFilter==='function')setFilter(p.main?'main':p.aff,p.no);
  document.getElementById('people')?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
 }
});
document.getElementById('bondAll')?.addEventListener('click',()=>{current=null;resetStyles();renderPanel();recenter(3,false)});
for(const [id,dir] of [['bondLeft',-1],['bondRight',1]]){
 document.getElementById(id)?.addEventListener('click',()=>scroller.scrollBy({left:scroller.clientWidth*.65*dir,behavior:reduced()?'auto':'smooth'}));
}
resetStyles();renderPanel();requestAnimationFrame(()=>recenter(3,false));
})();