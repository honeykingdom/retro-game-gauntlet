import React from 'react';
import styled from '@emotion/styled';
import { useWindowSize } from 'react-use';
import { useTheme, Theme } from '@mui/material';
import { Typography, IconButton, Tooltip, AppBar } from '@mui/material';
import DarkThemeIcon from '@mui/icons-material//Brightness7';
import LightThemeIcon from '@mui/icons-material//Brightness4';
import GitHubIcon from '@mui/icons-material//GitHub';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import { optionChanged, themeSelector } from '../rollGameSlice';

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

  & > :first-of-type {
    display: none;
  }

  @media (min-width: 600px) {
    position: absolute !important;

    & > :first-of-type {
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
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const windowSize = useWindowSize();
  const mode = useAppSelector(themeSelector);

  const handleToggleTheme = () => {
    const name = 'theme';
    const value = mode === 'dark' ? 'light' : 'dark';

    analytics.ui.changeOption(name, value === 'dark' ? 1 : 0);
    dispatch(optionChanged({ name, newValue: value }));
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
              {mode === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />}
            </IconButton>
          </Tooltip>
        </Buttons>
      </HeaderInner>
    </HeaderRoot>
  );
};

export default React.memo(Header);
