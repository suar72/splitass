// Page content follows scroll position directly; the icon has no parallax.
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const planes=[...document.querySelectorAll('[data-depth]')];
const journey=document.querySelector('.journey');
const shots=[...journey.querySelectorAll('.app-shot')];
const chapters=[...journey.querySelectorAll('.chapter')];
const indices=[...journey.querySelectorAll('.chapter-index span')];
const word=journey.querySelector('.story-word'),atmosphere=journey.querySelector('.journey-atmosphere');let pending=false;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
function update(){pending=false;const height=innerHeight,calm=reduced.matches,mobile=innerWidth<=740;
 for(const plane of planes){const rect=plane.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(height*.5-(rect.top+rect.height*.5))/height));const shift=calm?0:progress*Number(plane.dataset.depth);plane.querySelector('[data-drift]').style.transform=`translate3d(0,${shift}px,0)`;}
 const rect=journey.getBoundingClientRect();const progress=calm?0:clamp(-rect.top/Math.max(1,rect.height-height));journey.style.setProperty('--progress',progress.toFixed(5));
 // Hold each screen long enough to read. Between chapters, foreground screens,
 // copy and distant typography travel different distances on the same scroll.
 const position=progress<.14?0:progress<.44?ease((progress-.14)/.30):progress<.56?1:progress<.86?1+ease((progress-.56)/.30):2;
 shots.forEach((shot,i)=>{const delta=i-position,distance=Math.abs(delta),x=delta*(mobile?190:285),y=distance*(mobile?70:120),scale=1-Math.min(1,distance)*.18;
  shot.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotateY(${delta*-12}deg) rotate(${delta*3}deg) scale(${scale})`;
  shot.style.order=String(i*2+1);shot.style.opacity=String(calm?1:clamp(1-distance*.88));shot.style.zIndex=String(Math.round(20-distance*6));
 });
 chapters.forEach((chapter,i)=>{const delta=i-position;chapter.style.order=String(i*2);chapter.style.opacity=String(calm?1:clamp(1-Math.abs(delta)*2));chapter.style.transform=`translate3d(0,${delta*(mobile?35:75)}px,0)`});
 const active=Math.round(position);indices.forEach((element,i)=>element.classList.toggle('active',i===active));word.textContent=['SPLIT','CHECK','SETTLE'][active];word.style.transform=`translate(calc(-50% + ${-position*85}px),calc(-50% + ${progress*100}px))`;atmosphere.style.transform=`translate3d(${position*35}px,${progress*85}px,0)`;
 window.pageMotionState={reduced:calm,progress,position,chapter:active};
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);update();
})();
