const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let buffer;

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
  const x = parseFloat(document.getElementById('posX').value);
  const y = parseFloat(document.getElementById('posY').value);
  const z = parseFloat(document.getElementById('posZ').value);
  playSound(x, y, z);
});
