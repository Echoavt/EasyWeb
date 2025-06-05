const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const instruments = [
  {name:'Kick', sound:'kick'},
  {name:'Snare', sound:'snare'},
  {name:'Hat', sound:'hat'},
  {name:'Beep', sound:'beep'}
];
const grid = document.getElementById('sequencer');
const playBtn = document.getElementById('seq-play');
const tempo = document.getElementById('seq-tempo');
let current = 0;
let playing = false;
let intervalId;

// build grid
instruments.forEach(inst => {
  const row = document.createElement('div');
  row.className = 'step-row';
  row.dataset.sound = inst.sound;
  const label = document.createElement('span');
  label.className = 'step-label';
  label.textContent = inst.name;
  row.appendChild(label);
  for(let i=0;i<16;i++){
    const step = document.createElement('div');
    step.className = 'step';
    step.dataset.step = i;
    step.addEventListener('click', ()=> step.classList.toggle('active'));
    row.appendChild(step);
  }
  grid.appendChild(row);
});

function playSound(type){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  switch(type){
    case 'kick':
      osc.frequency.setValueAtTime(150,audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60,audioCtx.currentTime+0.3);
      break;
    case 'snare':
      osc.frequency.value = 200;
      break;
    case 'hat':
      osc.type = 'square';
      osc.frequency.value = 600;
      break;
    default:
      osc.frequency.value = 400;
  }
  gain.gain.setValueAtTime(0.5,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.3);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime+0.4);
}

function step(){
  const stepTime = 60000/tempo.value/4;
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('playing'));
  document.querySelectorAll('.step-row').forEach(row=>{
    const steps = row.querySelectorAll('.step');
    const s = steps[current];
    s.classList.add('playing');
    if(s.classList.contains('active')) playSound(row.dataset.sound);
  });
  current = (current+1)%16;
  intervalId = setTimeout(step, stepTime);
}

function start(){
  if(playing) return;
  current = 0;
  playing = true;
  step();
  playBtn.textContent = 'Stop';
}
function stop(){
  playing = false;
  clearTimeout(intervalId);
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('playing'));
  playBtn.textContent = 'Play';
}
playBtn.addEventListener('click',()=>{
  if(!playing) start(); else stop();
});
tempo.addEventListener('input',()=>{
  if(playing){
    clearTimeout(intervalId);
    step();
  }
});
