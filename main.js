// Main application script

// ==== Web Audio Synth ====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillators = [];
const masterGain = audioCtx.createGain();
const analyser = audioCtx.createAnalyser();
masterGain.connect(analyser).connect(audioCtx.destination);
const oscControls = document.querySelectorAll('#synth fieldset');
let drawId;

function createOscillator(wave='sine', freq=440, amp=0.5){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  gain.gain.value = amp;
  osc.connect(gain).connect(masterGain);
  return {osc, gain};
}
function startSynth(){
  if(oscillators.length) return;
  oscControls.forEach(fs => {
    if(!fs.querySelector('.osc-enable').checked) return;
    const {osc, gain} = createOscillator(
      fs.querySelector('.waveform').value,
      fs.querySelector('.frequency').value,
      fs.querySelector('.amplitude').value
    );
    osc.start();
    oscillators.push({osc, gain, fs});
  });
  drawScope();
}
function stopSynth(){
  oscillators.forEach(o => o.osc.stop());
  oscillators = [];
  cancelAnimationFrame(drawId);
}

oscControls.forEach(fs => {
  fs.addEventListener('input', () => {
    const i = Array.from(oscControls).indexOf(fs);
    const data = oscillators[i];
    if(!data) return;
    data.osc.type = fs.querySelector('.waveform').value;
    data.osc.frequency.value = fs.querySelector('.frequency').value;
    data.gain.gain.value = fs.querySelector('.amplitude').value;
  });
});

const oscCanvas = document.getElementById('oscilloscope');
const octx = oscCanvas.getContext('2d');
function drawScope(){
  const buffer = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(buffer);
  octx.fillStyle = '#000';
  octx.fillRect(0,0,oscCanvas.width,oscCanvas.height);
  octx.beginPath();
  const slice = oscCanvas.width / buffer.length;
  let x=0;
  for(let i=0;i<buffer.length;i++){
    const v = buffer[i]/128.0;
    const y = v*oscCanvas.height/2;
    if(i===0) octx.moveTo(x,y); else octx.lineTo(x,y);
    x += slice;
  }
  octx.strokeStyle='lime';
  octx.stroke();
  drawId = requestAnimationFrame(drawScope);
}

const toggleSound = document.getElementById('toggleSound');
let playing=false;
toggleSound?.addEventListener('click',()=>{
  if(!playing){startSynth();toggleSound.textContent='Stop';}
  else {stopSynth();toggleSound.textContent='Spustit zvuk';}
  playing=!playing;
});

// ==== Step Sequencer ====
const instruments = [
  {name:'Kick', sound:'kick'},
  {name:'Snare', sound:'snare'},
  {name:'Hat', sound:'hat'}
];
const seqGrid = document.getElementById('sequencer-grid');
const playBtn = document.getElementById('seq-play');
const tempoInput = document.getElementById('seq-tempo');
const stepInput = document.getElementById('seq-steps');
let seqPlaying=false, seqCurrent=0, seqInterval;

function buildGrid(){
  seqGrid.innerHTML='';
  instruments.forEach(inst=>{
    const row=document.createElement('div');
    row.className='step-row';
    row.dataset.sound=inst.sound;
    const label=document.createElement('span');
    label.className='step-label';
    label.textContent=inst.name;
    row.appendChild(label);
    for(let i=0;i<Number(stepInput.value);i++){
      const s=document.createElement('div');
      s.className='step';
      s.dataset.step=i;
      s.addEventListener('click',()=>s.classList.toggle('active'));
      row.appendChild(s);
    }
    seqGrid.appendChild(row);
  });
}
stepInput.addEventListener('change',buildGrid);
buildGrid();

function playSound(type){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type='triangle';
  switch(type){
    case 'kick': osc.frequency.setValueAtTime(150,audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(60,audioCtx.currentTime+0.3); break;
    case 'snare': osc.frequency.value=200; break;
    case 'hat': osc.type='square'; osc.frequency.value=600; break;
  }
  gain.gain.setValueAtTime(0.5,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.3);
  osc.connect(gain).connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime+0.4);
}

function step(){
  const stepTime=60000/tempoInput.value/4;
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('playing'));
  document.querySelectorAll('.step-row').forEach(row=>{
    const steps=row.querySelectorAll('.step');
    const s=steps[seqCurrent];
    if(s){
      s.classList.add('playing');
      if(s.classList.contains('active')) playSound(row.dataset.sound);
    }
  });
  seqCurrent=(seqCurrent+1)%Number(stepInput.value);
  seqInterval=setTimeout(step,stepTime);
}
function startSeq(){
  if(seqPlaying) return;
  seqCurrent=0;
  seqPlaying=true;
  step();
  playBtn.textContent='Stop';
}
function stopSeq(){
  seqPlaying=false;
  clearTimeout(seqInterval);
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('playing'));
  playBtn.textContent='Play';
}
playBtn?.addEventListener('click',()=>{seqPlaying?stopSeq():startSeq();});
tempoInput.addEventListener('input',()=>{if(seqPlaying){clearTimeout(seqInterval);step();}});

// ==== Soundboard ====
const samples=[
  {name:'Clap',src:'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='},
  {name:'Beep',src:'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='}
];
const sbGrid=document.getElementById('soundboard-grid');
if(sbGrid){
  samples.forEach(s=>{
    const btn=document.createElement('button');
    btn.textContent=s.name;
    btn.addEventListener('click',()=>{
      const a=new Audio(s.src);a.play();
    });
    sbGrid.appendChild(btn);
  });
}

// ==== Theme toggle ====
const themeToggle=document.getElementById('theme-toggle');
const themeColor=document.getElementById('theme-color');
function toggleTheme(){
  document.body.classList.toggle('dark');
  const dark=document.body.classList.contains('dark');
  themeColor.setAttribute('content',dark?'#1f2937':'#ffffff');
}
themeToggle?.addEventListener('click',toggleTheme);

// ==== Service Worker ====
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js');});
}
