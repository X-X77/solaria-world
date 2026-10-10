/* Secret Rift event — 10% per completed (unskipped) opening. */
(()=>{'use strict';
const KEY='solaria-noctis-contact-v1',P=.10,veil=document.getElementById('riftAwakening');
let linked=false,occurred=false;
try{linked=localStorage.getItem(KEY)==='linked'}catch(_){}
window.SOLARIA_RIFT_UNLOCKED=linked;
function update(){
 window.SOLARIA_RIFT_UNLOCKED=true;
 try{if(typeof filt!=='undefined'&&typeof setFilter==='function')setFilter(filt)}catch(_){}
 try{if(document.querySelector('.rtab.on')?.dataset.r==='rift'&&typeof setRegion==='function')setRegion('rift',false)}catch(_){}
 try{window.SOLARIA_ATLAS?.refresh?.()}catch(_){}
}
function close(){
 if(!veil)return;
 veil.classList.remove('visible');veil.hidden=true;
 document.documentElement.classList.remove('rift-event-active');
 document.body.style.removeProperty('overflow');
}
function navigate(destination){
 if(!linked)return;
 close();
 const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 if(destination==='bonds'){window.SOLARIA_ATLAS?.focus?.(11);return}
 if(destination==='people'){if(typeof setFilter==='function')setFilter('rift',11);document.getElementById('people')?.scrollIntoView({behavior});return}
 if(destination==='regions'){if(typeof setRegion==='function')setRegion('rift');document.getElementById('regions')?.scrollIntoView({behavior})}
}
function reveal(){
 if(linked||occurred||!veil)return;
 occurred=true;linked=true;
 try{localStorage.setItem(KEY,'linked')}catch(_){}
 update();veil.hidden=false;
 document.documentElement.classList.add('rift-event-active');
 document.body.style.overflow='hidden';
 requestAnimationFrame(()=>{veil.classList.add('visible');document.getElementById('riftAwakeningExplore')?.focus({preventScroll:true})});
}
function replay(){
 if(linked){navigate('bonds');return}
 try{sessionStorage.removeItem('sol-intro')}catch(_){}
 const url=new URL(location.href);url.searchParams.set('opening','1');url.hash='';location.href=url.toString();
}
function attempt(){
 if(linked||occurred)return;
 let random;try{const n=new Uint32Array(1);crypto.getRandomValues(n);random=n[0]/4294967296}catch(_){random=Math.random()}
 if(random<P)setTimeout(reveal,matchMedia('(prefers-reduced-motion: reduce)').matches?100:650);
}
document.addEventListener('solaria:intro-finished',attempt,{once:true});
document.getElementById('riftAwakeningExplore')?.addEventListener('click',()=>navigate('bonds'));
document.getElementById('riftAwakeningContinue')?.addEventListener('click',close);
veil?.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});
window.SOLARIA_RIFT_CONTACT={begin:replay,isLinked:()=>linked,navigate};
})();