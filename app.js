import {initUI} from './ui.js';
import {initAudio} from './audio.js';

initUI();
initAudio();

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
}
