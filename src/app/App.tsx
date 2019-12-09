import React from 'react';
import styled from 'styled-components';

import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import GlobalStyles from 'styles';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Footer from 'components/Footer';
import Platforms from 'features/platforms/Platforms';
import Options from 'features/options/Options';
import GameLinks from 'features/rollGame/GameLinks';
import RollGame from 'features/rollGame/RollGame';

const theme = createMuiTheme({ palette: { type: 'dark' } });

const AppRoot = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 16px auto 16px;
  grid-template-rows: 48px 24px auto 24px auto 24px auto 24px 200px;
  grid-template-areas:
    'header header     header'
    '.      .          .     '
    '.      roll-game  .     '
    '.      .          .     '
    '.      side-right .     '
    '.      .          .     '
    '.      side-left  .     '
    '.      .          .     '
    'footer footer     footer';

  @media (min-width: 720px) {
    grid-template-rows: 48px 24px auto 24px auto 24px 48px;
    grid-template-columns: 32px 1fr 24px 1fr 32px;
    grid-template-areas:
      'header header     header    header     header'
      '.      .          .         .          .     '
      '.      roll-game  roll-game roll-game  .     '
      '.      .          .         .          .     '
      '.      side-left  .         side-right .     '
      '.      .          .         .          .     '
      'footer footer     footer    footer     footer';
  }

  @media (min-width: 1200px) {
    grid-template-columns: auto 340px 40px 400px 40px 340px auto;
    grid-template-rows: 48px 40px auto 40px 48px;
    grid-template-areas:
      'header header    header header    header header     header'
      '.      .         .      .         .      .          .     '
      '.      side-left .      roll-game .      side-right .     '
      '.      .         .      .         .      .          .     '
      'footer footer    footer footer    footer footer     footer';
  }

  @media (min-width: 1840px) {
    grid-template-columns: auto 360px 40px 840px 40px 360px auto;
    grid-template-rows: 64px 40px auto 40px 64px;
  }
`;
const StyledHeader = styled(Header)`
  grid-area: header;
`;
const StyledSidebarLeft = styled(Sidebar)`
  grid-area: side-left;
`;
const StyledSidebarRight = styled(Sidebar)`
  grid-area: side-right;
`;
const StyledRollGame = styled(RollGame)`
  grid-area: roll-game;
`;
const StyledFooter = styled(Footer)`
  grid-area: footer;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppRoot>
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
