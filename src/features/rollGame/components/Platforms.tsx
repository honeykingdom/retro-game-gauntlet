import React, { useState } from 'react';
import { Typography, List, Button, Box, ListItem, styled } from '@mui/material';
import { css } from '@emotion/react';
import Scrollbar from 'react-scrollbars-custom';
import { useWindowSize } from 'react-use';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import platforms from 'data/platforms.json';
import Platform from './Platform';
import {
  isRollingSelector,
  platformsChanged,
  selectedPlatformsSelector,
} from '../rollGameSlice';

const PlatformsRoot = styled('div')`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const PlatformsList = styled('div')<{ isDisabled: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
const Buttons = styled(Box)`
  margin-left: 1px;
  color: ${(p) => p.theme.palette.text.secondary};
`;

const Platforms = () => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const isRolling = useAppSelector(isRollingSelector);
  const selectedPlatforms = useAppSelector(selectedPlatformsSelector);

  const windowSize = useWindowSize();

  const handleToggleIsVisible = () => {
    setIsVisible(!isVisible);
    analytics.ui.platforms(!isVisible);
  };

  const handleNameClick = (id: string) => {
    dispatch(platformsChanged([id]));
    analytics.platforms.platformNameClick(id);
  };

  const handleCheckboxClick = (id: string) => {
    const newSelectedPlatforms = selectedPlatforms.includes(id)
      ? selectedPlatforms.filter((platformId) => platformId !== id)
      : [...selectedPlatforms, id];

    dispatch(platformsChanged(newSelectedPlatforms));
    analytics.platforms.platformCheckboxClick(id);
  };

  const handleSelectAll = () => {
    dispatch(platformsChanged(platforms.map(({ id }) => id)));
    analytics.platforms.selectAll();
  };

  const handleSelectNone = () => {
    dispatch(platformsChanged([]));
    analytics.platforms.selectNone();
  };

  const renderPlatformsList = () => (
    <PlatformsList isDisabled={isRolling}>
      <Buttons component="span" mb={1}>
        <Button
          color="inherit"
          size="small"
          startIcon={
            <CheckBoxIcon style={{ width: 24, height: 24 }} color="inherit" />
          }
          onClick={handleSelectAll}
        >
          Select All
        </Button>
        <Button
          color="inherit"
          size="small"
          startIcon={
            <CheckBoxOutlineBlankIcon
              style={{ width: 24, height: 24 }}
              color="inherit"
            />
          }
          onClick={handleSelectNone}
        >
          Select None
        </Button>
      </Buttons>
      <Scrollbar
        style={{ flexGrow: 1 }}
        native={windowSize.width < BREAKPOINTS.lg}
      >
        <List dense disablePadding>
          {platforms.map(({ id, name, releaseDate, gamesCount }) => (
            <Platform
              key={id}
              id={id}
              name={name}
              releaseDate={releaseDate}
              gamesCount={gamesCount}
              checked={selectedPlatforms.includes(id)}
              onNameClick={handleNameClick}
              onCheckboxClick={handleCheckboxClick}
            />
          ))}
        </List>
      </Scrollbar>
    </PlatformsList>
  );

  const renderCompactPlatformsList = () => (
    <Scrollbar native={windowSize.width < BREAKPOINTS.lg}>
      <List>
        {platforms
          .filter(({ id }) => selectedPlatforms.includes(id))
          .map(({ id, name }) => (
            <ListItem key={id} style={{ padding: 0, marginBottom: 8 }}>
              {name}
            </ListItem>
          ))}
      </List>
    </Scrollbar>
  );

  return (
    <PlatformsRoot>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5">Platforms</Typography>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={handleToggleIsVisible}
        >
          {isVisible ? 'Hide' : 'Change'}
        </Button>
      </Box>

      {isVisible ? renderPlatformsList() : renderCompactPlatformsList()}
    </PlatformsRoot>
  );
};

export default Platforms;
