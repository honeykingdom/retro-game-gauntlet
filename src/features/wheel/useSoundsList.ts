import { useEffect, useRef, useCallback } from 'react';

const initializeIsActive = (count: number) =>
  Array.from({ length: count }, () => false);

const useSoundsList = (elems: HTMLAudioElement[]) => {
  const soundsRef = useRef(elems);
  const isActiveRef = useRef<boolean[]>();

  if (!isActiveRef.current) {
    isActiveRef.current = initializeIsActive(elems.length);
  }

  const sounds = soundsRef.current;
  const isActive = isActiveRef.current;

  useEffect(() => {
    const clearFunctions = sounds.map((audio, index) => {
      const handleEnded = () => {
        isActive[index] = false;
      };

      audio.addEventListener('ended', handleEnded);

      return () => audio.removeEventListener('ended', handleEnded);
    });

    return () => clearFunctions.forEach((func) => func());
  }, [sounds, isActive]);

  const play = useCallback(() => {
    for (let i = 0; i < sounds.length; i += 1) {
      if (!isActive[i]) {
        sounds[i].play();
        isActive[i] = true;

        return;
      }
    }
  }, [sounds, isActive]);

  return play;
};

export default useSoundsList;
