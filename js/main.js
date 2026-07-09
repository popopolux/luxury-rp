const lightbox = document.querySelector('.lightbox');
document.querySelectorAll('[data-lightbox]').forEach(img => {
  img.addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.querySelector('img').src = img.src;
    lightbox.classList.add('open');
  });
});
lightbox?.addEventListener('click', e => e.currentTarget.classList.remove('open'));

const mediaTrack = document.querySelector('.gallery-track');
const mediaPrev = document.querySelector('.media-prev');
const mediaNext = document.querySelector('.media-next');
const mediaCurrent = document.querySelector('#mediaCurrent');
const mediaTotal = document.querySelector('#mediaTotal');

function pad2(n){ return String(n).padStart(2,'0'); }
function updateMediaCounter(){
  if (!mediaTrack || !mediaCurrent || !mediaTotal) return;
  const total = mediaTrack.querySelectorAll('img').length;
  const maxScroll = Math.max(1, mediaTrack.scrollWidth - mediaTrack.clientWidth);
  const ratio = mediaTrack.scrollLeft / maxScroll;
  const approxIndex = Math.min(total, Math.max(1, Math.round(ratio * total) + 1));
  mediaCurrent.textContent = pad2(approxIndex);
  mediaTotal.textContent = pad2(total);
}
function mediaStep(){ return mediaTrack ? Math.max(320, mediaTrack.clientWidth * .82) : 0; }
mediaPrev?.addEventListener('click', () => mediaTrack?.scrollBy({ left: -mediaStep(), behavior:'smooth' }));
mediaNext?.addEventListener('click', () => mediaTrack?.scrollBy({ left: mediaStep(), behavior:'smooth' }));
mediaTrack?.addEventListener('scroll', () => requestAnimationFrame(updateMediaCounter));
window.addEventListener('resize', updateMediaCounter);
updateMediaCounter();


document.querySelectorAll('[data-scroll-top]').forEach(btn => {
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


// V4.5.4 — navigation retour intelligent + stockage position depuis la page principale
const LR_RETURN_KEY = 'luxuryRP_returnY';
const LR_INDEX_SCROLL_KEY = 'luxuryRP_indexScrollY';

document.querySelectorAll('a[href^="jobs/"]').forEach(link => {
  link.addEventListener('click', () => {
    sessionStorage.setItem(LR_INDEX_SCROLL_KEY, String(window.scrollY || window.pageYOffset || 0));
  });
});

document.querySelectorAll('[data-smart-return]').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const saved = sessionStorage.getItem(LR_INDEX_SCROLL_KEY);
    if (saved) sessionStorage.setItem(LR_RETURN_KEY, saved);
    window.location.href = link.getAttribute('href') || '../index.html#database';
  });
});

window.addEventListener('load', () => {
  const saved = sessionStorage.getItem(LR_RETURN_KEY);
  if (!saved) return;
  sessionStorage.removeItem(LR_RETURN_KEY);
  const y = Number(saved);
  if (Number.isFinite(y)) {
    setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 80);
  }
});


// Luxury RP V5.0.0 — shared interactions
(function(){
  const menuBtn=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('.v5-nav');
  if(menuBtn && nav){menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));}
  document.querySelectorAll('[data-scroll-top]').forEach(btn=>btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));
  document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1){const t=document.querySelector(id);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}}});});
  document.querySelectorAll('[data-smart-return]').forEach(a=>{a.addEventListener('click',e=>{if(document.referrer && document.referrer.includes(location.origin)){e.preventDefault();history.back();}})});
})();


// Luxury RP V5.0.3 — home mini-map labels + media carousel viewer
(function(){
  document.querySelectorAll('.mini-marker[data-label]').forEach(marker=>{
    marker.addEventListener('click',e=>{
      e.stopPropagation();
      document.querySelectorAll('.mini-marker.active').forEach(m=>{ if(m!==marker) m.classList.remove('active'); });
      marker.classList.toggle('active');
    });
    marker.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); marker.click(); }
    });
  });
  document.addEventListener('click',e=>{
    if(!e.target.closest('.mini-marker')) document.querySelectorAll('.mini-marker.active').forEach(m=>m.classList.remove('active'));
  });

  const carousel=document.querySelector('[data-v5-media]');
  if(!carousel) return;
  const track=carousel.querySelector('[data-v5-media-track]');
  const thumbs=[...carousel.querySelectorAll('.media-thumb')];
  const prev=carousel.querySelector('[data-v5-media-prev]');
  const next=carousel.querySelector('[data-v5-media-next]');
  const progress=carousel.querySelector('[data-v5-media-progress]');
  const count=document.getElementById('v5MediaCount');
  const viewer=document.querySelector('[data-v5-media-viewer]');
  const viewerImg=viewer?.querySelector('img');
  const viewerCap=viewer?.querySelector('figcaption');
  let activeIndex=0;
  const pad=n=>String(n).padStart(2,'0');
  function step(){return track ? Math.max(360, track.clientWidth*.82) : 0;}
  function visibleIndex(){
    if(!track || !thumbs.length) return 0;
    const max=Math.max(1, track.scrollWidth-track.clientWidth);
    return Math.min(thumbs.length-1, Math.max(0, Math.round((track.scrollLeft/max)*(thumbs.length-1))));
  }
  function update(){
    const i=visibleIndex();
    if(count) count.textContent=`${pad(i+1)} / ${pad(thumbs.length)}`;
    if(progress) progress.style.width=`${((i+1)/thumbs.length)*100}%`;
  }
  function openViewer(index){
    if(!viewer || !viewerImg || !thumbs.length) return;
    activeIndex=(index+thumbs.length)%thumbs.length;
    const img=thumbs[activeIndex].querySelector('img');
    viewerImg.src=img.src;
    viewerImg.alt=img.alt || 'Aperçu Luxury RP';
    if(viewerCap) viewerCap.textContent=thumbs[activeIndex].dataset.title || img.alt || '';
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden','false');
    document.body.classList.add('media-open');
  }
  function closeViewer(){
    if(!viewer) return;
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden','true');
    document.body.classList.remove('media-open');
  }
  function moveViewer(delta){openViewer(activeIndex+delta);}
  prev?.addEventListener('click',()=>track?.scrollBy({left:-step(),behavior:'smooth'}));
  next?.addEventListener('click',()=>track?.scrollBy({left:step(),behavior:'smooth'}));
  track?.addEventListener('scroll',()=>requestAnimationFrame(update));
  window.addEventListener('resize',update);
  thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>openViewer(i)));
  viewer?.querySelector('[data-v5-media-close]')?.addEventListener('click',closeViewer);
  viewer?.querySelector('[data-v5-viewer-prev]')?.addEventListener('click',()=>moveViewer(-1));
  viewer?.querySelector('[data-v5-viewer-next]')?.addEventListener('click',()=>moveViewer(1));
  viewer?.addEventListener('click',e=>{ if(e.target===viewer) closeViewer(); });
  document.addEventListener('keydown',e=>{
    if(!viewer?.classList.contains('open')) return;
    if(e.key==='Escape') closeViewer();
    if(e.key==='ArrowLeft') moveViewer(-1);
    if(e.key==='ArrowRight') moveViewer(1);
  });
  update();
})();


// Luxury RP V5.1.3 — Media protection / copyright notice
(function(){
  const protectedSelector = [
    'img','picture','svg','canvas','video',
    '.v5-hero','.job-hero','.hub-card','.news-item','.mini-map','.map-canvas-wrap','.map-canvas',
    '.media-thumb','[data-v5-media-viewer]','.lightbox','.entity-gallery','.cinema-row','.experience-mosaic',
    '.panel-glass','.detail-card','.detail-image','.map-teaser-card'
  ].join(',');

  let toastTimer;
  function ensureToast(){
    let toast=document.querySelector('.protected-toast');
    if(toast) return toast;
    toast=document.createElement('div');
    toast.className='protected-toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','polite');
    toast.innerHTML='<b>LR</b><span>Visuel protégé — © Luxury RP</span><em>copie directe désactivée</em>';
    document.body.appendChild(toast);
    return toast;
  }
  function showToast(){
    const toast=ensureToast();
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);
  }
  function isProtected(target){
    return !!(target && target.closest && target.closest(protectedSelector));
  }

  document.querySelectorAll('img').forEach(img=>{
    img.setAttribute('draggable','false');
    img.addEventListener('dragstart',e=>e.preventDefault());
    img.addEventListener('contextmenu',e=>{e.preventDefault();showToast();});
  });

  document.addEventListener('dragstart',e=>{
    if(isProtected(e.target)) e.preventDefault();
  }, true);

  document.addEventListener('contextmenu',e=>{
    if(!isProtected(e.target)) return;
    e.preventDefault();
    showToast();
  }, true);

  document.addEventListener('copy',e=>{
    if(isProtected(document.activeElement)){
      e.preventDefault();
      showToast();
    }
  }, true);
})();
