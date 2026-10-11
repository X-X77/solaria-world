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
 // Add public affiliation metadata without changing setFilter/setPerson or P.
 const decorate=()=>{
  rail.querySelectorAll('.ct').forEach(card=>{
   const person=typeof list!=='undefined'?list[Number(card.dataset.i)]:null;
   if(!person||(person.sealed&&!window.SOLARIA_RIFT_UNLOCKED))return;
   card.classList.toggle('monochrome-record',(window.SOLARIA_TORN||[11,12]).includes(person.no));
   card.style.setProperty('--cast-accent',COL[person.aff]||'#d6b980');
   if(!card.querySelector('.ct-affiliation')){
    const label=document.createElement('span');label.className='ct-affiliation';
    label.textContent=AFF[person.aff]||'제국';card.append(label);
   }
  });
  update();
 };
 const observer=new MutationObserver(decorate);
 observer.observe(rail,{childList:true});
 decorate();
})();
