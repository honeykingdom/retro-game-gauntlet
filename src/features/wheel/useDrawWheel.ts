import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import timingFunction from 'utils/timingFunction';
import { GLOBAL_FONT } from 'utils/constants';
import sliceTextByMaxWidth from 'features/wheel/sliceTextByMaxWidth';
import drawWheel from 'features/wheel/drawWheel';
import {
  isRollingSelector,
  rolledGamesSelector,
} from 'features/rollGame/rollGameSlice';
import { RolledGame } from 'features/rollGame/rollGameTypes';
import {
  secondsToSpinSelector,
  speedSelector,
} from 'features/options/optionsSlice';
import useSoundsList from 'features/wheel/useSoundsList';
import { WheelColors } from 'features/wheel/WheelCanvas';

const wheelSoundTicks = [
  document.getElementById('wheel-sound-tick-1'),
  document.getElementById('wheel-sound-tick-2'),
  document.getElementById('wheel-sound-tick-3'),
] as HTMLAudioElement[];

const wheelSoundComplete = document.getElementById(
  'wheel-sound-complete',
) as HTMLAudioElement;

type OnRollComplete = (id: number) => void;

type Options = {
  radius: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wheelColors: WheelColors;
  onRollComplete: OnRollComplete;
};

export type DrawState = {
  context: CanvasRenderingContext2D | null | undefined;
  segments: RolledGame[];
  radius: number;
  wheelColors: WheelColors;
  textFont: string;
  // full canvas rotation angle
  rotationAngle: number;
  segmentAngle: number;
  scale: number;
};

type State = {
  // requestAnimationFrame id
  requestId: number | null;
  // previous time in the animate function
  prevTime: number | null;
  // time from the start of the animation
  fullTime: number;
  // current segment
  currentIndex: number;
  secondsToSpin: number;
  speed: number;
  start: Function;
  stop: Function;
  onRollComplete: OnRollComplete;
};

const normalizeSegments = (
  segments: RolledGame[],
  textFont: string,
  maxTextWidth: number,
): RolledGame[] =>
  segments.map(({ name, ...rest }) => ({
    name: sliceTextByMaxWidth(name, textFont, maxTextWidth),
    ...rest,
  }));

const getGameIndexByAngle = ({ rotationAngle, segmentAngle }: DrawState) => {
  const normalizedAngle =
    Math.abs((rotationAngle % (Math.PI * 2)) - Math.PI * 2) + Math.PI;

  return Math.floor((normalizedAngle % (Math.PI * 2)) / segmentAngle);
};

const getDevicePixelRatio = () => window.devicePixelRatio || 1;

const getTextFont = (radius: number) =>
  `${(12 / 200) * radius}px ${GLOBAL_FONT}`;

const getSegmentAngle = (segmentsCount: number) =>
  (2 * Math.PI) / segmentsCount;

const getInitialState = (
  secondsToSpin: number,
  speed: number,
  onRollComplete: OnRollComplete,
): State => ({
  requestId: null,
  prevTime: null,
  fullTime: 0,
  currentIndex: 0,
  secondsToSpin,
  speed,
  start: () => null,
  stop: () => null,
  onRollComplete,
});

const getInitialDrawState = (
  segments: RolledGame[],
  wheelColors: WheelColors,
  radius: number,
): DrawState => ({
  context: null,
  segments,
  radius,
  wheelColors,
  textFont: getTextFont(radius),
  rotationAngle: 0,
  segmentAngle: getSegmentAngle(segments.length),
  scale: getDevicePixelRatio(),
});

const useDrawCircle = ({
  radius,
  canvasRef,
  wheelColors,
  onRollComplete,
}: Options) => {
  const isRolling = useSelector(isRollingSelector);
  const secondsToSpin = useSelector(secondsToSpinSelector);
  const speed = useSelector(speedSelector);
  const rolledGames = useSelector(rolledGamesSelector);

  const playTick = useSoundsList(wheelSoundTicks);

  const stateRef = useRef<State>();
  const drawStateRef = useRef<DrawState>();

  // initialize state
  if (!stateRef.current) {
    stateRef.current = getInitialState(secondsToSpin, speed, onRollComplete);
  }

  // initialize draw state
  if (!drawStateRef.current) {
    drawStateRef.current = getInitialDrawState(
      rolledGames,
      wheelColors,
      radius,
    );
  }

  // this object links never changes
  const state = stateRef.current;
  const drawState = drawStateRef.current;

  useEffect(() => {
    drawState.context = canvasRef.current?.getContext('2d');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawState, canvasRef, canvasRef.current]);

  useEffect(() => {
    const textMaxWidth = (135 / 200) * drawState.radius;

    drawState.segments = normalizeSegments(
      rolledGames,
      drawState.textFont,
      textMaxWidth,
    );
    drawState.segmentAngle = getSegmentAngle(rolledGames.length);

    if (state.requestId === null) {
      window.requestAnimationFrame(() => drawWheel(drawState));
    }
  }, [state, drawState, rolledGames]);

  useEffect(() => {
    drawState.wheelColors = wheelColors;
    drawState.radius = radius;
    drawState.textFont = getTextFont(radius);

    if (state.requestId === null) {
      window.requestAnimationFrame(() => drawWheel(drawState));
    }
  }, [state, drawState, wheelColors, radius]);

  useEffect(() => {
    state.onRollComplete = onRollComplete;
  }, [state, onRollComplete]);

  useEffect(() => {
    const handleResize = () => {
      drawState.scale = getDevicePixelRatio();
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [drawState]);

  // TODO: optimize this effect
  useEffect(() => {
    if (!canvasRef.current) return;

    /* eslint-disable no-param-reassign */
    canvasRef.current.width = radius * 2 * drawState.scale;
    canvasRef.current.height = radius * 2 * drawState.scale;
    /* eslint-enable no-param-reassign */

    if (state.requestId === null) {
      window.requestAnimationFrame(() => drawWheel(drawState));
    }
  }, [canvasRef, state, drawState, drawState.scale, radius]);

  useEffect(() => {
    const stop = () => {
      if (!state.requestId) return;

      window.cancelAnimationFrame(state.requestId);
      state.requestId = null;
    };

    const animate = (time: number) => {
      // first draw
      if (state.prevTime === null) {
        state.currentIndex = getGameIndexByAngle(drawState);
        state.prevTime = time;
      }

      const deltaTime = time - state.prevTime;

      state.prevTime = time;
      state.fullTime += deltaTime;

      if (state.fullTime > state.secondsToSpin * 1000) {
        state.onRollComplete(state.currentIndex);
        wheelSoundComplete.play();
        stop();

        return;
      }

      const currentIndex = getGameIndexByAngle(drawState);

      if (state.currentIndex !== currentIndex) {
        playTick();
        state.currentIndex = currentIndex;
      }

      // NOTE: in "variableI" letter "I" means UnitInterval - [0, 1)

      const timeI = state.fullTime / (state.secondsToSpin * 1000);
      const speedI = timingFunction(timeI);
      const deltaAngle = ((2 * Math.PI) / 360) * speedI * state.speed;

      drawState.rotationAngle += deltaAngle;

      drawWheel(drawState);

      state.requestId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (drawState.context) {
        // reset transform
        drawState.context.setTransform(1, 0, 0, 1, 0, 0);
      }

      drawState.rotationAngle = 0;
      state.currentIndex = 0;
      state.prevTime = null;
      state.fullTime = 0;
      state.requestId = window.requestAnimationFrame(animate);
    };

    state.start = start;
    state.stop = stop;

    // eslint-disable-next-line consistent-return
    return () => stop();
  }, [state, drawState, playTick]);

  useEffect(() => {
    if (isRolling) {
      state.start();
    }
  }, [state, isRolling]);
};

export default useDrawCircle;
