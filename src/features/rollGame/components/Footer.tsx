import React from 'react';
import { Typography, Link, styled } from '@mui/material';
import analytics from 'utils/analytics';
import { BREAKPOINTS } from 'utils/constants';
import { gamesCount } from '../rollGameUtils';

const FooterRoot = styled('footer')`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${(p) => p.theme.palette.divider};
`;
const FooterInner = styled(Typography)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-grow: 1;
  max-width: 1280px;
  height: 100%;
  font-size: 0.8rem !important;
  text-align: center;
  opacity: 0.6;

  @media (min-width: ${BREAKPOINTS.md}px) {
    flex-direction: row;
    text-align: left;
  }
`;

type Props = {
  className?: string;
};

// TODO: add FAQ

const gamesListSourceUrl = '//nukecritic.com/rgg/';
const authorUrl = '//github.com/DmitryScaletta';

const Footer = ({ className }: Props) => (
  <FooterRoot className={className}>
    <FooterInner>
      <Typography variant="inherit" component="span" color="textSecondary">
        Games in database:{' '}
        <Typography variant="inherit" component="span" color="textPrimary">
          {gamesCount}
        </Typography>{' '}
        (
        <Link
          rel="noreferrer noopener"
          target="_blank"
          color="inherit"
          href={gamesListSourceUrl}
          onClick={() => analytics.ui.link(gamesListSourceUrl)}
        >
          source
        </Link>
        )
      </Typography>

      <Typography variant="inherit" component="span" color="textSecondary">
        Author:{' '}
        <Typography variant="inherit" component="span" color="textPrimary">
          <Link
            rel="noreferrer noopener"
            target="_blank"
            color="inherit"
            href={authorUrl}
            onClick={() => analytics.ui.link(authorUrl)}
          >
            DmitryScaletta
          </Link>
        </Typography>
      </Typography>
    </FooterInner>
  </FooterRoot>
);

export default React.memo(Footer);
