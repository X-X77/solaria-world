/* Supplementary character gallery navigation. Existing setFilter/setPerson untouched. */
(()=>{
 const root=document.getElementById('people'),rail=document.getElementById('strip');
 const previous=document.getElementById('castPrev'),next=document.getElementById('castNext');
 if(!root||!rail||!previous||!next)return;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const advance=dir=>{
  const item=rail.querySelector('.ct');
  if(!item)return;
  const width=item.getBoundingClientRect().width;
  const gap=parseFloat(getComputedStyle(rail).columnGap)||12;
  const count=Math.max(1,Math.floor(rail.clientWidth/(width+gap)) -1);
  rail.scrollBy({left:dir*count*(width+gap),behavior:reduced()?'instant':'smooth'});
 };
 previous.addEventListener('click',()=>advance(-1));
 next.addEventListener('click',()=>advance(1));
 const update=()=>{
  const edge=rail.scrollWidth-rail.clientWidth;
  previous.disabled=rail.scrollLeft<3;
  next.disabled=rail.scrollLeft>=edge-3||edge<=2;
 };
 rail.addEventListener('scroll',update,{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(update).observe(rail);
 const observer=new MutationObserver(update);
 observer.observe(rail,{childList:true});
 update();
})();
