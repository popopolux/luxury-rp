
document.querySelectorAll('[data-lightbox]').forEach(img=>img.addEventListener('click',()=>{let lb=document.querySelector('.lightbox');lb.querySelector('img').src=img.src;lb.classList.add('open')}));
document.querySelector('.lightbox')?.addEventListener('click',e=>e.currentTarget.classList.remove('open'));

document.querySelectorAll('[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value=btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('[data-family]').forEach(card=>{
      card.style.display=(value==='all'||card.dataset.family===value)?'block':'none';
    });
  });
});
