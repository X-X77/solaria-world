/* Solaria — independent random press-and-hold resonance.
   Staged charge (sigil, dimming, hum), a release burst shaped by the attribute,
   varied readings, and an ink-written observation sealed in wax. */
(()=>{
'use strict';
const root=document.getElementById('resonance');if(!root)return;
const device=document.getElementById('resDevice'),phase=document.getElementById('resPhase'),panel=document.getElementById('resResult');
const stage=device; // shaking the device keeps the fixed Nox flash full-screen
const MIN_HOLD=1200;
function randomUnit(){const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]/4294967296}
const pick=list=>list[Math.floor(randomUnit()*list.length)];
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── readings ── */
const outcomes=[
 {limit:.14,state:'quiet',title:'무반응',tier:'soft',power:0,lines:[
  '마석은 침묵을 지켰습니다. 외부의 파장에 흔들리지 않는 고요함도 하나의 성질입니다. 아직 드러나지 않은 적성을 천천히 살펴보세요.',
  '손끝이 닿았지만 수정은 차갑게 가라앉아 있습니다. 오늘의 파장은 아직 이곳에 닿지 않았습니다.',
  '고리만 잠시 떨렸을 뿐, 빛은 일어나지 않았습니다. 기록관은 이 고요를 빈칸 그대로 남깁니다.']},
 {limit:.38,state:'faint',title:'미약 반응',tier:'soft',power:.3,lines:[
  '수정 깊숙한 곳에서 작은 빛이 숨을 쉽니다. 지금은 희미하지만, 섬세한 파장을 감지할 가능성이 남아 있습니다.',
  '먼지만 한 빛 알갱이가 수정 표면을 스치고 사라집니다. 약하지만 분명히 응답한 흔적입니다.',
  '측정 바늘이 아주 조금 기울었습니다. 귀를 기울여야 들리는 작은 파장이 남았습니다.']},
 {limit:.69,state:'success',title:'안정 반응',tier:'steady',power:.55,lines:[
  '마력이 일정한 리듬으로 흐릅니다. 흔들림 없이 파장을 유지하는 균형 잡힌 공명입니다.',
  '빛이 고르게 차올라 수정 전체를 채웁니다. 장치의 고리가 같은 속도로 천천히 돌기 시작합니다.',
  '파장이 흔들림 없이 이어집니다. 마탑의 기준표에 그대로 옮겨 적을 수 있는 깨끗한 공명입니다.']},
 {limit:.89,state:'high',title:'고출력 반응',tier:'strong',power:.85,lines:[
  '마석 중심에서 강한 빛이 솟아납니다. 풍부한 마력을 다루기 위한 제어와 수련이 필요합니다.',
  '빛이 수정의 경계를 넘어 고리까지 번집니다. 측정 장치가 한계에 가까운 수치를 기록합니다.',
  '공명이 손끝을 밀어낼 만큼 강하게 되돌아옵니다. 큰 힘에는 그만큼 단단한 제어가 필요합니다.']},
 {limit:.99,state:'unstable',title:'불안정 반응',tier:'strong',power:.75,lines:[
  '서로 다른 파장이 부딪칩니다. 변동이 큰 마력도 자신만의 흐름을 찾으면 새로운 가능성이 됩니다.',
  '빛이 켜졌다 꺼지기를 반복합니다. 두 개의 박자가 서로를 앞지르려 다투고 있습니다.',
  '고리가 엇박자로 흔들립니다. 길들지 않은 파장은 다루기 어렵지만, 그만큼 넓게 뻗어 나갑니다.']},
 {limit:1,state:'burst',title:'기록 외 이상 반응',tier:'strong',power:1,lines:[
  '분류표에 없는 파장이 관측되었습니다. 수정에 균열이 번지고 측정 장치가 경고를 남깁니다.',
  '수치가 기록표의 칸을 넘어섰습니다. 수정 표면에 가는 금이 가고, 장치가 스스로 접촉을 끊습니다.',
  '분류되지 않은 빛이 한순간 연구실을 가득 채웠습니다. 기록관은 이 수치를 어느 칸에도 적지 못했습니다.']}
];
const attributes=[
 {key:'fire',name:'불',color:'255,119,76',tone:392,line:'열을 일으키고 변화를 이끄는 파장입니다.',soft:'손끝에 남은 온기가 쉽게 식지 않습니다.',strong:'불씨가 수정 밖으로 튀어 오를 듯 일렁입니다.'},
 {key:'water',name:'물',color:'77,174,255',tone:523,line:'흐름을 읽고 유연하게 이어지는 파장입니다.',soft:'수정 안에 잔물결 같은 무늬가 번집니다.',strong:'빛이 물살처럼 고리를 타고 흘러넘칩니다.'},
 {key:'wind',name:'바람',color:'138,231,205',tone:659,line:'보이지 않는 움직임을 따라 퍼지는 파장입니다.',soft:'보이지 않는 숨결이 손등을 스치고 지나갑니다.',strong:'고리 사이로 돌개바람 같은 흐름이 휘몰아칩니다.'},
 {key:'earth',name:'땅',color:'213,169,98',tone:196,line:'단단한 기반을 세우고 형태를 지탱하는 파장입니다.',soft:'받침대 아래에서 묵직한 울림이 전해집니다.',strong:'장치 전체가 바닥에 뿌리내린 듯 단단히 버팁니다.'},
 {key:'lightning',name:'번개',color:'210,157,255',tone:740,line:'순간의 집중으로 길을 여는 파장입니다.',soft:'손끝에 가는 정전기가 따끔하게 남습니다.',strong:'수정 안에서 푸른 섬광이 연달아 터집니다.'},
 {key:'ice',name:'얼음',color:'169,232,255',tone:1047,line:'고요한 결정 안에 힘을 응축하는 파장입니다.',soft:'수정 표면에 옅은 서리가 내려앉습니다.',strong:'고리 끝까지 하얀 결정이 뻗어 나갑니다.'},
 {key:'light',name:'빛',color:'255,238,173',tone:880,line:'감춰진 흔적을 비추고 밝혀내는 파장입니다.',soft:'수정 한가운데에 작은 별 하나가 켜집니다.',strong:'눈을 뜨기 어려울 만큼 맑은 빛이 쏟아집니다.'},
 {key:'shadow',name:'그림자',color:'147,114,211',tone:233,line:'빛이 닿지 않는 경계에 머무는 파장입니다.',soft:'빛 가장자리에 옅은 그늘이 고입니다.',strong:'수정의 빛이 안쪽부터 검게 잠겨 듭니다.'}
];
const specials={
 dual:{label:'쌍속성 공명',line:'두 개의 파장이 하나의 고리 안에서 맞물립니다. 서로 다른 성질을 함께 다루는 드문 적성입니다.'},
 inverse:{label:'역류',line:'빛이 퍼지는 대신 수정 안쪽으로 빨려 들어갑니다. 마석이 손끝의 마력을 거꾸로 끌어당겼습니다.'},
 echo:{label:'잔향',line:'첫 파장이 가라앉은 뒤, 같은 리듬이 한 번 더 돌아왔습니다.'}
};
/* the Magic Tower watches: observer memos in five voices */
const TOWER_TIER={"quiet": [[46, "으음… 적을 게 없네요. 다음 분 들어오세요."], [46, "빈칸도 기록이에요… 서명은 해 두고 가세요."], [47, "장치 탓은 마십시오. 장치는 멀쩡하니까요."], [47, "침묵도 결과라고 우기실 생각은 아니시겠지요?"], [48, "어라, 조용하네요? 잠깐, 제 측정 바늘 어디 갔지…"], [7, "고요하군요. 아무것도 없는 표본도 비교군으로는 쓸모가 있습니다."]], "faint": [[48, "잠깐만요! 약해도 이건 데이터예요!"], [48, "방금 깜빡였죠? 봤어요, 분명히 봤어요!"], [8, "미약하지만 0은 아니에요. 0이 아니면 가능성이에요."], [8, "어, 수치가… 아니 맞아요, 아주 작지만 반응이 있어요!"], [47, "이 정도면 숨소리와 구분하기도 어렵겠군요."], [46, "으음… 희미하네요. 그래도 누락 없이 적어 두세요."]], "success": [[8, "교과서에 실어도 될 만큼 깨끗한 파형이에요!"], [8, "봐요, 흔들림이 거의 없어요. 이런 게 기준 표본이에요."], [7, "무난하군요. 마탑은 무난한 인재를 가장 오래 씁니다."], [48, "이 리듬 좋다… 저 이거 따로 베껴 둘게요!"], [46, "으음… 예산 걱정 없는 결과네요. 좋아요."], [47, "평범하게 훌륭하군요. 칭찬으로 들으셔도 됩니다."]], "high": [[7, "흥미롭군요. 부디 다음 실험에도 협조해 주시길."], [7, "이 정도 출력이면… 해부까지는 하지 않겠습니다. 아마도."], [8, "와, 수치가 기준표를 넘었어요! 제어 이론부터 같이 봐요!"], [8, "잠깐, 계산이… 아니, 맞아요! 진짜 이만큼 나왔어요!"], [47, "힘만 세서는 쓸모없습니다. 다루실 수는 있으십니까?"], [48, "장치 뜨거워요! 아니 뜨거운 건 아닌데 기분이 뜨거워요!"]], "unstable": [[47, "제어가 엉망이군요. …수치만은 인정하겠습니다."], [47, "박자가 둘이군요. 하나는 버리셔야 할 겁니다."], [48, "흔들려요, 흔들려! 이거 실패 아니에요, 데이터예요!"], [48, "파형이 막 춤춰요! 펜, 제 펜 어디 갔어요?"], [8, "불안정한 건 나쁜 게 아니에요. 아직 길이 안 정해졌을 뿐이에요."], [46, "으음… 고리가 흔들렸네요. 수리비는 어느 쪽 예산이죠?"]], "burst": [[46, "으음… 그래서, 이 장치는 누가 책임지죠?"], [46, "금이 갔네요. 보고서는 오늘 안으로 받겠어요."], [8, "이건 이론상 불가능… 아니, 지금 눈앞에서 가능했네요?!"], [48, "다들 엎드려요! …아, 끝났나? 기록, 기록부터!"], [7, "분류표에 없는 수치라. 오랜만에 가슴이 뛰는군요."], [47, "…제 계산이 틀린 게 아니라면, 이건 제 계산 밖입니다."]]};
const TOWER_SPECIAL={"dual": [[8, "두 개요? 이건 이론상… 아니, 맞아요! 가능해요!"], [48, "색이 두 개예요! 이거 논문감이에요, 논문감!"], [7, "두 갈래의 파장이라. 탐나는 표본이군요."], [47, "쌍속성이라… 노바보다는 흥미롭군요."]], "inverse": [[7, "마석이 손님을 거꾸로 읽었군요. 표본으로 남겨 두죠."], [8, "빛이 안으로 들어갔어요… 흐름이 반대예요. 처음 봐요!"], [46, "으음… 마력이 빨려 들어갔다고요? 장치 점검부터 하죠."], [48, "거꾸로 돌았어요! 이거 장비 고장 아니죠? 아니죠?"]], "echo": [[48, "방금 또 울렸죠? 기록, 기록해야 해요!"], [8, "잔향이에요! 같은 박자로 한 번 더… 정말 드물어요."], [47, "메아리라. 한 번으로는 부족하셨나 봅니다."], [7, "여운이 남는 파장이군요. 쉽게 잊히지 않겠습니다."]]};
const TOWER_ATTR={"fire": [[48, "불이다! 아, 제 메모지… 탄 건 아니죠?"], [8, "불 속성은 변환 효율이 좋아요. 다만 성질이 급하죠."], [47, "불이군요. 성급함까지 닮지는 마십시오."], [46, "으음… 불이면 연구실 커튼부터 치우세요."]], "water": [[8, "물 속성은 흐름을 읽는 데 강해요. 해석 쪽에 잘 맞아요."], [48, "물이에요! 장치에 물기는… 없네요. 신기하다."], [7, "물이라. 어디로든 스며드는 재능은 늘 쓸모가 있지요."], [47, "유연하다는 건 줏대가 없다는 말이기도 합니다."]], "wind": [[48, "바람이요? 방금 제 서류 날아갔어요!"], [8, "바람 속성은 감지 범위가 넓어요. 정찰 마법에 딱이에요."], [46, "으음… 바람이네요. 창문은 닫고 하세요."], [7, "보이지 않는 것을 다루는 재능이군요. 마음에 듭니다."]], "earth": [[47, "땅이군요. 묵직한 건 장점이지만 느린 건 단점입니다."], [8, "땅 속성은 안정성이 최고예요. 방어 술식에 잘 맞아요."], [48, "바닥 울린 거 느꼈어요? 저만 느꼈어요?"], [46, "으음… 땅이면 실험실 바닥 균열부터 확인하죠."]], "lightning": [[48, "번개다! 머리카락 섰어요, 제 머리 봐요!"], [8, "번개 속성은 순간 출력이 최고예요. 집중력이 관건이에요."], [47, "빠르군요. 생각도 그만큼 빠르시길 바랍니다."], [7, "섬광은 아름답지요. 짧아서 더 그렇습니다."]], "ice": [[8, "얼음 속성은 마력 응축에 강해요. 정밀 제어 쪽이에요."], [48, "손 시려요! 아니 진짜로, 장치에 서리 꼈어요!"], [47, "차갑군요. 저와 대화가 잘 통하실지도 모르겠습니다."], [46, "으음… 얼음이네요. 차는 따뜻한 걸로 부탁해요."]], "light": [[7, "빛이라. 감춰진 것을 들추는 재능은 위험하면서도 귀하지요."], [8, "빛 속성은 분석이랑 궁합이 좋아요. 저랑 같이 연구해요!"], [48, "눈부셔! 기록하려는데 종이가 안 보여요!"], [47, "밝군요. 눈에 띄는 걸 좋아하시나 봅니다."]], "shadow": [[7, "그림자라. 빛이 닿지 않는 곳에 흥미가 많으시군요."], [8, "그림자 속성은 연구가 덜 된 분야예요. 그래서 더 궁금해요!"], [46, "으음… 그림자면 보고서를 두 번 확인하겠어요."], [48, "어두워졌다… 아 깜짝이야, 제 그림자였네요."]]};
let recentLines=[];
function drawLine(pool,avoid=[]){
 let options=pool.filter(([who,text])=>!avoid.includes(who)&&!recentLines.includes(text));
 if(!options.length)options=pool.filter(([who])=>!avoid.includes(who));
 if(!options.length)options=pool;
 const choice=pick(options);recentLines=[choice[1],...recentLines].slice(0,10);return choice;
}
const towerPerson=no=>typeof P!=='undefined'&&Array.isArray(P)?P.find(p=>p.no===no):null;
function memoEntry([no,text],delay){
 const person=towerPerson(no),el=document.createElement('div');el.className='res-memo-entry';el.style.animationDelay=delay+'ms';
 const who=document.createElement('button');who.type='button';who.className='res-memo-who';who.dataset.memoPerson=no;who.setAttribute('aria-label',(person?person.name:'')+' 인물 도감 보기');
 const img=document.createElement('img');img.alt='';img.loading='lazy';if(window.SOLARIA_PORTRAIT_SRC)img.src=window.SOLARIA_PORTRAIT_SRC(no,'t');
 const tag=document.createElement('span'),name=document.createElement('b'),role=document.createElement('small');name.textContent=person?person.name:'';role.textContent=person?person.role:'';tag.append(name,role);
 who.append(img,tag);
 const line=document.createElement('p');line.textContent=text;
 el.append(who,line);return el;
}
function towerMemo(result,delay){
 const memo=document.createElement('section');memo.className='res-memo';memo.setAttribute('aria-label','마탑 관측자 메모');memo.style.animationDelay=delay+'ms';
 const head=document.createElement('span');head.className='res-memo-head';head.textContent='관측자 메모';memo.append(head);
 if(result.nox){memo.classList.add('lost');const lost=document.createElement('p');lost.className='res-memo-lost';lost.textContent='판독 불가 · 메모가 붉은 잉크에 덮였습니다.';memo.append(lost);return memo}
 const {strength,attribute,special,second}=result;
 const first=drawLine(special&&special!=='echo'?TOWER_SPECIAL[special]:TOWER_TIER[strength.state]);
 memo.append(memoEntry(first,delay+180));
 if(strength.state!=='quiet'&&randomUnit()<.7){
  const a=second&&randomUnit()<.5?second:attribute;
  memo.append(memoEntry(drawLine(TOWER_ATTR[a.key],[first[0]]),delay+950));
 }
 return memo;
}
const attributeNote=(a,tier)=>a.name+' · '+(tier==='soft'?a.soft:tier==='strong'?a.strong:a.line);
const noxReactions=[
 {id:'dismiss',text:'너무 미미하군.'},
 {id:'curious',text:'성장할 여지는 있나?'},
 {id:'heir',text:'역시, 후계자……'}
];
function drawNoxReaction(){
 // One independent uniform choice between the three utterances after the rare 1% event.
 const n=new Uint32Array(1);crypto.getRandomValues(n);
 return noxReactions[Math.floor(n[0]/4294967296*noxReactions.length)];
}
function makeNoxQuote(reaction){
 const quote=document.createElement('blockquote');
 quote.className='nox-quote nox-'+reaction.id;
 if(reaction.id==='heir'){
  quote.append(document.createTextNode('“역시, '));
  const distorted=document.createElement('span');
  distorted.className='nox-redacted';
  distorted.textContent='▨▨▨';
  distorted.setAttribute('aria-label','후계자');
  quote.append(distorted,document.createTextNode('……”'));
 }else{
  quote.textContent='“'+reaction.text+'”';
 }
 const who=document.createElement('cite');
 who.append(document.createTextNode('— '));
 const hiddenName=document.createElement('span');
 hiddenName.className='nox-redacted';
 hiddenName.textContent='▨▨';
 hiddenName.setAttribute('aria-label','녹스');
 who.append(hiddenName);
 quote.append(who);
 return quote;
}

/* ── wax-seal sigils ── */
const GLYPH={
 fire:'<path d="M12 3c1.2 3.2 4.6 5.2 4.6 9.6a4.6 4.6 0 0 1-9.2 0c0-2.3 1.1-3.6 2.3-4.6 0 2 .9 3.2 2.1 3.2 0-3.1-1.2-5.2.2-8.2z"/>',
 water:'<path d="M12 3.2C9.3 7.6 6.6 10.6 6.6 14a5.4 5.4 0 0 0 10.8 0c0-3.4-2.7-6.4-5.4-10.8z"/><path d="M9.6 14.6a2.6 2.6 0 0 0 2.4 2.4"/>',
 wind:'<path d="M3.5 9h10.2a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3.5 13h14.2a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3.5 17h6.5"/>',
 earth:'<path d="M3 19l6.8-11 4 6.2 2.4-3.4L21 19z"/><path d="M8 19l3.2-4.6"/>',
 lightning:'<path d="M13.4 2.6L5.4 13h5.8l-1 8.4 8.4-11h-5.8z"/>',
 ice:'<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.6 4.2L12 6.4l2.4-2.2M9.6 19.8L12 17.6l2.4 2.2"/>',
 light:'<circle cx="12" cy="12" r="3.6"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M5.4 18.6l2.1-2.1M16.5 7.5l2.1-2.1"/>',
 shadow:'<path d="M15.2 3.4a8.8 8.8 0 1 0 5.6 12.8A7 7 0 0 1 15.2 3.4z"/>',
 nox:'<path d="M12 3.4l-2.2 5.4 3.6 2.6-3 4.4 2.4 4.8"/><path d="M6.4 7.6l2.6 1.6M17.8 15.8l-2.8-1.2"/>',
 quiet:'<circle cx="12" cy="12" r="6.2" stroke-dasharray="2.2 2.6"/>'
};
const sealMarkup=(key,rgb,cls,delay)=>'<span class="res-seal'+(cls?' '+cls:'')+'" aria-hidden="true" style="--seal:'+rgb+';--d:'+delay+'ms"><svg viewBox="0 0 24 24">'+GLYPH[key]+'</svg></span>';

/* ── sound: synthesized, only while the site's sound toggle is on ── */
const SFX=(()=>{
 let ac=null,master=null,hum=null,noiseBuf=null;
 const enabled=()=>document.getElementById('snd')?.getAttribute('aria-pressed')==='true';
 function ctx(){
  if(!enabled())return null;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  if(!ac){try{ac=new AC();master=ac.createGain();master.gain.value=.55;master.connect(ac.destination)}catch(e){ac=null;return null}}
  if(ac.state!=='running'){try{ac.resume()}catch(e){}}
  return ac;
 }
 function noise(c){
  if(noiseBuf)return noiseBuf;
  noiseBuf=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=noiseBuf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return noiseBuf;
 }
 function tone(f,type,peak,dur,when,glide){
  const c=ctx();if(!c)return;const t=c.currentTime+(when||0),o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);
 }
 function hiss(peak,dur,f1,f2,when,q){
  const c=ctx();if(!c)return;const t=c.currentTime+(when||0),s=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain();
  s.buffer=noise(c);bp.type='bandpass';bp.Q.value=q||1.1;bp.frequency.setValueAtTime(f1,t);bp.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(bp);bp.connect(g);g.connect(master);s.start(t);s.stop(t+dur+.05);
 }
 return{
  humStart(){
   const c=ctx();if(!c||hum)return;const t=c.currentTime;
   const o1=c.createOscillator(),o2=c.createOscillator(),lp=c.createBiquadFilter(),g=c.createGain();
   o1.type='sine';o1.frequency.value=98;o2.type='triangle';o2.frequency.value=147;o2.detune.value=7;
   lp.type='lowpass';lp.frequency.value=260;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.5);
   o1.connect(lp);o2.connect(lp);lp.connect(g);g.connect(master);o1.start(t);o2.start(t);hum={o1,o2,lp,g};
  },
  humLevel(x){if(!hum||!ac)return;const t=ac.currentTime;hum.lp.frequency.setTargetAtTime(260+x*1700,t,.08);hum.o1.frequency.setTargetAtTime(98+x*46,t,.1);hum.o2.frequency.setTargetAtTime(147+x*70,t,.1);hum.g.gain.setTargetAtTime(.06+x*.08,t,.1)},
  humStop(){if(!hum||!ac)return;const h=hum,t=ac.currentTime;hum=null;h.g.gain.cancelScheduledValues(t);h.g.gain.setTargetAtTime(.0001,t,.05);h.o1.stop(t+.3);h.o2.stop(t+.3)},
  ready(){tone(1318,'sine',.09,.7);tone(1976,'sine',.045,.55,.03)},
  release(power,a,inverse){
   if(inverse){hiss(.2+power*.2,.7,240,2600,0,.9);tone(55,'sine',.3,.5,.55,90);}
   else{hiss(.16+power*.26,.5+power*.45,2600,240);tone(74,'sine',.22+power*.32,.55,0,38);}
   if(a&&power>0){tone(a.tone,'triangle',.06+power*.05,1.3,.06);tone(a.tone*1.5,'sine',.035,1.1,.1);if(a.key==='lightning')for(let i=0;i<5;i++)hiss(.12,.06,4000,3000,.05+i*.07+Math.random()*.04,2)}
   if(power===0)tone(180,'sine',.05,.4,0,140);
  },
  echo(a){if(a){tone(a.tone,'triangle',.05,1.1);tone(a.tone*2,'sine',.02,.9,.05)}},
  seal(){hiss(.24,.13,900,160,0,.7);tone(108,'sine',.18,.16,0,60)},
  nox(){
   const c=ctx();if(!c)return;const t=c.currentTime,o=c.createOscillator(),sh=c.createWaveShaper(),g=c.createGain(),curve=new Float32Array(256);
   for(let i=0;i<256;i++){const x=i/128-1;curve[i]=Math.tanh(x*6)}
   sh.curve=curve;o.type='sawtooth';o.frequency.setValueAtTime(55,t);o.frequency.linearRampToValueAtTime(41,t+1.4);
   g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+1.5);
   o.connect(sh);sh.connect(g);g.connect(master);o.start(t);o.stop(t+1.6);
   for(let i=0;i<9;i++)hiss(.2,.05,3000,1200,Math.random()*.9,3);
  }
 };
})();

/* ── light on the device: canvas effects ── */
const FX=(()=>{
 const cv=document.createElement('canvas');cv.className='res-fx';cv.setAttribute('aria-hidden','true');
 const g=cv.getContext('2d');let W=0,H=0,items=[],raf=0,last=0;
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const C=()=>({x:W*.505,y:H*.36});
 function fit(){const r=device.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=Math.max(1,Math.round(W*d));cv.height=Math.max(1,Math.round(H*d));g.setTransform(d,0,0,d,0,0)}
 function add(it){it.t=-(it.delay||0);items.push(it);if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
 function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;g.clearRect(0,0,W,H);
  items=items.filter(it=>{it.t+=dt;if(it.t<0)return true;const k=it.t/it.life;if(k>=1)return false;g.save();it.draw(k,dt);g.restore();return true});
  raf=items.length?requestAnimationFrame(loop):0;
 }
 function clear(){items=[];if(raf)cancelAnimationFrame(raf);raf=0;g.clearRect(0,0,W,H)}
 const col=(rgb,a)=>'rgba('+rgb+','+Math.max(0,Math.min(1,a)).toFixed(3)+')';
 function flash(rgb,power,delay){
  add({life:.55,delay,draw(k){const c=C(),R=W*.62,a=(1-k)*(1-k)*(.35+power*.55);g.globalCompositeOperation='lighter';
   const gr=g.createRadialGradient(c.x,c.y,0,c.x,c.y,R);gr.addColorStop(0,col('255,250,240',a));gr.addColorStop(.25,col(rgb,a*.8));gr.addColorStop(1,col(rgb,0));g.fillStyle=gr;g.fillRect(0,0,W,H)}});
 }
 function ring(rgb,power,delay,inward,width){
  add({life:.85,delay,draw(k){const c=C(),R=W*(.18+power*.5),e=1-Math.pow(1-k,3),r=inward?R*(1-e)+4:R*e+6;g.globalCompositeOperation='lighter';
   g.lineWidth=(width||1)*(1.5+(1-k)*7*(.4+power));g.strokeStyle=col(rgb,(1-k)*.85);g.beginPath();g.ellipse(c.x,c.y,r,r*.82,0,0,Math.PI*2);g.stroke();
   g.lineWidth=1;g.strokeStyle=col('255,255,255',(1-k)*.6);g.beginPath();g.ellipse(c.x,c.y,r*.94,r*.77,0,0,Math.PI*2);g.stroke()}});
 }
 function dim(rgb,strength,life){add({life,draw(k){const c=C(),a=Math.sin(Math.PI*k)*strength;const gr=g.createRadialGradient(c.x,c.y,W*.05,c.x,c.y,W*.7);gr.addColorStop(0,col(rgb,a*.4));gr.addColorStop(1,col('4,3,10',a));g.fillStyle=gr;g.fillRect(0,0,W,H)}})}
 // one particle field per attribute
 function field(a,n,inward){
  const c0=C(),rgb=a.color,key=a.key,ps=[];
  for(let i=0;i<n;i++){
   const ang=rnd(0,Math.PI*2),sp=rnd(.55,1),R=W*rnd(.2,.42);
   const p={x:c0.x+rnd(-8,8),y:c0.y+rnd(-10,10),vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,ang,s:rnd(1.4,3.6),rot:rnd(0,6.3),vr:rnd(-4,4),life:rnd(.9,1.7),r0:R,w:rnd(2.4,4.6)};
   if(inward){p.x=c0.x+Math.cos(ang)*R;p.y=c0.y+Math.sin(ang)*R*.85;p.vx=-Math.cos(ang)*R/1.1;p.vy=-Math.sin(ang)*R*.85/1.1;p.life=1.1}
   else if(key==='fire'){p.vx=rnd(-45,45);p.vy=rnd(-190,-60);p.ay=-40}
   else if(key==='water'){p.vx*=rnd(90,230);p.vy=p.vy*rnd(90,200)-70;p.ay=300}
   else if(key==='earth'){p.vx*=rnd(110,250);p.vy=p.vy*rnd(80,200)-120;p.ay=560;p.s=rnd(2.6,5.8)}
   else if(key==='ice'){p.vx*=rnd(25,85);p.vy*=rnd(25,85);p.s=rnd(3.5,7.5);p.life=rnd(1.4,2.1)}
   else if(key==='shadow'){p.vx*=rnd(20,60);p.vy*=rnd(20,60);p.s=rnd(14,34);p.life=rnd(1.2,1.9)}
   else if(key==='wind'){p.s=rnd(1.2,2.4)}
   else{p.vx*=rnd(80,240);p.vy*=rnd(80,240);p.ay=key==='light'?-20:60}
   ps.push(p);
  }
  add({life:2.2,draw(k,dt){
   g.globalCompositeOperation=key==='shadow'?'source-over':'lighter';
   const c=C();
   for(const p of ps){
    p.age=(p.age||0)+dt;const q=p.age/p.life;if(q>=1)continue;const fade=q<.12?q/.12:1-(q-.12)/.88;
    if(key==='wind'&&!inward){
     p.ang+=dt*p.w;const rr=(p.rr||8)+dt*rnd(70,150);p.rr=rr;const px=p.x,py=p.y;p.x=c.x+Math.cos(p.ang)*rr;p.y=c.y+Math.sin(p.ang)*rr*.7;
     g.strokeStyle=col(rgb,fade*.9);g.lineWidth=p.s;g.lineCap='round';g.beginPath();g.moveTo(px,py);g.lineTo(p.x,p.y);g.stroke();continue;
    }
    p.vy+=(p.ay||0)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
    if(key==='fire'&&!inward){const hot=1-q;g.fillStyle=col(hot>.6?'255,236,170':hot>.3?'255,150,70':'220,70,40',fade*(.6+.4*Math.random()));g.beginPath();g.arc(p.x,p.y,p.s*(.6+hot*.6),0,7);g.fill()}
    else if(key==='earth'&&!inward){g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=col(rgb,fade);g.beginPath();g.moveTo(0,-p.s);g.lineTo(p.s*.9,p.s*.7);g.lineTo(-p.s*.8,p.s*.5);g.closePath();g.fill();g.setTransform(cv.width/W,0,0,cv.height/H,0,0)}
    else if(key==='ice'&&!inward){g.translate(p.x,p.y);g.rotate(p.rot);g.strokeStyle=col('225,248,255',fade);g.lineWidth=1.2;g.beginPath();for(let j=0;j<3;j++){g.moveTo(-p.s,0);g.lineTo(p.s,0);g.rotate(Math.PI/3)}g.stroke();g.setTransform(cv.width/W,0,0,cv.height/H,0,0)}
    else if(key==='shadow'&&!inward){const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.s*(1+q));gr.addColorStop(0,col('28,14,46',fade*.55));gr.addColorStop(1,col('28,14,46',0));g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.s*(1+q),0,7);g.fill()}
    else{g.fillStyle=col(rgb,fade);g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill();g.fillStyle=col('255,255,255',fade*.6);g.beginPath();g.arc(p.x,p.y,p.s*.45,0,7);g.fill()}
   }
  }});
  if(inward)return;
  if(key==='lightning'){
   const bolts=3+Math.round(n/18);
   add({life:.55,draw(k){const c=C();g.globalCompositeOperation='lighter';if(Math.random()<.35)return;
    for(let b=0;b<bolts;b++){const ang=(b/bolts)*Math.PI*2+rnd(-.3,.3),L=W*rnd(.22,.4);let x=c.x,y=c.y;g.strokeStyle=col('235,220,255',(1-k));g.lineWidth=rnd(1.2,2.6);g.beginPath();g.moveTo(x,y);
     for(let s=1;s<=7;s++){const d=L*s/7;x=c.x+Math.cos(ang)*d+rnd(-10,10);y=c.y+Math.sin(ang)*d*.8+rnd(-10,10);g.lineTo(x,y)}g.stroke();
     g.strokeStyle=col(rgb,(1-k)*.5);g.lineWidth=6;g.stroke()}}});
  }
  if(key==='light'){
   add({life:1.2,draw(k){const c=C(),N=14,R=W*.55;g.globalCompositeOperation='lighter';g.translate(c.x,c.y);g.rotate(k*.35);
    for(let i=0;i<N;i++){g.rotate(Math.PI*2/N);const gr=g.createLinearGradient(0,0,R,0);gr.addColorStop(0,col('255,248,220',(1-k)*.55));gr.addColorStop(1,col(rgb,0));g.fillStyle=gr;g.beginPath();g.moveTo(0,-3);g.lineTo(R*(.7+.3*Math.sin(i*1.7)),0);g.lineTo(0,3);g.fill()}}});
  }
  if(key==='water'){for(let i=0;i<3;i++)add({life:1.3,delay:i*.18,draw(k){const c=C(),r=W*.06+k*W*.3;g.globalCompositeOperation='lighter';g.strokeStyle=col(rgb,(1-k)*.6);g.lineWidth=1.4;g.beginPath();g.ellipse(c.x,H*.73,r,r*.22,0,0,7);g.stroke()}})}
  if(key==='shadow')dim('60,30,90',.55,1.6);
  if(key==='ice')add({life:1.6,draw(k){const a=Math.sin(Math.PI*k)*.5,gr=g.createRadialGradient(W/2,H/2,W*.3,W/2,H/2,W*.75);gr.addColorStop(0,col('200,240,255',0));gr.addColorStop(1,col('200,240,255',a));g.fillStyle=gr;g.fillRect(0,0,W,H)}});
 }
 function cracks(life){add({life,draw(k){const c=C();g.globalCompositeOperation='lighter';g.strokeStyle=col('255,90,120',(1-k));g.lineWidth=1.6;
  for(let i=0;i<6;i++){let x=c.x,y=c.y;const ang=i*1.05+.4;g.beginPath();g.moveTo(x,y);for(let s=1;s<6;s++){x+=Math.cos(ang)*W*.045+rnd(-6,6);y+=Math.sin(ang)*W*.04+rnd(-6,6);g.lineTo(x,y)}g.stroke()}}})}
 function glitch(){add({life:1,draw(k){if(Math.random()<.25)return;g.globalCompositeOperation='source-over';
  for(let i=0;i<7;i++){const y=rnd(0,H),h=rnd(2,16);g.fillStyle=Math.random()<.5?col('200,20,50',.35*(1-k)):col('10,0,4',.5*(1-k));g.fillRect(rnd(-20,W*.3),y,rnd(W*.3,W),h)}}})}
 return{
  cv,clear,
  burst(r){
   fit();clear();
   if(calm()){flash(r.nox?'226,52,91':r.attribute.color,.35,0);return}
   if(r.nox){flash('236,44,78',1,0);ring('236,44,78',1,0);cracks(1.1);glitch();field({key:'fire',color:'236,44,78'},40);return}
   const s=r.strength,a=r.attribute,p=s.power;
   if(s.state==='quiet'){ring('170,170,190',.15,0,false,.5);field({key:'earth',color:'150,150,165'},10);return}
   const inward=r.special==='inverse';
   flash(a.color,p,inward?.5:0);ring(a.color,p,0,inward);if(p>.5)ring(a.color,p*.7,.12,inward,.6);
   const n=Math.round((r.special==='dual'?32:60)*(.35+p));
   field(a,n,inward);
   if(r.second){ring(r.second.color,p*.85,.08);field(r.second,n)}
   if(inward)dim('8,4,20',.7,1.5);
   if(s.state==='unstable'){flash('255,255,255',.4,.25);ring(a.color,.6,.32,false,.8);flash(a.color,.5,.5)}
   if(s.state==='burst')cracks(1);
  },
  echo(r){fit();if(calm())return;ring(r.attribute.color,.45,0);field(r.attribute,16)}
 };
})();

/* ── charge sigil & overlays (added to the device once) ── */
(function mount(){
 const ticks=[...Array(48)].map((_,i)=>{const a=i*7.5*Math.PI/180,r1=i%4?80:76;return '<line x1="'+(Math.cos(a)*r1).toFixed(1)+'" y1="'+(Math.sin(a)*r1).toFixed(1)+'" x2="'+(Math.cos(a)*84).toFixed(1)+'" y2="'+(Math.sin(a)*84).toFixed(1)+'"/>'}).join('');
 const marks=[...Array(8)].map((_,i)=>'<g transform="rotate('+i*45+') translate(0 -62)"><path d="M0 -5L4 0L0 5L-4 0Z"/></g>').join('');
 const tri=r=>[0,120,240].map(d=>{const a=(d-90)*Math.PI/180;return (Math.cos(a)*r).toFixed(1)+','+(Math.sin(a)*r).toFixed(1)}).join(' ');
 const svg='<svg viewBox="-100 -100 200 200"><g class="sig-out"><circle r="95"/><circle r="89" stroke-dasharray="1.5 5"/>'+ticks+'</g><g class="sig-in"><circle r="70"/><polygon points="'+tri(70)+'"/><polygon points="'+tri(70)+'" transform="rotate(180)"/>'+marks+'<circle r="36"/></g></svg>';
 const dimEl=document.createElement('span');dimEl.className='res-dim';dimEl.setAttribute('aria-hidden','true');
 const sigil=document.createElement('span');sigil.className='res-sigil';sigil.setAttribute('aria-hidden','true');sigil.innerHTML=svg;
 const noxLine=document.createElement('span');noxLine.className='res-nox-line';noxLine.setAttribute('aria-hidden','true');
 const img=device.querySelector('img');
 if(img)img.after(dimEl);else device.prepend(dimEl);
 (device.querySelector('.res-aura')||dimEl).after(sigil);
 const label=device.querySelector('.res-touch-label');
 if(label){label.before(FX.cv);label.before(noxLine)}else device.append(FX.cv,noxLine);
})();
const noxLine=device.querySelector('.res-nox-line');

/* ── the notebook: ink-written lines and a wax seal ── */
function ink(el,start,step){
 if(calm())return start;
 const text=el.textContent;el.textContent='';let i=0;
 for(const ch of text){const s=document.createElement('span');s.className='res-ink';s.textContent=ch;s.style.animationDelay=(start+i*step)+'ms';el.append(s);i++}
 return start+i*step;
}
function addRow(profile,name,value){
 const row=document.createElement('div'),term=document.createElement('dt'),definition=document.createElement('dd');
 term.textContent=name;definition.textContent=value;row.append(term,definition);profile.append(row);
}
let echoTimer=0;
function renderOutcome(result){
 const {strength,attribute,nox,special,second}=result;
 clearTimeout(echoTimer);
 setState(nox?'nox':strength.state);
 root.dataset.element=nox?'nox':attribute.key;
 root.style.setProperty('--res-light',nox?'236,44,78':attribute.color);
 if(second)root.style.setProperty('--res-light2',second.color);else root.style.removeProperty('--res-light2');
 root.dataset.special=special||'';
 const elementText=second?attribute.name+' + '+second.name+' 쌍속성':attribute.name+' 속성';
 phase.textContent=nox?'시스템 경고 · 기록 외 음성 감지':strength.title+' · '+elementText+(special==='inverse'?' · 역류':'');
 panel.replaceChildren();
 const label=document.createElement('span');label.textContent='마법사 적성 관측';
 const title=document.createElement('h4');title.textContent=nox?'기록 외 반응 감지':strength.title;
 const text=document.createElement('p');text.textContent=nox?'붉은 균열이 관측 기록을 침범했습니다. 속성 판독이 알 수 없는 목소리로 대체됩니다.':pick(strength.lines);
 const profile=document.createElement('dl');profile.className='res-profile';
 addRow(profile,'반응 강도',strength.title);
 addRow(profile,'적성 속성',nox?'판독 중단 · 기록 손상':second?attribute.name+' · '+second.name:attribute.name);
 if(!nox&&special)addRow(profile,'특이 관측',special==='echo'?'관측 중…':specials[special].label);
 panel.append(label,title,profile,text);
 const extra=[];
 let reaction=null;
 if(nox){
  reaction=drawNoxReaction();
  const warning=document.createElement('p');warning.className='res-system-warning';warning.textContent='SYSTEM WARNING / 기록 외 신호 · 속성 기록 덮어쓰기';panel.append(warning,makeNoxQuote(reaction));
 }else{
  if(special&&special!=='echo'){const sp=document.createElement('p');sp.className='res-special-note';sp.textContent=specials[special].line;panel.append(sp);extra.push(sp)}
  const detail=document.createElement('p');detail.className='res-attribute-note';detail.textContent=attributeNote(attribute,strength.tier);panel.append(detail);extra.push(detail);
  if(second){const d2=document.createElement('p');d2.className='res-attribute-note second';d2.textContent=attributeNote(second,strength.tier);panel.append(d2);extra.push(d2)}
 }
 // ink: title first, then the reading; the seal lands once the title is written
 let t=ink(title,120,45);
 const sealAt=t+160;
 t=ink(text,sealAt+260,16);
 for(const p of extra)t=ink(p,t+120,12);
 panel.append(towerMemo(result,calm()?0:t+250));
 const sealKey=nox?'nox':strength.state==='quiet'?'quiet':attribute.key;
 const sealRgb=nox?'150,20,40':strength.state==='quiet'?'120,112,104':attribute.color;
 panel.insertAdjacentHTML('beforeend',sealMarkup(sealKey,sealRgb,'',calm()?0:sealAt)+(second?sealMarkup(second.key,second.color,'second',calm()?0:sealAt+180):''));
 setTimeout(()=>SFX.seal(),calm()?0:sealAt+120);
 // the burst on the device
 FX.burst(result);
 SFX.release(nox?1:strength.power,nox?null:attribute,special==='inverse');
 if(nox){
  SFX.nox();
  noxLine.textContent='';
  noxLine.append(document.createTextNode('“'+(reaction.id==='heir'?'역시, ':reaction.text)));
  if(reaction.id==='heir'){const r=document.createElement('span');r.className='nox-redacted';r.textContent='▨▨▨';noxLine.append(r,document.createTextNode('……'))}
  noxLine.append(document.createTextNode('”'));
  noxLine.classList.remove('show');void noxLine.offsetWidth;noxLine.classList.add('show');
  root.classList.remove('res-glitch');void root.offsetWidth;root.classList.add('res-glitch');setTimeout(()=>root.classList.remove('res-glitch'),1000);
 }
 const shake=nox||strength.state==='burst'?'l':strength.state==='unstable'||(attribute.key==='earth'&&strength.power>.5)?'m':strength.state==='high'?'s':'';
 if(shake&&!calm()){stage.classList.remove('res-shake-s','res-shake-m','res-shake-l');void stage.offsetWidth;stage.classList.add('res-shake-'+shake);setTimeout(()=>stage.classList.remove('res-shake-'+shake),700)}
 const buzz=nox?[80,40,80,40,140]:strength.state==='burst'?[60,30,90]:strength.state==='unstable'?[20,40,20]:strength.state==='high'?[35]:null;
 if(buzz&&navigator.vibrate){try{navigator.vibrate(buzz)}catch(e){}}
 if(!nox&&special==='echo'){
  echoTimer=setTimeout(()=>{
   if(root.dataset.special!=='echo')return;
   FX.echo(result);SFX.echo(attribute);
   const row=[...panel.querySelectorAll('.res-profile dd')].pop();if(row)row.textContent=specials.echo.label;
   const sp=document.createElement('p');sp.className='res-special-note res-echo-in';sp.textContent=specials.echo.line;
   const firstNote=panel.querySelector('.res-attribute-note');panel.insertBefore(sp,firstNote);
   phase.textContent=strength.title+' · '+elementText+' · 잔향 감지';
   const memo=panel.querySelector('.res-memo');if(memo)memo.append(memoEntry(drawLine(TOWER_SPECIAL.echo,[...memo.querySelectorAll('[data-memo-person]')].map(b=>Number(b.dataset.memoPerson))),calm()?0:250));
  },calm()?400:Math.max(1900,t+1700));
 }
 cooldown=performance.now()+900;
}

panel.addEventListener('click',e=>{
 const b=e.target.closest('[data-memo-person]');if(!b)return;
 const person=towerPerson(Number(b.dataset.memoPerson));
 if(person&&typeof setFilter==='function'){setFilter(person.aff,person.no);document.getElementById('people')?.scrollIntoView({behavior:calm()?'auto':'smooth',block:'start'})}
});
/* ── holding the device ── */
let started=null,source=null,frame=0,cooldown=0,ready=false,spin=0,lastTick=0;
function setState(state){root.dataset.state=state}
function evaluateResult(){
 // Independent draws; neither duration nor saved discovery history changes odds.
 const strengthRoll=randomUnit();
 const strength=outcomes.find(o=>strengthRoll<o.limit)||outcomes[outcomes.length-1];
 const attribute=attributes[Math.floor(randomUnit()*attributes.length)];
 const nox=randomUnit()<.01;
 let special=null;const roll=randomUnit();
 if(!nox&&strength.state!=='quiet'){
  if(roll<.06)special='dual';
  else if(roll<.09&&strength.state!=='burst')special='inverse';
  else if(roll<.14)special='echo';
 }
 const second=special==='dual'?pick(attributes.filter(a=>a!==attribute)):null;
 return {strength,attribute,nox,special,second};
}
function tick(){
 if(started===null)return;
 const now=performance.now(),elapsed=now-started,charge=Math.min(elapsed/3000,1),dt=lastTick?(now-lastTick)/1000:0;lastTick=now;
 spin=(spin+dt*(18+charge*320))%360;
 root.style.setProperty('--charge',charge);root.style.setProperty('--spin',spin.toFixed(2));
 SFX.humLevel(charge);
 if(!ready&&elapsed>=MIN_HOLD){ready=true;phase.textContent='파장 감지 · 손을 떼어 관측하세요';root.classList.add('res-ready');SFX.ready()}
 frame=requestAnimationFrame(tick);
}
function holdStart(input){
 if(started!==null||performance.now()<cooldown)return false;
 clearTimeout(echoTimer);FX.clear();noxLine?.classList.remove('show');
 delete root.dataset.element;root.dataset.special='';root.style.removeProperty('--res-light');root.style.removeProperty('--res-light2');
 root.classList.remove('res-ready','res-released');source=input;started=performance.now();lastTick=0;ready=false;setState('charging');phase.textContent='접촉 중 · 빛이 모이고 있습니다';
 SFX.humStart();tick();return true;
}
function holdEnd(cancel=false){
 if(started===null)return;
 const elapsed=performance.now()-started;started=null;source=null;cancelAnimationFrame(frame);root.style.setProperty('--charge',0);
 SFX.humStop();root.classList.remove('res-ready');
 if(cancel){setState('idle');phase.textContent='접촉이 중단되었습니다. 다시 손을 대어 주세요.';return}
 if(elapsed<MIN_HOLD){setState('idle');phase.textContent='반응이 약합니다. 조금 더 오래 접촉해 보세요.';return}
 root.classList.add('res-released');setTimeout(()=>root.classList.remove('res-released'),900);
 renderOutcome(evaluateResult());
}
device.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0)return;
 if(holdStart(e.pointerId)){e.preventDefault();device.focus({preventScroll:true});device.setPointerCapture(e.pointerId)}
});
device.addEventListener('pointerup',e=>{if(source===e.pointerId)holdEnd()});
device.addEventListener('pointercancel',e=>{if(source===e.pointerId)holdEnd(true)});
device.addEventListener('lostpointercapture',e=>{if(source===e.pointerId)holdEnd(true)});
device.addEventListener('pointermove',e=>{
 if(source!==e.pointerId||e.pointerType!=='mouse')return;
 const r=device.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)holdEnd(true);
});
device.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!e.repeat)holdStart(e.key)}});
device.addEventListener('keyup',e=>{if((e.key===' '||e.key==='Enter')&&source===e.key){e.preventDefault();holdEnd()}});
device.addEventListener('blur',()=>holdEnd(true));
window.addEventListener('blur',()=>holdEnd(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)holdEnd(true)});
})();
