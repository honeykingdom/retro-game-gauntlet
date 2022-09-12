import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Button, Box, Typography, Slider, styled } from '@mui/material';
import debounce from 'debounce';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import analytics from 'utils/analytics';
import {
  isRollingSelector,
  numberOfGamesSelector,
  optionChanged,
  secondsToSpinSelector,
  speedSelector,
} from '../rollGameSlice';
import options from '../optionsConstants';
import { OptionName } from '../rollGameTypes';

const OptionsRoot = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
`;
const OptionsList = styled('div')<{ isDisabled: boolean }>`
  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  ${(p) =>
    p.isDisabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `};
`;

type OptionSlider = {
  type: 'slider';
  step: number;
  min: number;
  max: number;
  marks: Parameters<typeof Slider>[0]['marks'];
};
type Option = {
  id: OptionName;
  title: string;
  component: OptionSlider; // and maybe something else in the future
};

const Options = () => {
  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState(false);

  const isRolling = useAppSelector(isRollingSelector);
  const secondsToSpin = useAppSelector(secondsToSpinSelector);
  const speed = useAppSelector(speedSelector);
  const numberOfGames = useAppSelector(numberOfGamesSelector);

  const values: Record<string, number> = {
    secondsToSpin,
    speed,
    numberOfGames,
  };

  const handleToggleIsVisible = () => {
    setIsVisible(!isVisible);
    analytics.ui.options(!isVisible);
  };

  const handleOptionChange = (name: OptionName) =>
    debounce((event: any, value: number | number[]) => {
      dispatch(optionChanged({ name, newValue: value as number }));
      analytics.ui.changeOption(name, value as unknown as number);
    }, 500);

  const renderSlider = (
    { step, min, max, marks }: OptionSlider,
    value: number,
    onChange: (event: any, value: number | number[]) => void,
  ) => (
    <Slider
      defaultValue={value}
      step={step}
      min={min}
      max={max}
      marks={marks}
      valueLabelDisplay="auto"
      onChange={onChange}
    />
  );

  const renderOption = ({ id, title, component }: Option) => (
    <React.Fragment key={id}>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {renderSlider(component, values[id], handleOptionChange(id))}
    </React.Fragment>
  );

  const renderOptions = () => (
    <OptionsList isDisabled={isRolling}>
      {(options as Option[]).map(renderOption)}
    </OptionsList>
  );

  return (
    <OptionsRoot>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5">Options</Typography>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={handleToggleIsVisible}
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </Box>

      {isVisible && renderOptions()}
    </OptionsRoot>
  );
};

export default Options;
