
document.querySelectorAll('[data-lightbox]').forEach(img=>img.addEventListener('click',()=>{let lb=document.querySelector('.lightbox');lb.querySelector('img').src=img.src;lb.classList.add('open')}));
document.querySelector('.lightbox')?.addEventListener('click',e=>e.currentTarget.classList.remove('open'));
