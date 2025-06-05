const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let buffer;

const posX = document.getElementById('posX');
const posY = document.getElementById('posY');
const posZ = document.getElementById('posZ');
const posDisplay = document.getElementById('posDisplay');

async function loadSound() {
  const response = await fetch('https://cdn.jsdelivr.net/gh/mdn/webaudio-examples/panner-node/audio/hello.mp3');
  const arrayBuffer = await response.arrayBuffer();
  buffer = await audioCtx.decodeAudioData(arrayBuffer);
}

async function playSound(x, y, z) {
  if (!buffer) await loadSound();

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const panner = new PannerNode(audioCtx, {
    panningModel: 'HRTF',
    positionX: x,
    positionY: y,
    positionZ: z
  });

  source.connect(panner).connect(audioCtx.destination);
  source.start();
}

document.getElementById('play').addEventListener('click', () => {
  const x = parseFloat(posX.value);
  const y = parseFloat(posY.value);
  const z = parseFloat(posZ.value);
  playSound(x, y, z);
});

function updateDisplay() {
  posDisplay.textContent = `Position: (${posX.value}, ${posY.value}, ${posZ.value})`;
}

posX.addEventListener('input', updateDisplay);
posY.addEventListener('input', updateDisplay);
posZ.addEventListener('input', updateDisplay);
updateDisplay();

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
