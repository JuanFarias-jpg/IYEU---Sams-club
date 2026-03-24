/* SAM'S CLUB REDESIGN — JS */
document.addEventListener('DOMContentLoaded',()=>{
  initTheme(); initHeader(); initMicro(); initA11y(); initOnboard(); initToasts(); initCarousels();
});

/* === THEME === */
function initTheme(){
  const s=localStorage.getItem('sams-theme');
  if(s) document.documentElement.setAttribute('data-theme',s);
  else if(matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.setAttribute('data-theme','dark');
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change',e=>{
    if(!localStorage.getItem('sams-theme')) document.documentElement.setAttribute('data-theme',e.matches?'dark':'light');
  });
}
function toggleTheme(){
  const c=document.documentElement.getAttribute('data-theme');
  const n=c==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',n);
  localStorage.setItem('sams-theme',n);
  document.querySelectorAll('[data-tog="theme"]').forEach(el=>el.classList.toggle('on',n==='dark'));
  showToast(n==='dark'?'🌙 Modo oscuro activado':'☀️ Modo claro activado');
}

/* === HEADER === */
function initHeader(){
  const h=document.querySelector('.header');
  if(!h) return;
  window.addEventListener('scroll',()=>{
    h.classList.toggle('scrolled',scrollY>50);
  },{passive:true});
}

/* === MICROINTERACTIONS === */
function initMicro(){
  // Ripple on add buttons
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.add-btn');
    if(!btn) return;
    const r=btn.getBoundingClientRect();
    btn.style.setProperty('--rx',((e.clientX-r.left)/r.width*100)+'%');
    btn.style.setProperty('--ry',((e.clientY-r.top)/r.height*100)+'%');
    btn.classList.add('ripple');
    setTimeout(()=>btn.classList.remove('ripple'),500);
  });

  // Add to cart
  document.addEventListener('click',e=>{
    const btn=e.target.closest('.add-btn');
    if(!btn||btn.classList.contains('added')) return;
    const orig=btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#fff" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg> Agregado';
    const badge=document.querySelector('.cart-badge');
    if(badge){ badge.textContent=+badge.textContent+1; badge.classList.remove('bounce'); void badge.offsetWidth; badge.classList.add('bounce'); }
    showToast('✓ Producto agregado al carrito','ok');
    setTimeout(()=>{ btn.classList.remove('added'); btn.innerHTML=orig; },2200);
  });

  // Wishlist
  document.addEventListener('click',e=>{
    const w=e.target.closest('.product-card__wish');
    if(!w) return;
    e.preventDefault(); e.stopPropagation();
    w.classList.toggle('active');
    w.style.transform='scale(1.3)';
    setTimeout(()=>w.style.transform='',200);
    showToast(w.classList.contains('active')?'❤️ Agregado a tu lista':'Removido de tu lista');
  });

  // Staggered entrance
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((en,i)=>{
      if(en.isIntersecting){
        setTimeout(()=>{ en.target.style.opacity='1'; en.target.style.transform='translateY(0)'; },i*60);
        obs.unobserve(en.target);
      }
    });
  },{threshold:.08});
  document.querySelectorAll('.product-card,.banner-sm,.promo-banner').forEach(el=>{
    el.style.opacity='0'; el.style.transform='translateY(16px)';
    el.style.transition='opacity .45s ease, transform .45s ease';
    obs.observe(el);
  });
}

/* === ACCESSIBILITY === */
function initA11y(){
  ['font-scale','contrast','grayscale','spacing'].forEach(k=>{
    const v=localStorage.getItem('sams-'+k);
    if(v){
      if(k==='font-scale') document.documentElement.setAttribute('data-font-scale',v);
      if(k==='contrast') document.documentElement.setAttribute('data-contrast',v);
      if(k==='grayscale') document.documentElement.setAttribute('data-grayscale',v);
      if(k==='spacing') document.documentElement.setAttribute('data-spacing',v);
    }
  });
  const r=document.querySelector('#font-range');
  if(r){ r.value=localStorage.getItem('sams-font-scale')||'100'; }
}
function toggleA11y(){
  const panel = document.querySelector('.a11y-panel');
  const fab = document.querySelector('.a11y-fab');
  const overlay = document.querySelector('.overlay');
  panel?.classList.toggle('open');
  overlay?.classList.toggle('on');
  // Hide FAB when panel is open, show when closed
  if(fab) fab.classList.toggle('hidden', panel?.classList.contains('open'));
}
function updateFont(v){
  document.documentElement.setAttribute('data-font-scale',v);
  localStorage.setItem('sams-font-scale',v);
  const d=document.querySelector('#font-val');
  if(d) d.textContent=v+'%';
}
function toggleContrast(){
  const c=document.documentElement.getAttribute('data-contrast')==='high'?'':'high';
  document.documentElement.setAttribute('data-contrast',c);
  localStorage.setItem('sams-contrast',c||'normal');
  document.querySelectorAll('[data-tog="contrast"]').forEach(el=>el.classList.toggle('on',c==='high'));
}
function toggleGray(){
  const c=document.documentElement.getAttribute('data-grayscale')==='true'?'false':'true';
  document.documentElement.setAttribute('data-grayscale',c);
  localStorage.setItem('sams-grayscale',c);
  document.querySelectorAll('[data-tog="gray"]').forEach(el=>el.classList.toggle('on',c==='true'));
}
function setSpacing(v){
  document.documentElement.setAttribute('data-spacing',v);
  localStorage.setItem('sams-spacing',v);
}
function resetA11y(){
  ['theme','font-scale','contrast','grayscale','spacing'].forEach(k=>localStorage.removeItem('sams-'+k));
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.setAttribute('data-font-scale','100');
  document.documentElement.setAttribute('data-contrast','');
  document.documentElement.setAttribute('data-grayscale','false');
  document.documentElement.setAttribute('data-spacing','normal');
  document.querySelectorAll('.toggle').forEach(t=>t.classList.remove('on'));
  const r=document.querySelector('#font-range'); if(r) r.value=100;
  const d=document.querySelector('#font-val'); if(d) d.textContent='100%';
  showToast('✓ Configuración restablecida');
}

/* === ONBOARDING === */
let obStep=0;
function initOnboard(){
  if(!localStorage.getItem('sams-onboard'))
    setTimeout(()=>document.querySelector('.onboard-overlay')?.classList.add('on'),1200);
}
function obNext(){
  const steps=document.querySelectorAll('.onboard-step'), dots=document.querySelectorAll('.onboard-dot');
  obStep++;
  if(obStep>=steps.length){ obClose(); return; }
  steps.forEach(s=>s.classList.remove('active'));
  dots.forEach(d=>d.classList.remove('active'));
  steps[obStep].classList.add('active');
  dots[obStep].classList.add('active');
}
function obClose(){
  document.querySelector('.onboard-overlay')?.classList.remove('on');
  localStorage.setItem('sams-onboard','1');
}
function obReset(){
  localStorage.removeItem('sams-onboard');
  obStep=0;
  const s=document.querySelectorAll('.onboard-step'),d=document.querySelectorAll('.onboard-dot');
  s.forEach(x=>x.classList.remove('active'));
  d.forEach(x=>x.classList.remove('active'));
  if(s[0]) s[0].classList.add('active');
  if(d[0]) d[0].classList.add('active');
  document.querySelector('.onboard-overlay')?.classList.add('on');
}

/* === TOASTS === */
function initToasts(){
  if(!document.querySelector('.toast-wrap')){
    const c=document.createElement('div');
    c.className='toast-wrap'; c.setAttribute('role','status'); c.setAttribute('aria-live','polite');
    document.body.appendChild(c);
  }
}
function showToast(msg,type=''){
  const c=document.querySelector('.toast-wrap'); if(!c) return;
  const t=document.createElement('div');
  t.className='toast'+(type?' toast--'+type:'');
  t.textContent=msg; c.appendChild(t);
  setTimeout(()=>t.remove(),3200);
}

/* === MOBILE MENU === */
function toggleMenu(){
  document.querySelector('.mobile-menu')?.classList.toggle('open');
  document.querySelector('.overlay')?.classList.toggle('on');
}
function closePanels(){
  document.querySelector('.mobile-menu')?.classList.remove('open');
  document.querySelector('.a11y-panel')?.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('on');
}

/* ESC */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closePanels(); obClose(); }
});

/* ========== PROMO CAROUSEL (only carousel 2 — promo grid) ========== */
function initCarousels(){
  initOneCarousel('promoTrack2','promoDots2');
}

let promo2=0, promo2Timer;
function promoSlide2(dir){
  const track=document.getElementById('promoTrack2');
  if(!track) return;
  const total=track.children.length;
  promo2=(promo2+dir+total)%total;
  track.style.transform='translateX(-'+promo2*100+'%)';
  updateDots('promoDots2',promo2);
  resetAutoplay2();
}
function promoGo2(i){
  promo2=i;
  const track=document.getElementById('promoTrack2');
  if(track) track.style.transform='translateX(-'+promo2*100+'%)';
  updateDots('promoDots2',promo2);
  resetAutoplay2();
}
function resetAutoplay2(){
  clearInterval(promo2Timer);
  promo2Timer=setInterval(()=>promoSlide2(1),6000);
}

function updateDots(id,active){
  const wrap=document.getElementById(id);
  if(!wrap) return;
  wrap.querySelectorAll('.promo-carousel__dot').forEach((d,i)=>{
    d.classList.toggle('active',i===active);
  });
}

function initOneCarousel(trackId,dotsId){
  const track=document.getElementById(trackId);
  if(!track) return;

  // Touch/swipe support
  let startX=0, diff=0, dragging=false;
  track.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;dragging=true;},{passive:true});
  track.addEventListener('touchmove',e=>{
    if(!dragging) return;
    diff=e.touches[0].clientX-startX;
  },{passive:true});
  track.addEventListener('touchend',()=>{
    if(!dragging) return;
    dragging=false;
    if(Math.abs(diff)>40) promoSlide2(diff<0?1:-1);
    diff=0;
  });

  // Autoplay
  promo2Timer=setInterval(()=>promoSlide2(1),6000);
}