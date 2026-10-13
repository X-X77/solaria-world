/* Solaria constellation atlas: Empire-wide and eight regional views, public-only relationships. */
(()=>{
'use strict';
const tabs=document.getElementById('bondRegionTabs'),svg=document.getElementById('bsvg'),detail=document.getElementById('bondDetail'),scroll=document.getElementById('bondScroller'),board=document.getElementById('bondBoard');
if(!tabs||!svg||!detail||!scroll||!board||typeof P==='undefined')return;
const factions=[['all','제국 전체','제국을 잇는 인연'],['north','북부','설원의 맹세'],['capital','황도','황좌를 향한 시선'],['south','남부','황금으로 엮인 약속'],['west','서부','칼끝에 새긴 자치'],['east','동부','숲이 기억하는 이름'],['tower','마탑','별을 읽는 자들'],['temple','교단','기도 아래의 갈등']];
const relationPairs=[
[1,2,'대립','서로 다른 방식으로 계승권을 준비하는 남매'],[1,13,'가족','황제의 계승 결정을 기다리는 제1황자'],[2,13,'가족','황제의 결정과 궁정의 움직임을 주시하는 황녀'],
[1,14,'가족','황후의 아들'],[2,14,'가족','황후의 딸'],[14,19,'가문','황후의 친정인 세베루스 공작가'],[44,20,'가족','세라핀 후작과 그 딸'],[1,20,'혼담·앙숙','황제와 황후는 짝으로 밀지만, 어릴 때부터 서로를 질색하는 사이'],
[1,16,'충성','황자 직속 호위기사'],[1,21,'협력','군부의 강경한 지지 세력'],[2,17,'친밀','어릴 적부터 가까운 호위기사와 황녀'],[2,22,'사제·호의','정치와 재무를 가르치는 조언자와 가르침을 받는 황녀. 서로의 역량을 인정한다.'],
[1,15,'중립','근위기사단의 충성 대상은 황제 개인'],[2,15,'중립','근위기사단은 계승전 어느 편도 들지 않음'],
[13,15,'충성','황제 개인에게 충성하는 근위기사단장'],[15,18,'지휘','기록고 경비기사에게 절차를 강조'],[18,23,'협력','황실 기록고의 경비와 기록관 업무'],[16,17,'경쟁','양 진영 호위기사 사이의 경호 동선 갈등'],
[21,22,'대립','군비 증액과 재정 부담을 둘러싼 충돌'],[19,22,'협상','재정과 가문 이해관계를 둘러싼 거래'],[20,22,'관계','정략 혼담과 거래의 조건을 검토'],
[3,24,'가족 같은 돌봄','어릴 때부터 대공을 돌본 성 집사장'],[3,25,'전우','대공의 오른팔인 방벽 수비대장'],[3,27,'충성','대공가의 오랜 충신이자 방벽 영주'],[3,28,'영지','물자난을 견디는 북부 영주와 대공'],[3,26,'지역','성하 마을의 약사와 북부 수호자'],
[24,25,'일상 마찰','성의 질서와 거친 전선 생활을 두고 티격태격'],[25,26,'대립·협력','부상병 치료와 전선 복귀 시점을 두고 충돌'],[24,26,'지원','약재와 환자 관리를 둘러싼 협력'],[25,27,'협력','방벽의 병력 배치와 보수에 대한 상의'],[27,28,'긴장','방벽 예비 물자와 주민 구호를 둘러싼 이견'],[24,28,'지원','북부 구호 물자를 마련하기 위한 협력'],[26,28,'지원','약품 지원과 비용 책임을 두고 의견 조율'],
[4,31,'협력','베르가 상단의 주인과 엄격한 실무 담당자'],[4,32,'경쟁','남부 상권을 둘러싼 상단의 정적'],[4,29,'거래','해상 운송과 선원 보호를 둘러싼 조건 협상'],[4,30,'정보','부두의 정보 거래'],[4,33,'협상','곡창 회복과 곡물 유통에 대한 협의'],
[31,29,'계약','호위 비용과 선원 안전 조항을 확인'],[31,30,'정보','소문의 출처와 정보 가격을 검증'],[31,32,'경계','경쟁 상가의 유리한 제안을 경계'],[31,33,'협상','구호와 상환 조건을 조정'],[32,33,'긴장','곡창 위기를 둘러싼 계약 협상'],[29,30,'정보','항로 소식을 거래하되 서로를 전적으로 믿지 않음'],
[6,35,'충성·제동','변경백의 부관이며 돌발 출병에 제동을 건다'],[6,34,'협력','광산 이권과 채굴 안전을 두고 협의'],[6,36,'계약','임무별로 계약을 맺는 용병단'],[6,37,'대립','변경의 자치권과 황실의 감독권 갈등'],[6,38,'신뢰','변경백에게 아버지뻘인 토착 귀족'],[34,35,'협력','광산 안전과 군수 공급을 협의'],[34,36,'계약','갱도 호위와 위험 수당의 계약'],[34,37,'대립','생산량 압박과 광부 안전을 둘러싼 대립'],[35,36,'긴장','군의 규율과 용병 계약의 충돌'],[35,38,'조언','변경 운영에 관한 연장자의 조언'],[37,38,'대립','황실의 감독 관행과 서부 토착 관습의 충돌'],
[5,40,'사제·호의','일리아나가 세일라에게 지식과 관찰법을 전하며, 세일라는 스승을 신뢰한다.'],[5,39,'오랜 접점','숲의 질서와 석판을 둘러싼 조심스러운 관계'],[5,41,'오랜 친분','숲 신전의 사제장과 대마법사'],[5,42,'중재','황실 총독과 숲 사이의 완충 역할'],[39,40,'훈육','규율과 호기심으로 충돌하는 족장과 지킴이'],[39,41,'협력·갈등','숲을 지키되 외부인을 대하는 방식이 다름'],[39,42,'대립','출입 허가와 관할권 다툼'],[40,41,'신뢰','고민을 털어놓는 석판 지킴이와 사제장'],[40,42,'경계','석판 관리와 총독부의 조사 권한'],[41,42,'중재','신앙과 행정의 문제를 놓고 협의'],
[7,8,'사제·호의','마탑주가 후임 노바의 재능을 인정하며 가르치고 시험한다. 엄격한 평가와 신뢰가 공존한다. 노바는 어릴 때부터 그를 동경해 왔다.'],[7,46,'견제','실험 예산과 사고 책임을 둘러싼 논쟁'],[7,47,'평가','재능을 인정받고 싶은 마법사'],[7,48,'조직','마탑주의 지휘 아래 연구하는 구성원'],[8,47,'경쟁','논문·실험 성과를 놓고 다투는 라이벌'],[8,48,'동료','마탑 소수파의 공동 연구자'],[46,47,'평가','무심한 평가와 상처 입는 자존심'],[46,48,'감독','실험 보고서의 누락을 지적하는 이사'],[47,48,'긴장·협력','이론과 실험 방식으로 다투면서도 필요하면 협업'],
[9,10,'신념 차이','교리와 성녀의 자비가 충돌하기도 함'],[9,45,'충성','교주의 심문과 기록을 담당하는 오른팔'],[9,44,'후원','교단에 많은 물자를 후원하는 후작'],[10,43,'호위','성녀의 안전을 최우선으로 지키는 기사단장'],[10,44,'후원','치유와 구휼 활동을 위한 물자 지원'],[43,45,'조사','현장의 판단과 기록을 서로 검증'],[44,45,'긴장','후원금 집행 기록에 대한 감사와 확인'],
[3,6,'경쟁·협력','변경을 지키는 서로 다른 지휘관'],[3,4,'교역','북부에 필요한 물자와 운송의 거래'],[4,6,'긴장','마석 거래와 변경의 이해관계'],[4,5,'의견 차이','작물 오염의 원인을 두고 의견 차이'],[5,10,'신앙','숲의 관점과 성녀의 치유가 맞닿는 접점'],[41,10,'조언','성녀에게 조언하는 숲 신전의 사제장'],
[11,12,'신뢰','마왕과 가장 가까운 측근. 연애 감정 없는 남매 같은 사이'],[11,49,'충성','마왕을 섬기는 기사단장'],[11,50,'참모','공존 협상을 설계하는 참모'],[11,52,'의무','마왕궁의 치유와 마력 감별'],[11,51,'지휘·충성','녹스는 자일의 정찰 능력을 인정하고 임무를 맡긴다.'],[12,49,'대립·협력','계략과 군 규율을 두고 충돌'],[12,50,'협력','정무와 정보의 신빙성을 논의'],[12,51,'훈육','정찰병이 사고를 치면 뒷수습하는 측근'],[49,50,'견해 차이','군사적 경계와 공존 협상 사이의 충돌'],[49,52,'의무','부상병의 복귀와 치료를 둘러싼 협의'],[49,51,'훈육','무단 잠입을 꾸짖는 기사단장'],[50,51,'업무','정찰 보고에서 누락된 정보를 점검'],[51,52,'보호','다친 정찰병을 돌보는 의관']
,
[13,14,"부부·동반자","황제와 황후. 황궁과 제국의 안정을 함께 책임지지만 정치적 판단은 각자 내린다."],
[1,3,"포섭 시도","제1황자가 북부 대공을 자신의 계승 진영으로 끌어들이려 한다."],
[2,3,"포섭 시도","황녀 또한 북부 대공의 지지를 얻으려 한다."],
[9,1,"후원·호의","교주가 제1황자의 계승을 지지하며 영향력을 더한다."],
[1,6,"대립","황실의 편입 요구와 변경의 자치권을 둘러싼 갈등."],
[9,7,"대립","교단과 마탑은 공식적으로 마법과 신앙의 입장을 두고 대립한다."],
[3,5,"호의·인연","북부 대공가와 숲의 대마법사 사이에 대를 이어 내려온 빚이 있다."],
[5,2,"호의","대마법사는 황녀에게 호의를 보인다."],
[5,1,"경계","대마법사는 제1황자의 움직임을 경계한다."],
[2,4,"협력·거래","황녀와 베르가 상단주 사이에 비공개 거래가 이어진다."],
[3,54,'신뢰','방벽의 보급을 맡기는 대공과 운송대장'],[4,54,'거래','남부 물자를 넘기는 단골 거래처'],[25,54,'티격태격','보급 시간을 두고 늘 다투는 수비대장과 운송대장'],[28,54,'협력','물자난을 함께 버티는 영주와 운송대장'],
[3,55,'충성','선대부터 대공가를 지켜 온 퇴역병'],[24,55,'오랜 동료','선대 때부터 성을 함께 지켜 온 사이'],[27,55,'전우','같은 전장을 겪은 옛 전우'],
[4,56,'거래·견제','상단의 물건을 경매에 올리며 서로 속을 떠본다'],[32,56,'거래','출처를 묻지 않는 경매 의뢰'],[30,56,'정보','경매장 소문을 사고파는 사이'],[7,56,'고객','마탑은 경매장의 가장 큰 마석 구매자'],
[6,57,'마찰','변경군의 사냥 통제와 사냥꾼의 마찰'],[36,57,'경쟁','같은 의뢰를 두고 다투는 사이'],[34,57,'거래','사냥한 마석을 광산 길드에 넘긴다'],
[39,58,'가족·숙부와 조카','아버지를 잃은 로완을 엘라르가 거두어 키웠다'],[40,58,'친분','같은 일족에서 자란 또래'],[42,58,'불신','황실 총독을 믿지 않는 수호자 전사'],[5,58,'경계','대마법사를 경외하면서도 경계한다'],
[11,59,'신하','마왕을 섬기는 마족 귀족'],[49,59,'접촉','크루엔타가 자주 기사단장을 찾아간다'],[50,59,'대립','협상과 강경의 길을 두고 엇갈린다'],[59,60,'충성','크루엔타를 섬기는 부관'],[51,60,'경쟁','경계 너머에서 자주 마주치는 사이'],[12,60,'견제','서로의 동선을 캐는 사이'],
[13,61,'충성','황제의 곁을 가장 오래 지킨 시종장'],[14,61,'경계','황후는 시종장의 조용한 눈길을 가늠한다'],[15,61,'거리','근위기사단장은 그를 어려워한다'],
[1,62,'신임','황자가 가장 믿는 서기관'],[16,62,'친분','같은 황자 휘하의 기사와 서기관'],
[24,63,'훈육','매일 잔소리하며 가르치는 집사장과 신입 하녀'],[3,63,'고용','대공가에 새로 들어온 하녀'],
[4,64,'단골','상단주는 그녀 술집의 단골손님'],[30,64,'경쟁','같은 소문을 두고 값을 다툰다'],[29,64,'단골','제독 함대의 뱃사람들이 자주 드나든다'],
[34,65,'신뢰','길드장이 믿는 장부 담당'],[6,65,'안면','변경백은 깐깐한 회계원으로 안다'],[37,65,'반감','황실 감독관을 곱게 보지 않는 회계원'],
[11,66,'아낌','마왕이 먹는 건 뭐든 좋아하는 막내 시종'],[51,66,'앙숙','만나기만 하면 투닥거리는 사이'],[12,66,'뒷수습','사고를 칠 때마다 수습해 주는 측근'],[49,66,'친분','같은 마왕궁의 식구']];
const people=new Map(P.map(p=>[p.no,p]));
const TORN=window.SOLARIA_TORN||[11,12];
const edges=relationPairs.map(([a,b,type,description])=>({a,b,type,description})).filter(e=>people.has(e.a)&&people.has(e.b));
const NS='http://www.w3.org/2000/svg';
const safe=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const quiet=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const node=(tag,attrs={},text)=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=String(text);return el;};
const colorType=t=>/대립|충돌|경쟁|긴장|견제|마찰|불신/.test(t)?'hostile':/부부|사제|스승|제자|후임|호의|인연|충성|친밀|전우|협력|후원|가족|돌봄|호위|신뢰|지원|친근|의무|동료/.test(t)?'allied':'complex';
const shown=p=>p.aff!=='rift'&&(!p.sealed||!!window.SOLARIA_RIFT_UNLOCKED);
const visibleName=p=>shown(p)?p.name:'열람 제한';
const relations=id=>edges.filter(e=>e.a===id||e.b===id).map(e=>({other:people.get(e.a===id?e.b:e.a),type:e.type,description:e.description}));
const imperialOrder=[13,14,1,2,3,4,6,5,7,8,9,10];
const members=key=>key==='all'?imperialOrder.map(id=>people.get(id)).filter(Boolean):P.filter(p=>p.aff===key).sort((a,b)=>Number(b.main)-Number(a.main)||a.no-b.no);
let region='all',selected=null,photo=null;
// Wide screens widen the night sky instead of enlarging it, so the whole constellation stays in view.
let geo={sx:1,x:0,w:940},flowed=null,recordFor=null;
function sky(){
 const cw=scroll.clientWidth||board.clientWidth||940;
 if(cw<900)return {sx:1,x:0,w:940};
 const w=Math.round(Math.max(940,Math.min(1280,cw*690/620)));
 return {sx:w/940*.98,x:Math.round(470-w/2),w};
}
// Even spacing along the length of the orbit (not by angle) keeps its narrow ends from crowding.
function orbit(count,rx,ry,cx,cy){
 const N=720,pts=[],len=[0],out=[];
 for(let i=0;i<=N;i++){
  const t=-Math.PI/2+2*Math.PI*i/N;pts.push([cx+Math.cos(t)*rx,cy+Math.sin(t)*ry]);
  if(i)len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
 }
 let j=0;
 for(let k=0;k<count;k++){
  const target=len[N]*k/count;
  while(j<N-1&&len[j+1]<target)j++;
  const f=(target-len[j])/((len[j+1]-len[j])||1);
  out.push({x:Math.round((pts[j][0]+(pts[j+1][0]-pts[j][0])*f)*10)/10,y:Math.round((pts[j][1]+(pts[j+1][1]-pts[j][1])*f)*10)/10});
 }
 return out;
}
function positions(cast){
 const points=new Map(),count=cast.length,sx=geo.sx;
 if(!count)return points;
 if(region==='all'){
  // Equal spacing on the outer orbit prevents a dense 12-person central cluster.
  const ring=orbit(count,351*sx,226,470,326);
  cast.forEach((p,i)=>points.set(p.no,ring[i]));
  return points;
 }
 const central=cast.find(p=>p.main)||cast[0];
 points.set(central.no,{x:470,y:320});
 const others=cast.filter(p=>p.no!==central.no);
 const rx=others.length>9?347:others.length>5?330:311,ry=others.length>9?227:218;
 const ring=orbit(others.length,rx*sx,ry,470,320);
 others.forEach((p,i)=>points.set(p.no,ring[i]));
 return points;
}
function renderGraph(){
 geo=sky();
 svg.setAttribute('viewBox',geo.x+' 0 '+geo.w+' 690');
 const cast=members(region),pts=positions(cast),locked=region==='rift'&&!window.SOLARIA_RIFT_UNLOCKED;
 svg.replaceChildren();
 const defs=node('defs');
 for(const p of cast){
  if(locked)continue;
  const clip=node('clipPath',{id:'arc-clip-'+p.no});clip.append(node('circle',{cx:0,cy:0,r:38}));defs.append(clip);
 }
 svg.append(defs);
 const stars=node('g',{class:'arc-starfield','aria-hidden':'true'});
 const starCount=Math.round(54*geo.w/940);
 for(let i=0;i<starCount;i++){
  const x=geo.x+22+(i*173+39)%(geo.w-44),y=22+(i*131+75)%650;
  stars.append(node('circle',{cx:x,cy:y,r:i%5===0?1.8:0.8,class:i%6===0?'star-bright':'star-dim'}));
 }
 svg.append(stars);
 const geometry=node('g',{class:'arc-geometry','aria-hidden':'true'});
 geometry.append(node('ellipse',{cx:470,cy:320,rx:Math.round(347*geo.sx),ry:231,class:'orbit-main'}));
 geometry.append(node('circle',{cx:470,cy:325,r:169,class:'orbit-inner'}));
 geometry.append(node('circle',{cx:470,cy:325,r:179,class:'orbit-dashed'}));
 for(const a of [0,45,90,135]){
  const t=a*Math.PI/180,x=470+165*Math.cos(t),y=325+165*Math.sin(t);
  geometry.append(node('line',{x1:470-x+470,y1:325-y+325,x2:x,y2:y,class:'orbit-axis'}));
 }
 svg.append(geometry);
 if(region==='all'){
  const glyph=node('g',{class:'arc-imperial-glyph','aria-hidden':'true'});
  glyph.append(node('text',{x:470,y:314,'text-anchor':'middle',class:'arc-glyph-mark'},'✧'));
  glyph.append(node('text',{x:470,y:344,'text-anchor':'middle',class:'arc-glyph-word'},'SOLARIA'));
  svg.append(glyph);
 }
 const lines=node('g',{class:'arc-link-lines'}),flows=node('g',{class:'arc-flows','aria-hidden':'true'});
 const intra=edges.filter(e=>pts.has(e.a)&&pts.has(e.b));
 // A single pulse of light runs outward along the chosen person's threads, once per selection.
 const playFlow=selected!==null&&!locked&&flowed!==region+':'+selected&&!quiet();
 intra.forEach(e=>{
  const a=pts.get(e.a),b=pts.get(e.b),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
  const bend=Math.min(21,len*.07)*((e.a+e.b)%2===0?1:-1);
  const mx=(a.x+b.x)/2+(-dy/len)*bend,my=(a.y+b.y)/2+(dx/len)*bend;
  const path=node('path',{d:'M'+a.x+','+a.y+' Q'+mx+','+my+' '+b.x+','+b.y,class:'arc-thread '+colorType(e.type)+(selected!==null&&(e.a===selected||e.b===selected)?' selected':'')+(selected!==null&&e.a!==selected&&e.b!==selected?' muted':'')});
  const title=node('title',{},visibleName(people.get(e.a))+' ↔ '+visibleName(people.get(e.b))+' · '+e.type);
  path.append(title);lines.append(path);
  if(playFlow&&(e.a===selected||e.b===selected)){
   const from=e.a===selected?a:b,to=e.a===selected?b:a;
   flows.append(node('path',{d:'M'+from.x+','+from.y+' Q'+mx+','+my+' '+to.x+','+to.y,class:'arc-flow '+colorType(e.type),pathLength:100}));
  }
 });
 flowed=selected===null?null:region+':'+selected;
 svg.append(lines,flows);
 const related=new Set([selected]);
 intra.forEach(e=>{if(e.a===selected||e.b===selected){related.add(e.a);related.add(e.b)}});
 const portraits=node('g',{class:'arc-portraits'});
 cast.forEach(p=>{
  const pos=pts.get(p.no),isSelected=selected===p.no,dim=selected!==null&&!related.has(p.no);
  const g=node('g',{transform:'translate('+pos.x+' '+pos.y+')',class:'arc-person'+(isSelected?' is-selected':'')+(dim?' is-dim':'')+(locked?' is-sealed':''),'data-person':p.no,role:'button',tabindex:'0','aria-pressed':String(isSelected),'aria-label':shown(p)?p.name+' 관계 보기':'열람 제한 인물'});
  const title=node('title',{},visibleName(p));g.append(title);
  g.append(node('circle',{r:52,class:'arc-glow'}));
  g.append(node('circle',{r:43,class:'arc-outer-ring'}));
  g.append(node('circle',{r:38,class:'arc-portrait-back'}));
  if(locked){
   g.append(node('text',{x:0,y:12,class:'arc-locked-symbol','text-anchor':'middle'},'✧'));
  }else{
   g.append(node('image',{href:window.SOLARIA_PORTRAIT_SRC(p.no,'t'),x:-38,y:-49,width:76,height:104,'clip-path':'url(#arc-clip-'+p.no+')',preserveAspectRatio:'xMidYMin slice'}));
  }
  g.append(node('circle',{r:39.5,class:'arc-rim'}));
  g.append(node('text',{x:0,y:67,class:'arc-person-name','text-anchor':'middle'},shown(p)?p.name:'???'));
  g.append(node('text',{x:0,y:85,class:'arc-person-role','text-anchor':'middle'},shown(p)?p.role:'열람 제한'));
  g.addEventListener('click',()=>{selected=selected===p.no?null:p.no;render()});
  g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selected=selected===p.no?null:p.no;render();svg.querySelector('[data-person="'+p.no+'"]')?.focus({preventScroll:true})}});
  portraits.append(g);
 });
 svg.append(portraits);
 // Wrap long labels without truncating their original text or moving portraits.
 const wrapLabel=(label,step)=>{
  if(label.getComputedTextLength()<=142)return false;
  const text=label.textContent,mid=Math.floor(text.length/2);
  const spaces=[...text].map((c,i)=>c===' '?i:-1).filter(i=>i>0);
  const split=spaces.length?spaces.sort((a,b)=>Math.abs(a-mid)-Math.abs(b-mid))[0]+1:mid;
  label.textContent='';
  [text.slice(0,split),text.slice(split)].forEach((line,i)=>label.append(node('tspan',{x:0,dy:i?step:0},line)));
  return true;
 };
 portraits.querySelectorAll('.arc-person').forEach(person=>{
  const name=person.querySelector('.arc-person-name'),role=person.querySelector('.arc-person-role');
  if(wrapLabel(name,18))role.setAttribute('y',103);
  wrapLabel(role,14);
 });
 // Keep the active portrait visible in the existing horizontal mobile scroller.
 const activePoint=pts.get(selected);
 if(activePoint&&!locked&&scroll.scrollWidth>scroll.clientWidth){
  const scale=svg.getBoundingClientRect().width/svg.viewBox.baseVal.width;
  scroll.scrollTo({left:Math.max(0,(activePoint.x-geo.x)*scale-scroll.clientWidth/2),behavior:quiet()?'auto':'smooth'});
 }
 document.getElementById('arcanaCount').textContent=cast.length+'명 · '+(region==='all'?'제국 주요 연결 ':'권역 내 연결 ')+intra.length+'개';
}
const typeWord={allied:'호의·협력',hostile:'대립·긴장',complex:'그 밖의 연결'};
function relatedMarkup(items,caption,away){
 if(!items.length)return '';
 return '<section class="arc-link-group"><h4 class="arc-dossier-caption">'+caption+' <span>'+items.length+'</span></h4><div class="arc-connection-list">'+
 items.map(({other,type,description})=>'<article class="arc-connection '+colorType(type)+'"><button class="arc-related-image" type="button" data-portrait="'+other.no+'" aria-label="'+safe(other.name)+' 일러스트 크게 보기"><img src="'+window.SOLARIA_PORTRAIT_SRC(other.no,'t')+'" alt="" loading="lazy"></button>'+
 '<div class="arc-connection-copy"><button type="button" data-person="'+other.no+'" class="arc-related-name" aria-label="'+safe(other.name)+', 관계도에서 보기">'+safe(other.name)+' <span aria-hidden="true">↗</span></button>'+
 '<small class="'+colorType(type)+'" title="'+typeWord[colorType(type)]+'"><i aria-hidden="true"></i>'+safe(type)+(away?'<em> · '+safe(AFF[other.aff]||'')+'</em>':'')+'</small><p>'+safe(description)+'</p></div><button type="button" class="arc-doc" data-dossier="'+other.no+'" aria-label="'+safe(other.name)+' 인물 도감 보기">도감</button></article>').join('')+'</div></section>';
}
function renderDetail(){
 const locked=region==='rift'&&!window.SOLARIA_RIFT_UNLOCKED,p=people.get(selected);
 if(locked){
  recordFor=null;detail.classList.remove('is-unfolding');detail.classList.add('is-empty');
  detail.innerHTML='<div class="arc-dossier-stamp"><span>RESTRICTED / BEYOND THE RIFT</span></div><div class="arc-dossier-sealed"><span aria-hidden="true">✧</span><h3>이름 없는 별자리</h3><p>균열 너머는 아직 봉인되어 있습니다.</p></div>';
  return;
 }
 if(!p||(region!=='all'&&p.aff!==region)||!shown(p)){
  recordFor=null;detail.classList.remove('is-unfolding');detail.classList.add('is-empty');
  detail.innerHTML='<div class="arc-dossier-stamp"><span>관계 기록</span><span>선택 대기</span></div><div class="arc-dossier-empty"><span aria-hidden="true">✧</span><h3>하나의 별을 선택하세요</h3><p>위의 초상을 누르면 이곳에 그 인물의 관계 기록이 펼쳐집니다.</p></div>';
  return;
 }
 const all=relations(p.no).filter(e=>shown(e.other)),local=all.filter(e=>e.other.aff===p.aff),outside=all.filter(e=>e.other.aff!==p.aff);
 detail.classList.remove('is-empty');
 detail.classList.toggle('is-unfolding',recordFor!==p.no&&!quiet());
 recordFor=p.no;
 detail.style.setProperty('--rc',COL[p.aff]||'#D9B86C');
 detail.innerHTML='<div class="arc-dossier-stamp"><span>관계 기록 · '+safe(AFF[p.aff]||'솔라리아')+'</span><span>제 '+pad(p.no)+'호</span></div>'+
 '<div class="arc-record">'+
  '<div class="arc-dossier-person">'+
   '<button type="button" class="arc-dossier-photo" data-portrait="'+p.no+'" aria-label="'+safe(p.name)+' 일러스트 크게 보기"><img src="'+window.SOLARIA_PORTRAIT_SRC(p.no,'c')+'" alt="" loading="lazy"></button>'+
   '<div class="arc-id"><small>'+safe(p.group)+'</small><h3>'+safe(p.name)+'</h3><p class="arc-role">'+safe(p.role)+'</p></div>'+
   '<div class="arc-known"><b>알려진 사실</b><p>'+safe(p.known)+'</p></div>'+
   '<dl class="arc-relation-summary"><div><dt>공개된 인연</dt><dd>'+all.length+'</dd></div><div><dt>같은 권역</dt><dd>'+local.length+'</dd></div><div><dt>다른 권역</dt><dd>'+outside.length+'</dd></div></dl>'+
   '<div class="arc-record-actions"><button type="button" data-dossier="'+p.no+'" class="arc-profile-link">인물 도감에서 보기 ↗</button><button type="button" data-portrait="'+p.no+'" class="arc-zoom-link">초상 크게 보기</button></div>'+
  '</div>'+
  '<div class="arc-record-links">'+(all.length?relatedMarkup(local,'같은 권역의 인연')+relatedMarkup(outside,'다른 권역으로 이어진 인연',true):'<p class="arc-no-links">공개된 관계가 없습니다. 다른 인물을 선택해 살펴보세요.</p>')+'</div>'+
 '</div>';
}
function renderBridges(){
 const root=document.getElementById('arcanaBridges');
 if(!root)return;
 const p=people.get(selected);
 if(!p||region==='all'||!shown(p)){root.hidden=true;root.innerHTML='';return}
 const others=relations(p.no).filter(e=>e.other.aff!==region&&shown(e.other));
 root.hidden=!others.length;
 root.innerHTML=others.length?'<div class="arc-bridges-heading"><span>권역 밖으로 이어진 인연</span><small>'+others.length+' CONNECTIONS</small></div><div class="arc-bridge-list">'+
 others.map(e=>'<button type="button" class="arc-bridge" data-bridge="'+e.other.no+'"><img src="'+window.SOLARIA_PORTRAIT_SRC(e.other.no,'t')+'" alt="" loading="lazy"><span><b>'+safe(e.other.name)+' ↗</b><small>'+safe(AFF[e.other.aff])+' · '+safe(e.type)+'</small></span></button>').join('')+'</div>':'';
}
function render(){
 const info=factions.find(x=>x[0]===region);
 board.style.setProperty('--arc-aura',region==='all'?'#D5B88B':COL[region]||'#D8B88A');
 tabs.innerHTML=factions.map(([key,name])=>'<button type="button" class="arc-region-tab'+(key===region?' active':'')+'" data-region="'+key+'" aria-pressed="'+(key===region)+'">'+name+'</button>').join('');
 document.getElementById('bondRegionName').textContent=info[2];
 document.getElementById('arcanaNumber').textContent=String(factions.findIndex(x=>x[0]===region)+1).padStart(2,'0')+' / '+String(factions.length).padStart(2,'0');
 renderGraph();renderDetail();renderBridges();
 const hint=board.querySelector('.arcana-bottomline span:first-child'),sp=people.get(selected);
 if(hint)hint.innerHTML=sp&&shown(sp)&&(region==='all'||sp.aff===region)?'<button type="button" class="arc-to-record" data-to-record>✧ '+safe(sp.name)+'의 관계 기록 보기 ↓</button>':'✧ 초상 선택 · 인연 확인';
}
function focus(id){
 const p=people.get(Number(id));if(!p||!shown(p))return;
 region=p.aff;selected=shown(p)?p.no:null;render();
 // Land on the region tabs and the map itself rather than the section title.
 window.scrollTo({top:Math.max(0,tabs.getBoundingClientRect().top+scrollY-84),behavior:quiet()?'auto':'smooth'});
}
function preview(no){
 const p=people.get(Number(no));if(!p||(p.sealed&&!window.SOLARIA_RIFT_UNLOCKED))return '';
 if(TORN.includes(p.no))return '<article class="torn-relation-fragment" aria-label="찢어진 관계 기록"><small>RELATION RECORD / FRAGMENT</small><h4>'+safe(p.name)+'</h4><p>'+safe(p.quote.slice(0,Math.ceil(p.quote.length/2)))+'</p></article>';
 if(p.aff==='rift'){
  // Torn records (Nox, Charon, Cruenta) keep no threads, so they are left out here as well.
  const kin=relations(p.no).filter(x=>!TORN.includes(x.other.no)&&(!x.other.sealed||window.SOLARIA_RIFT_UNLOCKED));
  return '<h4>균열 너머의 관계</h4>'+(kin.length?'<div class="rift-rel-list">'+kin.map(x=>'<button type="button" class="rift-rel '+colorType(x.type)+'" data-rift-record="'+x.other.no+'" aria-label="'+safe(x.other.name)+' 기록 보기"><img src="'+window.SOLARIA_PORTRAIT_SRC(x.other.no,'t')+'" alt="" loading="lazy"><span><span class="rift-rel-top"><b>'+safe(x.other.name)+'</b><em><i aria-hidden="true"></i>'+safe(x.type)+'</em></span><small>'+safe(x.description)+'</small></span></button>').join('')+'</div>':'<p>남아 있는 관계 기록이 없습니다.</p>');
 }
 const related=relations(p.no).filter(x=>shown(x.other)).slice(0,4);
 return '<h4>이 인물의 관계</h4>'+(related.length?related.map(x=>'<button type="button" data-cast-relation="'+x.other.no+'">'+safe(x.other.name)+' · '+safe(x.type)+' ↗</button>').join(''):'<p>공개된 관계가 없습니다.</p>')+
 '<button type="button" data-cast-relation="'+p.no+'">관계도에서 모두 보기 ↗</button>';
}
function openDossier(id){
 const p=people.get(Number(id));if(!p||!shown(p))return;
 if(typeof setFilter==='function')setFilter(p.aff,p.no);
 document.getElementById('people')?.scrollIntoView({behavior:quiet()?'auto':'smooth',block:'start'});
}
function unlock(){
 // This button replays the film; the rare post-opening event alone unlocks the records.
 window.SOLARIA_RIFT_CONTACT?.begin();
}
function goRegion(key){
 region=key;const cast=members(region),primary=cast.find(p=>p.main)||cast[0];
 selected=region==='all'?null:(primary?primary.no:null);render();
 // keep the active tab visible when the tab row scrolls on narrow screens
 const a=tabs.querySelector('.active');
 if(a&&tabs.scrollWidth>tabs.clientWidth){const tr=tabs.getBoundingClientRect(),ar=a.getBoundingClientRect();tabs.scrollTo({left:tabs.scrollLeft+ar.left-tr.left-(tabs.clientWidth-ar.width)/2,behavior:quiet()?'auto':'smooth'})}
}
tabs.addEventListener('click',e=>{
 const b=e.target.closest('[data-region]');if(b)goRegion(b.dataset.region);
});
document.getElementById('arcanaBridges')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-bridge]');
 if(b)focus(b.dataset.bridge);
});
detail.addEventListener('click',e=>{
 const u=e.target.closest('[data-unlock]');if(u){unlock();return}
 const p=e.target.closest('[data-person]');if(p){focus(p.dataset.person);return}
 const d=e.target.closest('[data-dossier]');if(d){openDossier(d.dataset.dossier);return}
 const picture=e.target.closest('[data-portrait]');if(picture)showPhoto(picture.dataset.portrait);
});
document.getElementById('bondShowAll')?.addEventListener('click',()=>{selected=null;render()});
board.addEventListener('click',e=>{
 if(!e.target.closest('[data-to-record]'))return;
 const top=detail.getBoundingClientRect().top+scrollY-84;
 window.scrollTo({top:Math.max(0,top),behavior:quiet()?'auto':'smooth'});
});
// Rift records point to one another inside the register instead of the imperial map.
document.getElementById('people')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-rift-record]');if(!b||typeof setFilter!=='function')return;
 const p=people.get(Number(b.dataset.riftRecord));if(!p||(p.sealed&&!window.SOLARIA_RIFT_UNLOCKED))return;
 setFilter(typeof filt!=='undefined'&&filt==='all'?'all':'rift',p.no);
 const box=document.getElementById('peopleDossier');
 if(box){const r=box.getBoundingClientRect();if(r.top<0||r.top>innerHeight*.45)window.scrollTo({top:Math.max(0,r.top+scrollY-84),behavior:quiet()?'auto':'smooth'})}
});
let resizeTimer;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(sky().w!==geo.w)renderGraph()},180)});
// The arrows beside "01 / 08" turn to the previous or next region, wrapping around.
for(const [id,dir] of [['bondScrollLeft',-1],['bondScrollRight',1]]){
 document.getElementById(id)?.addEventListener('click',()=>{const i=factions.findIndex(x=>x[0]===region);goRegion(factions[(i+dir+factions.length)%factions.length][0])});
}
const gallery=document.createElement('dialog');
gallery.className='arc-gallery';
gallery.setAttribute('aria-label','인물 일러스트 크게 보기');
gallery.innerHTML='<div class="arc-gallery-wrap"><div class="arc-gallery-heading"><b id="arcGalleryName"></b><button type="button" data-close>닫기 ×</button></div><img id="arcGalleryImage" alt=""><div class="arc-gallery-foot"><span id="arcGalleryRole"></span><button type="button" data-gallery-dossier>인물 소개 ↗</button></div></div>';
document.body.append(gallery);
function showPhoto(id){
 const p=people.get(Number(id));if(!p||!shown(p))return;
 photo=p;gallery.querySelector('#arcGalleryName').textContent=p.name;gallery.querySelector('#arcGalleryRole').textContent=p.role;
 const img=gallery.querySelector('#arcGalleryImage');img.src=window.SOLARIA_PORTRAIT_SRC(p.no,'c');img.alt=p.name+' 인물 일러스트';
 if(!gallery.open)gallery.showModal();
}
gallery.addEventListener('click',e=>{
 if(e.target===gallery||e.target.closest('[data-close]')){gallery.close();return}
 if(e.target.closest('[data-gallery-dossier]')&&photo){gallery.close();openDossier(photo.no)}
});
window.SOLARIA_ATLAS={focus,preview,refresh:render};
render();
if(typeof setPerson==='function'&&typeof cur!=='undefined')setPerson(cur,false);
})();