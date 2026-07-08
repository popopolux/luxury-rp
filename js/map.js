
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
