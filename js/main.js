
document.querySelectorAll('[data-lightbox]').forEach(img=>img.addEventListener('click',()=>{let lb=document.querySelector('.lightbox');lb.querySelector('img').src=img.src;lb.classList.add('open')}));
document.querySelector('.lightbox')?.addEventListener('click',e=>e.currentTarget.classList.remove('open'));


document.querySelectorAll('[data-filter][data-scope]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const value = btn.dataset.filter;
    const scope = btn.dataset.scope;
    const grid = document.querySelector(`[data-grid="${scope}"]`);
    if(!grid) return;
    document.querySelectorAll(`[data-scope="${scope}"]`).forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    grid.querySelectorAll('[data-family]').forEach(card=>{
      card.classList.toggle('is-hidden', !(value==='all' || card.dataset.family===value));
    });
  });
});

