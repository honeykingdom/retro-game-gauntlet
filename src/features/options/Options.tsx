import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'debounce';
import Typography from '@material-ui/core/Typography';
import { Button, Box, Mark } from '@material-ui/core';

import analytics from 'utils/analytics';
import PrettoSlider from 'components/PrettoSlider';
import {
  secondsToSpinSelector,
  speedSelector,
  numberOfGamesSelector,
  updateOption,
  OptionName,
} from 'features/options/optionsSlice';
import { isRollingSelector } from 'features/rollGame/rollGameSlice';
import options from 'features/options/options.mock';

const OptionsRoot = styled.div`
  display: flex;
  flex-direction: column;
`;
const OptionsList = styled.div<{ isDisabled: boolean }>`
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
  marks: Mark[];
};
type Option = {
  id: OptionName;
  title: string;
  component: OptionSlider; // and maybe something else in the future
};

const Options = () => {
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(false);

  const isRolling = useSelector(isRollingSelector);
  const secondsToSpin = useSelector(secondsToSpinSelector);
  const speed = useSelector(speedSelector);
  const numberOfGames = useSelector(numberOfGamesSelector);

  const values: Record<string, number> = {
    secondsToSpin,
    speed,
    numberOfGames,
  };

  const handleToggleIsVisible = () => {
    setIsVisible(!isVisible);
    analytics.event.ui.options(!isVisible);
  };

  const handleOptionChange = (name: OptionName) =>
    debounce((event: any, value: number | number[]) => {
      dispatch(updateOption({ name, value }));
      analytics.event.ui.changeOption(name, (value as unknown) as number);
    }, 500);

  const renderSlider = (
    { step, min, max, marks }: OptionSlider,
    value: number,
    onChange: (event: any, value: number | number[]) => void,
  ) => (
    <PrettoSlider
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
          color="default"
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
