import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';

import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import {
  rollGameComplete,
  rollGameStart,
  updateRolledGames,
  isRollingSelector,
} from 'features/rollGame/rollGameSlice';
import useDrawCircle from 'features/circle/useDrawCircle';
import {
  selectedPlatformIdsSelector,
  currentThemeSelector,
} from 'features/options/optionsSlice';
import { AppTheme } from 'features/options/optionsTypes';

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
type RollButtonProps = {
  radius: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
};
const RollButton = styled.button<RollButtonProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  width: ${(p) => (60 / 200) * p.radius}px;
  height: ${(p) => (60 / 200) * p.radius}px;
  color: ${(p) => p.textColor};
  background-color: ${(p) => p.bgColor};
  border: 4px solid ${(p) => p.borderColor};
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
    color: transparent;
    pointer-events: none;
  }
`;
type ArrowRightIconProps = {
  bgColor: string;
  borderColor: string;
};
// TODO: remove this after styled-components fix this
/* eslint-disable react/jsx-props-no-spreading, @typescript-eslint/no-unused-vars */
const ArrowRightSvgFiltered = ({ bgColor, borderColor, ...rest }: any) => (
  <ArrowRightSvg {...rest} />
);
const ArrowRightIcon = styled(ArrowRightSvgFiltered)<ArrowRightIconProps>`
  position: absolute;
  top: 50%;
  left: 1px;
  width: 32px;
  height: 32px;
  transform: translateY(-50%);
  fill: ${(p) => p.bgColor};
  stroke: ${(p) => p.borderColor};
`;

export type WheelColors = {
  wheelBackground: string;
  buttonBackground: string;
  text: string;
  border: string;
};

const wheelThemes: Record<AppTheme, WheelColors> = {
  dark: {
    wheelBackground: '#212121',
    buttonBackground: '#424242',
    text: '#fff',
    border: '#fff',
  },
  light: {
    wheelBackground: '#fff',
    buttonBackground: '#fff',
    text: 'rgba(0, 0, 0, 0.87)',
    border: '#424242',
  },
};

const CircleCanvas = () => {
  const dispatch = useDispatch();
  const [radius, setRadius] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRolling = useSelector(isRollingSelector);
  const selectedPlatformIds = useSelector(selectedPlatformIdsSelector);
  const windowSize = useWindowSize();
  const currentTheme = useSelector(currentThemeSelector);
  const [wheelColors, setWheelColors] = useState(wheelThemes[currentTheme]);

  useEffect(() => {
    setWheelColors(wheelThemes[currentTheme]);
  }, [currentTheme, setWheelColors]);

  const size = radius * 2;

  const isRollButtonDisabled = isRolling || !selectedPlatformIds.length;

  useEffect(() => {
    const handleResize = () => {
      if (windowSize.width < BREAKPOINTS.sm) {
        setRadius(140);
      } else if (windowSize.width < BREAKPOINTS.xl) {
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
    wheelColors,
    onRollComplete: handleRollComplete,
  });

  return (
    <CircleCanvasRoot width={size} height={size}>
      <Canvas width={size} height={size} ref={canvasRef} />
      <RollButton
        disabled={isRollButtonDisabled}
        radius={radius}
        bgColor={wheelColors.buttonBackground}
        borderColor={wheelColors.border}
        textColor={wheelColors.text}
        onClick={handleRollStart}
      >
        Roll
      </RollButton>
      <ArrowRightIcon
        bgColor={wheelColors.wheelBackground}
        borderColor={wheelColors.border}
      />
    </CircleCanvasRoot>
  );
};

export default CircleCanvas;
