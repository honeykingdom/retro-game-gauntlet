import React from 'react';
import { useWindowSize } from 'react-use';
import { Typography, IconButton, Tooltip, AppBar, styled } from '@mui/material';
import GitHubIcon from '@mui/icons-material//GitHub';
import { BREAKPOINTS } from 'utils/constants';
import ModeToggle from './ModeToggle';

const HeaderInner = styled('div')`
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
const Buttons = styled('div')`
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
  const windowSize = useWindowSize();

  return (
    <AppBar className={className} position="static">
      <HeaderInner>
        <Typography variant={windowSize.width < BREAKPOINTS.sm ? 'h5' : 'h4'}>
          Retro Game Gauntlet
        </Typography>
        <Buttons>
          <Tooltip title="GitHub Repository">
            <IconButton
              color="inherit"
              href="//github.com/honeykingdom/retro-game-gauntlet"
              target="_blank"
              rel="noreferrer noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <ModeToggle />
        </Buttons>
      </HeaderInner>
    </AppBar>
  );
};

export default React.memo(Header);
