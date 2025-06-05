// Inicializace Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillators = [];
let masterGain = audioCtx.createGain();
let filter = audioCtx.createBiquadFilter();
let analyser = audioCtx.createAnalyser();
masterGain.connect(filter);
filter.connect(analyser);
analyser.connect(audioCtx.destination);

const oscSettings = document.querySelectorAll('fieldset');

function createOscillator(wave='sine',freq=440,amp=0.5){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    gain.gain.value = amp;
    osc.connect(gain).connect(masterGain);
    return {osc,gain};
}

function startAudio(){
    if(oscillators.length) return;
    oscSettings.forEach(fs=>{
        const enabled = fs.querySelector('.osc-enable').checked;
        if(!enabled) return;
        const wave = fs.querySelector('.waveform').value;
        const freq = fs.querySelector('.frequency').value;
        const amp = fs.querySelector('.amplitude').value;
        const {osc,gain} = createOscillator(wave,freq,amp);
        osc.start();
        oscillators.push({osc,gain,fs});
    });
    draw();
}

function stopAudio(){
    oscillators.forEach(o=>o.osc.stop());
    oscillators=[];
    cancelAnimationFrame(drawId);
}

// Update parameters
oscSettings.forEach(fs=>{
    fs.addEventListener('input',e=>{
        const index = Array.from(oscSettings).indexOf(fs);
        const oscData = oscillators[index];
        if(!oscData) return;
        oscData.osc.type = fs.querySelector('.waveform').value;
        oscData.osc.frequency.value = fs.querySelector('.frequency').value;
        oscData.gain.gain.value = fs.querySelector('.amplitude').value;
    });
});

// Filter controls
const filterType = document.getElementById('filterType');
const filterFreq = document.getElementById('filterFreq');
const filterQ = document.getElementById('filterQ');
filter.type = filterType.value;
filter.frequency.value = filterFreq.value;
filter.Q.value = filterQ.value;

filterType.addEventListener('change',()=>filter.type=filterType.value);
filterFreq.addEventListener('input',()=>filter.frequency.value=filterFreq.value);
filterQ.addEventListener('input',()=>filter.Q.value=filterQ.value);

// Play button
const toggleBtn = document.getElementById('toggleSound');
let playing = false;
toggleBtn.addEventListener('click',()=>{
    if(!playing){
        startAudio();
        toggleBtn.textContent = l10n.playStop[currentLang];
    }else{
        stopAudio();
        toggleBtn.textContent = l10n.play[currentLang];
    }
    playing = !playing;
});

// Canvas visualization
const oscCanvas = document.getElementById('oscilloscope');
const ctx = oscCanvas.getContext('2d');
const specCanvas = document.getElementById('spectrum');
const sctx = specCanvas.getContext('2d');
let drawId;

function draw(){
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,oscCanvas.width,oscCanvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'lime';
    ctx.beginPath();
    const slice = oscCanvas.width / bufferLength;
    let x=0;
    for(let i=0;i<bufferLength;i++){
        const v = dataArray[i]/128.0;
        const y = v*oscCanvas.height/2;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        x+=slice;
    }
    ctx.stroke();

    analyser.getByteFrequencyData(dataArray);
    sctx.fillStyle='black';
    sctx.fillRect(0,0,specCanvas.width,specCanvas.height);
    const barWidth = (specCanvas.width/bufferLength)*2.5;
    let barHeight;
    let x2=0;
    for(let i=0;i<bufferLength;i++){
        barHeight = dataArray[i];
        sctx.fillStyle=`hsl(${i/bufferLength*180},100%,50%)`;
        sctx.fillRect(x2,specCanvas.height-barHeight/2,barWidth,barHeight/2);
        x2+=barWidth+1;
    }
    drawId = requestAnimationFrame(draw);
}

// light/dark toggle
const themeToggle = document.getElementById('theme-toggle');
const themeColor = document.getElementById('theme-color');
function handleLightDarkToggle(){
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    themeColor.setAttribute('content', dark?'#1f2937':'#ffffff');
}
themeToggle.addEventListener('click', handleLightDarkToggle);

// i18n setup
const l10n = {
    play:{cs:'Spustit zvuk',en:'Play'},
    playStop:{cs:'Zastavit zvuk',en:'Stop'},
    title:{cs:'Akustický Inovativní Simulátor',en:'Acoustic Innovative Simulator'},
    subtitle:{cs:'Objev svět vlnění a frekvencí',en:'Discover the world of waves'},
    start:{cs:'Začít simulaci',en:'Start simulation'},
    simTitle:{cs:'Simulátor',en:'Simulator'},
    gallery:{cs:'Galerie zvuků',en:'Sound Gallery'},
    contact:{cs:'Kontakt',en:'Contact'},
    help:{cs:'Nápověda',en:'Help'},
    helpText:{cs:'Základní pokyny...',en:'Basic instructions...'},
    autoTune:{cs:'Automatické ladění',en:'Auto tune'},
    send:{cs:'Odeslat',en:'Send'},
    seqLink:{cs:'Sekvencer',en:'Sequencer'}
};
let currentLang='cs';
const langSelect=document.getElementById('lang-select');
langSelect.addEventListener('change',()=>{currentLang=langSelect.value;applyLang();});
function applyLang(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key=el.getAttribute('data-i18n');
        if(l10n[key]) el.textContent=l10n[key][currentLang];
    });
    toggleBtn.textContent=playing?l10n.playStop[currentLang]:l10n.play[currentLang];
}
applyLang();

// Tutorial modal logic
const tutorial=document.getElementById('tutorial');
const closeTut=document.getElementById('closeTutorial');
if(!localStorage.getItem('noTutorial')) tutorial.classList.remove('hidden');
closeTut.addEventListener('click',()=>{tutorial.classList.add('hidden');if(document.getElementById('noTutorial').checked)localStorage.setItem('noTutorial','1');});

// Accessibility helpers
document.querySelectorAll('input,select,button').forEach(el=>{if(!el.hasAttribute('tabindex'))el.tabIndex=0;});

// simple toast
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}

// Start button scroll
document.getElementById('startBtn').addEventListener('click',()=>{document.getElementById('simulator').scrollIntoView({behavior:'smooth'});});

// Preloader
window.addEventListener('load',()=>{
    document.getElementById('preloader').style.display='none';
    document.querySelector('.hero').classList.add('loaded');
});
