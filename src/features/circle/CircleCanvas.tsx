import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import * as colors from '@material-ui/core/colors';

import analytics from 'utils/analytics';
import {
  rollGameComplete,
  rollGameStart,
  updateRolledGames,
  isRollingSelector,
} from 'features/rollGame/rollGameSlice';
import useDrawCircle from 'features/circle/useDrawCircle';
import { selectedPlatformIdsSelector } from 'features/options/optionsSlice';

import { ReactComponent as ArrowRightSvg } from 'icons/arrow-right.svg';

type CircleCanvasRootProps = {
  width: number;
  height: number;
};
const CircleCanvasRoot = styled.div<CircleCanvasRootProps>`
  position: relative;
  align-self: center;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
`;
const Canvas = styled.canvas`
  display: block;
  width: ${(p) => p.width}px;
  height: ${(p) => p.height}px;
`;
const RollButton = styled.button<{ radius: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  width: ${(p) => (60 / 200) * p.radius}px;
  height: ${(p) => (60 / 200) * p.radius}px;
  color: #fff;
  background-color: ${colors.grey[800]};
  border: 4px solid #fff;
  border-radius: 50%;
  font-size: ${(p) => (14 / 200) * p.radius}px;
  text-transform: uppercase;
  outline: none;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition-property: color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &[disabled] {
    color: ${colors.grey[800]};
    pointer-events: none;
  }
`;
const ArrowRightIcon = styled(ArrowRightSvg)`
  position: absolute;
  top: 50%;
  left: 1px;
  width: 32px;
  height: 32px;
  transform: translateY(-50%);
`;

const CircleCanvas = () => {
  const dispatch = useDispatch();
  const [radius, setRadius] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRolling = useSelector(isRollingSelector);
  const selectedPlatformIds = useSelector(selectedPlatformIdsSelector);
  const windowSize = useWindowSize();

  const size = radius * 2;

  const isRollButtonDisabled = isRolling || !selectedPlatformIds.length;

  useEffect(() => {
    const handleResize = () => {
      if (windowSize.width < 450) {
        setRadius(140);
      } else if (windowSize.width < 1840) {
        setRadius(200);
      } else {
        setRadius(300);
      }
    };

    handleResize();
  }, [setRadius, windowSize.width]);

  const handleRollStart = () => {
    dispatch(updateRolledGames());
    dispatch(rollGameStart());
    analytics.event.rollGame.start();
  };

  const handleRollComplete = (id: number) => {
    dispatch(rollGameComplete(id));
    analytics.event.rollGame.complete();
  };

  useDrawCircle({
    canvasRef,
    radius,
    onRollComplete: handleRollComplete,
  });

  return (
    <CircleCanvasRoot width={size} height={size}>
      <Canvas width={size} height={size} ref={canvasRef} />
      <RollButton
        disabled={isRollButtonDisabled}
        radius={radius}
        onClick={handleRollStart}
      >
        Roll
      </RollButton>
      <ArrowRightIcon />
    </CircleCanvasRoot>
  );
};

export default CircleCanvas;
