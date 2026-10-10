/* Nox film: one independent 10% draw per completed, unskipped opening. */
(()=>{'use strict';
const KEY='solaria-noctis-contact-v1',veil=document.getElementById('riftAwakening');
if(!veil)return;
const player=document.getElementById('riftFilmAudio'),cuts=[...veil.querySelectorAll('.rift-cut')],result=document.getElementById('riftFilmResult');
const latin=document.getElementById('riftFilmLatin'),korean=document.getElementById('riftFilmKorean'),status=document.getElementById('riftAwakeningText'),soundButton=document.getElementById('riftFilmSound');
// 22.392s MP3. Spectral voice onsets: 9.20s and 14.60s; closing impact: ~16.65s.
const CUES={open:4.30,nox:9.18,seal:16.65,end:22.392,lines:[{start:9.20,end:11.25,latin:'Quis silentium rupit?',korean:'누가 침묵을 깨뜨렸느냐?'},{start:14.60,end:16.60,latin:'Noli oculos avertere.',korean:'눈을 돌리지 마라.'}]};
let linked=false,attempted=false,active=false,complete=false,frame=0,mediaClock=false,sound=false,clockStart=0,clockOffset=0,pausedAt=null,backgroundPause=false,previousFocus=null,loadTimer=0,audioRequest=0;
const inertBefore=new Map();
try{linked=localStorage.getItem(KEY)==='linked'}catch(_){}
window.SOLARIA_RIFT_UNLOCKED=linked;
function update(){
 window.SOLARIA_RIFT_UNLOCKED=true;
 try{if(typeof filt!=='undefined'&&typeof setFilter==='function')setFilter(filt)}catch(_){}
 try{if(document.querySelector('.rtab.on')?.dataset.r==='rift'&&typeof setRegion==='function')setRegion('rift',false)}catch(_){}
 try{window.SOLARIA_ATLAS?.refresh?.()}catch(_){}
}
function time(){return mediaClock?player.currentTime:clockOffset+((pausedAt??performance.now())-clockStart)/1000}
function soundUI(){soundButton.textContent=sound?'소리 끄기':'소리 켜기';soundButton.setAttribute('aria-pressed',String(sound))}
function useSilentClock(){audioRequest++;clearTimeout(loadTimer);const t=mediaClock?player.currentTime:time();mediaClock=false;clockOffset=t;clockStart=performance.now();if(document.hidden)pausedAt=clockStart;player.pause();sound=false;soundUI();status.textContent='소리 없이 기록을 재생합니다.'}
function close(){
 if(!active)return;
 active=false;audioRequest++;cancelAnimationFrame(frame);clearTimeout(loadTimer);player.pause();player.currentTime=0;veil.hidden=true;veil.classList.remove('visible');
 document.documentElement.classList.remove('rift-event-active');
 for(const [el,value] of inertBefore)el.inert=value;inertBefore.clear();
 if(typeof SND!=='undefined')SND.hiddenEnd();
 const target=previousFocus?.isConnected?previousFocus:document.getElementById('snd');target?.focus({preventScroll:true});
}
function navigate(destination){
 if(!linked)return;
 close();const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 if(destination==='bonds'){window.SOLARIA_ATLAS?.focus?.(11);document.getElementById('bonds')?.scrollIntoView({behavior});return}
 if(destination==='people'){if(typeof setFilter==='function')setFilter('rift',11);document.getElementById('people')?.scrollIntoView({behavior});return}
 if(destination==='regions'){if(typeof setRegion==='function')setRegion('rift');document.getElementById('regions')?.scrollIntoView({behavior})}
}
function finish(){
 if(!active||complete)return;
 complete=true;audioRequest++;cancelAnimationFrame(frame);player.pause();clearTimeout(loadTimer);soundButton.disabled=true;
 linked=true;try{localStorage.setItem(KEY,'linked')}catch(_){}
 update();
 if(typeof setFilter==='function')setFilter('rift',11);
 veil.dataset.cut='4';veil.dataset.complete='true';latin.textContent='';korean.textContent='';
 status.textContent='봉인 해제 · 균열 기록 개방';result.hidden=false;document.getElementById('riftAwakeningExplore').focus({preventScroll:true});
}
function paint(t){
 const index=t<CUES.open?0:t<CUES.nox?1:t<CUES.seal?2:3;
 cuts.forEach((el,i)=>el.classList.toggle('active',i===index));veil.dataset.cut=String(index+1);
 const line=CUES.lines.find(l=>t>=l.start&&t<l.end);
 if(latin.textContent!==(line?.latin||'')){latin.textContent=line?.latin||'';korean.textContent=line?.korean||'';}
}
function tick(){
 if(!active||complete)return;
 const t=time();paint(t);if(t>=CUES.end-.02){finish();return}frame=requestAnimationFrame(tick);
}
async function playSound(){
 if(!active||complete)return;
 const request=++audioRequest;sound=true;soundUI();player.muted=false;player.volume=.85;
 if(!mediaClock)player.currentTime=Math.min(time(),CUES.end);
 try{
  await player.play();
  if(!active||complete){player.pause();return}
  if(request!==audioRequest){if(!sound)player.pause();return}
  mediaClock=true;player.muted=!sound;soundUI();clearTimeout(loadTimer);
  if(document.hidden){player.pause();backgroundPause=true;}
 }catch(_){if(active&&!complete&&request===audioRequest)useSilentClock()}
}
function reveal(){
 if(active)return;
 active=true;complete=false;mediaClock=false;pausedAt=null;backgroundPause=false;clockOffset=0;clockStart=performance.now();
 previousFocus=document.activeElement;
 sound=typeof SND!=='undefined'?SND.hiddenStart():false;
 soundButton.disabled=false;veil.hidden=false;veil.classList.add('visible');veil.dataset.complete='false';result.hidden=true;
 document.documentElement.classList.add('rift-event-active');
 for(const child of document.body.children){if(child===veil||['SCRIPT','STYLE','LINK'].includes(child.tagName))continue;inertBefore.set(child,child.inert);child.inert=true;}
 status.textContent=sound?'균열 너머의 기록을 재생합니다.':'소리 없이 기록을 재생합니다.';soundUI();void veil.offsetWidth;paint(0);soundButton.focus({preventScroll:true});
 if(sound){loadTimer=setTimeout(()=>{if(active&&!mediaClock)useSilentClock()},2500);playSound()}
 tick();
}
function replay(){
 if(linked){navigate('people');return}
 try{sessionStorage.removeItem('sol-intro')}catch(_){}
 const url=new URL(location.href);url.searchParams.set('opening','1');url.hash='';location.href=url.toString();
}
function attempt(){
 if(attempted)return;attempted=true;
 const n=new Uint32Array(1);crypto.getRandomValues(n);
 if(n[0]/4294967296<.10)reveal();
}
// Prime the dedicated media element during the existing sound-start gesture (important on mobile).
document.getElementById('opStart')?.addEventListener('click',()=>{
 player.volume=0;player.preload='auto';
 try{const p=player.play();p?.then(()=>{if(!active){player.pause();player.currentTime=0}}).catch(()=>{})}catch(_){}
});
document.addEventListener('solaria:intro-finished',attempt,{once:true});
player.addEventListener('waiting',()=>{if(active&&mediaClock&&!complete){clearTimeout(loadTimer);loadTimer=setTimeout(()=>{if(active&&!complete&&player.readyState<3)useSilentClock()},3000)}});
player.addEventListener('playing',()=>clearTimeout(loadTimer));
player.addEventListener('ended',()=>{if(active&&mediaClock)finish()});
player.addEventListener('error',()=>{if(active&&!complete)useSilentClock()});
soundButton.addEventListener('click',()=>{
 if(!active||complete)return;
 if(sound){sound=false;player.muted=true;soundUI()}else playSound();
});
document.getElementById('riftFilmClose').addEventListener('click',close);
document.getElementById('riftAwakeningExplore').addEventListener('click',()=>navigate('people'));
document.getElementById('riftAwakeningContinue').addEventListener('click',close);
veil.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();close();return}
 if(e.key==='Tab'){
  const buttons=[...veil.querySelectorAll('button')].filter(b=>!b.disabled&&!b.closest('[hidden]'));
  const i=buttons.indexOf(document.activeElement);
  if(e.shiftKey&&i<=0){e.preventDefault();buttons.at(-1)?.focus()}else if(!e.shiftKey&&(i===buttons.length-1||i<0)){e.preventDefault();buttons[0]?.focus()}
 }
});
document.addEventListener('visibilitychange',()=>{
 if(!active||complete)return;
 if(document.hidden){pausedAt=performance.now();if(mediaClock&&!player.paused){player.pause();backgroundPause=true}}
 else{if(pausedAt!==null){clockStart+=performance.now()-pausedAt;pausedAt=null}if(backgroundPause){backgroundPause=false;player.play().catch(()=>{if(active&&!complete)useSilentClock()})}}
});
window.SOLARIA_RIFT_CONTACT={begin:replay,isLinked:()=>linked,navigate};
})();
