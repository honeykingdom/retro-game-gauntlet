import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ThemeProvider, Box } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import * as colors from '@material-ui/core/colors';

import GlobalStyles from 'styles';
import { BREAKPOINTS } from 'utils/constants';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Footer from 'components/Footer';
import Platforms from 'features/platforms/Platforms';
import Options from 'features/options/Options';
import GameLinks from 'features/rollGame/GameLinks';
import RollGame from 'features/rollGame/RollGame';
import { currentThemeSelector } from 'features/options/optionsSlice';
import { AppTheme } from 'features/options/optionsTypes';

const themes: Record<string, ThemeOptions> = {
  dark: {
    palette: {
      type: 'dark',
      primary: colors.grey,
      background: {
        paper: colors.grey[900],
        default: colors.grey[800],
      },
    },
  },
  light: {
    palette: {
      type: 'light',
      primary: colors.grey,
    },
  },
};

const AppRoot = styled(Box)`
  display: grid;
  min-height: 100vh;
  grid-template-rows: 48px 24px auto 24px auto 24px auto 24px 200px;
  grid-template-columns: 16px auto 16px;
  grid-template-areas:
    'header header header'
    '.      .      .     '
    '.      main   .     '
    '.      .      .     '
    '.      side-r .     '
    '.      .      .     '
    '.      side-l .     '
    '.      .      .     '
    'footer footer footer';

  @media (min-width: ${BREAKPOINTS.md}px) {
    grid-template-rows: 48px 24px auto 24px auto 24px 48px;
    grid-template-columns: 32px 1fr 24px 1fr 32px;
    grid-template-areas:
      'header header header header header'
      '.      .      .      .      .     '
      '.      main   main   main   .     '
      '.      .      .      .      .     '
      '.      side-l .      side-r .     '
      '.      .      .      .      .     '
      'footer footer footer footer footer';
  }

  @media (min-width: ${BREAKPOINTS.lg}px) {
    grid-template-rows: 48px 16px auto 16px 48px;
    grid-template-columns: auto 340px 16px 400px 16px 340px auto;
    grid-template-areas:
      'header header header header header header header'
      '.      .      .      .      .      .      .     '
      '.      side-l .      main   .      side-r .     '
      '.      .      .      .      .      .      .     '
      'footer footer footer footer footer footer footer';
  }

  @media (min-width: ${BREAKPOINTS.xl}px) {
    grid-template-rows: 64px 40px auto 40px 64px;
    grid-template-columns: auto 360px 40px 840px 40px 360px auto;
  }
`;
const StyledHeader = styled(Header)`
  grid-area: header;
`;
const StyledSidebarLeft = styled(Sidebar)`
  grid-area: side-l;
`;
const StyledSidebarRight = styled(Sidebar)`
  grid-area: side-r;
`;
const StyledRollGame = styled(RollGame)`
  grid-area: main;
`;
const StyledFooter = styled(Footer)`
  grid-area: footer;
`;

const getTheme = (theme: AppTheme) => createMuiTheme(themes[theme]);

const App: React.FC = () => {
  const currentTheme = useSelector(currentThemeSelector);
  const [theme, setTheme] = useState(() => getTheme(currentTheme));

  useEffect(() => {
    setTheme(getTheme(currentTheme));
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <AppRoot bgcolor="background.paper" color="text.primary">
        <StyledHeader />
        <StyledSidebarLeft>
          <Platforms />
        </StyledSidebarLeft>
        <StyledSidebarRight>
          <Options />
          <GameLinks />
        </StyledSidebarRight>
        <StyledRollGame />
        <StyledFooter />
      </AppRoot>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default App;
