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
