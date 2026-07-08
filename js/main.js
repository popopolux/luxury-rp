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
