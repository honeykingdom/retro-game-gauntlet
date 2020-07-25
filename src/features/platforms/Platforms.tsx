import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import Scrollbar from 'react-scrollbars-custom';
import { useWindowSize } from 'react-use';
import {
  Typography,
  List,
  Button,
  Box,
  ListItem,
  useTheme,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import Platform from 'features/platforms/Platform';
import {
  selectPlatform,
  togglePlatform,
  updateOption,
  selectedPlatformIdsSelector,
} from 'features/options/optionsSlice';
import { isRollingSelector } from 'features/rollGame/rollGameSlice';

import platforms from 'data/platforms.json';

const PlatformsRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
const PlatformsList = styled.div<{ isDisabled: boolean }>`
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
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const isRolling = useSelector(isRollingSelector);
  const selectedPlatformIds = useSelector(selectedPlatformIdsSelector);

  const theme = useTheme();

  const windowSize = useWindowSize();

  const handleToggleIsVisible = () => {
    setIsVisible(!isVisible);
    analytics.event.ui.platforms(!isVisible);
  };

  const handleNameClick = useCallback(
    (id: string) => {
      dispatch(selectPlatform(id));
      analytics.event.platforms.platformNameClick(id);
    },
    [dispatch],
  );

  const handleCheckboxClick = useCallback(
    (id: string) => {
      dispatch(togglePlatform(id));
      analytics.event.platforms.platformCheckboxClick(id);
    },
    [dispatch],
  );

  const handleSelectAll = () => {
    dispatch(
      updateOption({
        name: 'selectedPlatformIds',
        value: platforms.map(({ id }) => id),
      }),
    );
    analytics.event.platforms.selectAll();
  };

  const handleSelectNone = () => {
    dispatch(
      updateOption({
        name: 'selectedPlatformIds',
        value: [],
      }),
    );
    analytics.event.platforms.selectNone();
  };

  const renderPlatformsList = () => (
    <PlatformsList isDisabled={isRolling}>
      <Buttons component="span" mb={1} theme={theme}>
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
              checked={selectedPlatformIds.includes(id)}
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
          .filter(({ id }) => selectedPlatformIds.includes(id))
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
          color="default"
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
