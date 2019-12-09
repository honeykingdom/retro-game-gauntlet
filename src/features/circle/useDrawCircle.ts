import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import timingFunction from 'utils/timingFunction';
import { GLOBAL_FONT } from 'utils/constants';
import sliceTextByMaxWidth from 'features/circle/sliceTextByMaxWidth';
import drawCircle from 'features/circle/drawCircle';
import {
  isRollingSelector,
  rolledGamesSelector,
} from 'features/rollGame/rollGameSlice';
import { RolledGame } from 'features/rollGame/rollGameTypes';
import {
  secondsToSpinSelector,
  speedSelector,
} from 'features/options/optionsSlice';

const getGameIndexByAngle = (angle: number, segmentsCount: number) => {
  const a = Math.abs((angle % (Math.PI * 2)) - Math.PI * 2) + Math.PI;
  const coeff = (2 * Math.PI) / segmentsCount;

  return Math.floor(a / coeff) % segmentsCount;
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

type Options = {
  radius: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onRollComplete: (id: number) => void;
};

type State = {
  // requestAnimationFrame id
  requestId: number | null;
  // previous time in the animate function
  prevTime: number | null;
  // time from the start of the animation
  incTime: number;
  // full canvas rotation angle
  incAngle: number;
  scale: number;
};

const initialState = {
  requestId: null,
  prevTime: null,
  incTime: 0,
  incAngle: 0,
  scale: -1,
};

// NOTE: in "variableI" letter "I" means UnitInterval - [0, 1)

const useDrawCircle = ({ radius, canvasRef, onRollComplete }: Options) => {
  const stateRef = useRef<State>(initialState);

  const isRolling = useSelector(isRollingSelector);
  const speed = useSelector(speedSelector);
  const secondsToSpin = useSelector(secondsToSpinSelector);
  const rolledGames = useSelector(rolledGamesSelector);

  const textFont = `${(12 / 200) * radius}px ${GLOBAL_FONT}`;
  const textMaxWidth = (135 / 200) * radius;

  const segments = normalizeSegments(rolledGames, textFont, textMaxWidth);
  const drawFunc = useMemo(() => drawCircle(segments, radius, textFont), [
    segments,
    radius,
    textFont,
  ]);

  // TODO: fix circle blinking on resize

  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;

      const dpr = window.devicePixelRatio || 1;

      const rect = canvasRef.current.getBoundingClientRect();
      const context = canvasRef.current.getContext('2d');

      if (!context) return;

      // if animation not playing update scale and redraw
      if (!stateRef.current.requestId) {
        // eslint-disable-next-line no-param-reassign
        canvasRef.current.width = rect.width * dpr;
        // eslint-disable-next-line no-param-reassign
        canvasRef.current.height = rect.height * dpr;
        context.scale(dpr, dpr);

        drawFunc(context, 0);
      }

      stateRef.current.scale = dpr;
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, stateRef, drawFunc]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    const state = stateRef.current;

    if (!context) return;

    // first initial draw
    drawFunc(context, 0);

    const stop = () => {
      if (!state.requestId) return;

      window.cancelAnimationFrame(state.requestId);

      state.incAngle = 0;
      state.prevTime = null;
      state.incTime = 0;
    };

    const animate = (time: number) => {
      if (state.prevTime === null) {
        state.prevTime = time;
      }

      const deltaTime = time - state.prevTime;
      state.prevTime = time;

      state.incTime += deltaTime;

      if (state.incTime > secondsToSpin * 1000) {
        const segmentIndex = getGameIndexByAngle(
          state.incAngle,
          segments.length,
        );

        onRollComplete(segmentIndex);
        stop();
        return;
      }

      const timeI = state.incTime / (secondsToSpin * 1000);
      const speedI = timingFunction(timeI);
      const angle = ((2 * Math.PI) / 360) * speedI * speed;

      drawFunc(context, angle);

      state.incAngle += angle;
      state.requestId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      const { scale } = stateRef.current;

      context.resetTransform();
      context.scale(scale, scale);

      state.requestId = window.requestAnimationFrame(animate);
    };

    if (isRolling) {
      start();
    }

    // eslint-disable-next-line consistent-return
    return () => stop();
  }, [
    canvasRef,
    stateRef,
    drawFunc,
    secondsToSpin,
    isRolling,
    speed,
    segments.length,
    onRollComplete,
  ]);
};

export default useDrawCircle;
