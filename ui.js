export function initUI(){
  const themeToggle=document.getElementById('theme-toggle');
  const themeColor=document.getElementById('theme-color');
  const menuBtn=document.getElementById('menu-btn');
  const nav=document.querySelector('.nav-links');
  const startBtn=document.getElementById('start-btn');

  function applyTheme(dark){
    document.documentElement.classList.toggle('dark',dark);
    themeColor?.setAttribute('content',dark?'#1f2937':'#ffffff');
    themeToggle.textContent=dark?'☀️':'🌙';
    localStorage.setItem('theme',dark?'dark':'light');
  }

  themeToggle?.addEventListener('click',()=>applyTheme(!document.documentElement.classList.contains('dark')));
  const saved=localStorage.getItem('theme')==='dark';
  if(saved) applyTheme(true);

  menuBtn?.addEventListener('click',()=>nav?.classList.toggle('open'));
  startBtn?.addEventListener('click',()=>document.getElementById('synth').scrollIntoView({behavior:'smooth'}));
}
