import { Howl } from 'howler';

const tick = new Howl({ src: ['/sounds/wheel-tick.mp3'] });
const complete = new Howl({ src: ['/sounds/wheel-complete.mp3'] });

const SOUNDS = {
  tick,
  complete,
};

const playSound = (name: keyof typeof SOUNDS) => SOUNDS[name].play();

export default playSound;
