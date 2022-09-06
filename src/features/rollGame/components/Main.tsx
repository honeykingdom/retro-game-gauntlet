import Head from 'next/head';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { BREAKPOINTS } from 'utils/constants';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Platforms from './Platforms';
import Options from './Options';
import GameLinks from './GameLinks';
import RollGame from './RollGame';

const MainRoot = styled(Box)`
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
    grid-template-columns: auto 340px 16px 488px 16px 340px auto;
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

const Main = () => (
  <>
    <Head>
      <title>Retro Game Gauntlet</title>
    </Head>
    <MainRoot bgcolor="background.paper" color="text.primary">
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
    </MainRoot>
  </>
);

export default Main;
