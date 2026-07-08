
// Luxury RP V5.0.0 — Interactive Map MDT
(function(){
  const locations=window.LUXURY_MAP_LOCATIONS||[];
  const detail=document.querySelector('[data-map-detail]');
  const markers=[...document.querySelectorAll('.map-marker[data-id]')];
  const filters=[...document.querySelectorAll('.map-filter')];
  const search=document.querySelector('[data-map-search]');
  const discord=window.LUXURY_DISCORD||'#';
  function initials(name){return name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();}
  function select(id){
    const loc=locations.find(l=>l.id===id)||locations[0]; if(!loc||!detail) return;
    markers.forEach(m=>m.classList.toggle('active',m.dataset.id===id));
    detail.querySelector('.detail-avatar').textContent=loc.icon.length<=2?loc.icon:initials(loc.name);
    detail.querySelector('.detail-top h2').textContent=loc.name;
    detail.querySelector('.detail-top p').textContent=loc.type;
    const img=detail.querySelector('.detail-image'); img.src=loc.image; img.alt=loc.name;
    detail.querySelector('.detail-desc').textContent=loc.desc;
    const dds=detail.querySelectorAll('dd');
    if(dds[0]) dds[0].textContent=loc.district;
    if(dds[1]) dds[1].textContent=loc.status;
    if(dds[2]) dds[2].textContent= loc.status==='Ouvert'?'Ouvert':'À confirmer';
    if(dds[3]) dds[3].textContent=loc.type;
    const page=detail.querySelector('[data-detail-page]'); if(page) page.href=loc.page;
    detail.classList.remove('flash'); void detail.offsetWidth; detail.classList.add('flash');
  }
  function apply(){
    const active=(document.querySelector('.map-filter.active')||{}).dataset?.filter||'all';
    const q=(search?.value||'').toLowerCase().trim();
    markers.forEach(m=>{
      const loc=locations.find(l=>l.id===m.dataset.id); if(!loc) return;
      const matchFilter=active==='all'||loc.category===active||(active==='lieux');
      const matchText=!q||[loc.name,loc.short,loc.type,loc.district,loc.catLabel].join(' ').toLowerCase().includes(q);
      m.classList.toggle('hidden',!(matchFilter&&matchText));
    });
  }
  markers.forEach(m=>m.addEventListener('click',()=>select(m.dataset.id)));
  filters.forEach(f=>f.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));f.classList.add('active');apply();}));
  if(search) search.addEventListener('input',apply);
  if(locations.length) select('luxury-motors');
})();


// Luxury RP V5.0.3 — map pan, zoom & readable blips
(function(){
  const canvas=document.querySelector('[data-pan-map]');
  if(!canvas) return;
  const viewport=canvas.querySelector('.map-viewport');
  if(!viewport) return;
  const tools=[...document.querySelectorAll('.map-tools button')];
  let scale=1, tx=0, ty=0, isDown=false, startX=0, startY=0, startTx=0, startTy=0, moved=false;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  function bounds(){
    const r=canvas.getBoundingClientRect();
    return {x:Math.max(0,(scale-1)*r.width/2), y:Math.max(0,(scale-1)*r.height/2)};
  }
  function normalize(){
    const b=bounds(); tx=clamp(tx,-b.x,b.x); ty=clamp(ty,-b.y,b.y);
  }
  function apply(){ normalize(); const markerScale=Math.max(.42, Math.min(1, 1/scale)); viewport.style.setProperty('--marker-scale', markerScale.toFixed(3)); viewport.style.setProperty('--marker-hover-scale', Math.min(1.06, markerScale*1.12).toFixed(3)); viewport.style.transform=`translate(${tx}px, ${ty}px) scale(${scale})`; }
  function zoomTo(next, cx=0, cy=0){
    const old=scale; scale=clamp(next,1,3.2);
    const ratio=scale/old;
    tx=cx-(cx-tx)*ratio; ty=cy-(cy-ty)*ratio;
    apply();
  }
  function reset(){ scale=1; tx=0; ty=0; apply(); }
  tools.forEach((btn,i)=>{
    const action=btn.dataset.mapTool || ['zoom-in','zoom-out','reset','fit','center'][i];
    btn.addEventListener('click',()=>{
      if(action==='zoom-in') zoomTo(scale+.28);
      if(action==='zoom-out') zoomTo(scale-.28);
      if(action==='reset'||action==='fit'||action==='center') reset();
    });
  });
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();
    const r=canvas.getBoundingClientRect();
    const cx=e.clientX-r.left-r.width/2, cy=e.clientY-r.top-r.height/2;
    zoomTo(scale + (e.deltaY<0 ? .18 : -.18), cx, cy);
  },{passive:false});
  canvas.addEventListener('pointerdown',e=>{
    if(e.target.closest('.map-marker,.cayo-inset,.map-tools')) return;
    isDown=true; moved=false; canvas.classList.add('dragging'); canvas.setPointerCapture(e.pointerId);
    startX=e.clientX; startY=e.clientY; startTx=tx; startTy=ty;
  });
  canvas.addEventListener('pointermove',e=>{
    if(!isDown) return;
    const dx=e.clientX-startX, dy=e.clientY-startY;
    if(Math.abs(dx)+Math.abs(dy)>3) moved=true;
    tx=startTx+dx; ty=startTy+dy; apply();
  });
  function up(e){
    if(!isDown) return;
    isDown=false; canvas.classList.remove('dragging');
    try{canvas.releasePointerCapture(e.pointerId)}catch(_e){}
  }
  canvas.addEventListener('pointerup',up); canvas.addEventListener('pointercancel',up); canvas.addEventListener('pointerleave',up);
  window.addEventListener('resize',apply);
  apply();
})();
