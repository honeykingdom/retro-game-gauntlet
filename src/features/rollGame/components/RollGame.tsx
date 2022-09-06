import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import SpinningWheel, {
  SpinningWheelRef,
  WheelColors,
  WheelSegment,
} from 'react-spinning-canvas-wheel';
import { useWindowSize } from 'react-use';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import analytics from 'utils/analytics';
import { BREAKPOINTS, LS, PREVENT_FORWARD_PROPS } from 'utils/constants';
import playSound from 'utils/playSound';
import ArrowRightSvg from 'icons/arrow-right.svg';
import GameResult from './GameResult';
import { AppTheme, RolledGame } from '../rollGameTypes';
import {
  isRollingSelector,
  numberOfGamesSelector,
  platformsChanged,
  rollGameCompleted,
  rollGameStarted,
  secondsToSpinSelector,
  selectedPlatformsSelector,
  speedSelector,
  themeSelector,
} from '../rollGameSlice';
import { getRandomGames } from '../rollGameUtils';
import { DEFAULT_SELECTED_PLATFORMS } from '../rollGameConstants';
import { lsRead } from 'utils/ls';

const RollGameRoot = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const WheelContainer = styled.div`
  position: relative;
  display: flex;
`;
type RollButtonProps = {
  $radius: number;
  $bgColor: string;
  $textColor: string;
  $borderColor: string;
};
const RollButton = styled.button<RollButtonProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  width: ${(p) => (60 / 200) * p.$radius}px;
  height: ${(p) => (60 / 200) * p.$radius}px;
  color: ${(p) => p.$textColor};
  background-color: ${(p) => p.$bgColor};
  border: 4px solid ${(p) => p.$borderColor};
  border-radius: 50%;
  font-size: ${(p) => (14 / 200) * p.$radius}px;
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
  $bgColor: string;
  $borderColor: string;
};
const ArrowRightIcon = styled(
  ArrowRightSvg,
  PREVENT_FORWARD_PROPS,
)<ArrowRightIconProps>`
  position: absolute;
  top: 50%;
  left: 1px;
  width: 32px;
  height: 32px;
  transform: translateY(-50%);
  fill: ${(p) => p.$bgColor};
  stroke: ${(p) => p.$borderColor};
`;

const WHEEL_COLORS: Record<AppTheme, WheelColors> = {
  dark: {
    wheelBackground: '#212121',
    text: '#fff',
    border: '#fff',
  },
  light: {
    wheelBackground: '#fff',
    text: 'rgba(0, 0, 0, 0.87)',
    border: '#424242',
  },
};

const getSegmentBgColor = (theme: AppTheme, i: number) => {
  if (theme === 'dark') {
    return i % 2 === 0 ? '#2f2f2f' : '#212121';
  }
  return i % 2 === 0 ? '#f4f4f4' : '#fff';
};

const getWheelSegments = (rolledGames: RolledGame[], theme: AppTheme) =>
  rolledGames.map<WheelSegment>(({ name }, i) => ({
    title: name,
    backgroundColor: getSegmentBgColor(theme, i),
  }));

type Props = {
  className?: string;
};

const RollGame = ({ className }: Props) => {
  const dispatch = useAppDispatch();

  const [radius, setRadius] = useState(300);
  const [rolledGames, setRolledGames] = useState<RolledGame[]>([]);

  const mode = useAppSelector(themeSelector);
  const isRolling = useAppSelector(isRollingSelector);
  const selectedPlatforms = useAppSelector(selectedPlatformsSelector);
  const numberOfGames = useAppSelector(numberOfGamesSelector);
  const secondsToSpin = useAppSelector(secondsToSpinSelector);
  const speed = useAppSelector(speedSelector);

  const windowSize = useWindowSize();

  const spinningWheelRef = useRef<SpinningWheelRef>(null);

  useEffect(() => {
    if (windowSize.width < BREAKPOINTS.sm) {
      setRadius(140);
    } else if (windowSize.width < BREAKPOINTS.xl) {
      setRadius(200);
    } else {
      setRadius(300);
    }
  }, [windowSize.width]);

  useEffect(() => {
    const lsPlatforms = lsRead(LS.Platforms);
    let platforms = DEFAULT_SELECTED_PLATFORMS;
    if (Array.isArray(lsPlatforms)) {
      if (lsPlatforms.length > 0) platforms = lsPlatforms;
      dispatch(platformsChanged(lsPlatforms));
    }
    setRolledGames(getRandomGames(platforms, numberOfGames));
  }, []);

  const handleRollClick = () => {
    const games = getRandomGames(selectedPlatforms, numberOfGames);
    setRolledGames(games);
    spinningWheelRef.current?.startSpinning(secondsToSpin, speed);
  };

  const handleSegmentChange = () => {
    playSound('tick');
  };

  const handleSpinStart = () => {
    dispatch(rollGameStarted());
    analytics.rollGame.start();
  };

  const handleSpinEnd = (id?: number) => {
    dispatch(rollGameCompleted(rolledGames[id!]));
    playSound('complete');
    analytics.rollGame.complete();
  };

  const wheelSegments = useMemo(
    () => getWheelSegments(rolledGames, mode),
    [rolledGames, mode],
  );

  const isRollButtonDisabled = isRolling || !selectedPlatforms.length;

  const colors = WHEEL_COLORS[mode];

  return (
    <RollGameRoot className={className}>
      <WheelContainer>
        <SpinningWheel
          size={radius * 2}
          segments={wheelSegments}
          wheelColors={colors}
          // TODO: fix this
          // @ts-expect-error
          spinningWheelRef={spinningWheelRef}
          onSegmentChange={handleSegmentChange}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
        />
        <RollButton
          onClick={handleRollClick}
          disabled={isRollButtonDisabled}
          $bgColor={mode === 'dark' ? '#424242' : 'fff'}
          $borderColor={colors.border}
          $radius={radius}
          $textColor={colors.text}
        >
          Roll
        </RollButton>
        <ArrowRightIcon
          $bgColor={colors.wheelBackground}
          $borderColor={colors.border}
        />
      </WheelContainer>
      <GameResult />
    </RollGameRoot>
  );
};

export default RollGame;
