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
const supporting={
 1:[[13,'황제 · 계승권을 쥔 군주'],[14,'황후 · 친모'],[16,'황자 직속 기사'],[21,'황자파 군부 인사']],
 2:[[13,'황제 · 계승권을 쥔 군주'],[14,'황후 · 친모'],[17,'황녀 호위기사 · 소꿉친구'],[22,'정치 스승']],
 3:[[24,'어릴 때부터 돌본 집사장'],[25,'방벽 수비대장 · 오른팔'],[27,'대공가의 오랜 충신']],
 4:[[31,'상단 비서'],[32,'상단의 경쟁자']],
 5:[[40,'대마법사의 제자격']],
 6:[[35,'변경군 부관'],[34,'서부 광산 길드장']],
 7:[[46,'마탑 이사 · 중립파']],
 8:[[47,'마탑의 라이벌'],[48,'동료 연구원']],
 9:[[45,'교주의 오른팔'],[44,'교단의 후원자']],
 10:[[43,'성녀를 지키는 성기사단장']]
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
 const supportingPeople=(supporting[current]||[]).map(([no,label])=>({p:person(no),label})).filter(o=>o.p);
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
 '<div class="bond-support">'+supportingPeople.map(({p:q,label})=>
 '<button type="button" class="bond-support-person" data-bond-dossier="'+q.no+'"><img src="img/t/'+pad(q.no)+'.jpg" alt="" loading="lazy">'+
 '<span><b>'+esc(q.name)+'</b><small>'+esc(label)+'</small></span><em>↗</em></button>'
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