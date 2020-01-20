import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useWindowSize } from 'react-use';
import { useTheme, Theme } from '@material-ui/core/styles';
import { Typography, IconButton, Tooltip, AppBar } from '@material-ui/core';
import DarkThemeIcon from '@material-ui/icons/Brightness7';
import LightThemeIcon from '@material-ui/icons/Brightness4';
import GitHubIcon from '@material-ui/icons/GitHub';

import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import {
  currentThemeSelector,
  updateOption,
} from 'features/options/optionsSlice';

const HeaderRoot = styled(AppBar)<{ theme: Theme }>`
  background-color: ${(p) => p.theme.palette.background.default} !important;
  color: ${(p) => p.theme.palette.text.primary} !important;
`;
const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 100%;

  @media (min-width: ${BREAKPOINTS.lg}px) {
    width: ${BREAKPOINTS.lg}px;
  }

  @media (min-width: ${BREAKPOINTS.xl}px) {
    width: 1640px;
  }
`;
const Buttons = styled.div`
  right: 8px;

  & > :first-child {
    display: none;
  }

  @media (min-width: 600px) {
    position: absolute !important;

    & > :first-child {
      display: inline-flex;
    }
  }

  @media (min-width: ${BREAKPOINTS.lg}px) {
    right: 0;
  }
`;

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const windowSize = useWindowSize();
  const currentTheme = useSelector(currentThemeSelector);

  const handleToggleTheme = () => {
    const name = 'currentTheme';
    const value = currentTheme === 'dark' ? 'light' : 'dark';

    analytics.event.ui.changeOption(name, value === 'dark' ? 1 : 0);
    dispatch(updateOption({ name, value }));
  };

  return (
    <HeaderRoot className={className} position="static" theme={theme}>
      <HeaderInner>
        <Typography variant={windowSize.width < BREAKPOINTS.sm ? 'h5' : 'h4'}>
          Retro Game Gauntlet
        </Typography>
        <Buttons>
          <Tooltip title="GitHub Repository">
            <IconButton
              color="inherit"
              href="//github.com/honeykingdom/rgg/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle dark/light theme">
            <IconButton color="inherit" onClick={handleToggleTheme}>
              {currentTheme === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />}
            </IconButton>
          </Tooltip>
        </Buttons>
      </HeaderInner>
    </HeaderRoot>
  );
};

export default React.memo(Header);
