import React from 'react';
import styled from 'styled-components';
import * as colors from '@material-ui/core/colors';
import { Typography, Link } from '@material-ui/core';
import { format } from 'date-fns';

import analytics from 'utils/analytics';
import buildDate from 'utils/buildDate';
import { gamesCount } from 'features/rollGame/rollGameUtils';

const FooterRoot = styled.footer`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${colors.grey[800]};
  border-bottom: 1px solid ${colors.grey[800]};
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

  @media (min-width: 720px) {
    flex-direction: row;
    text-align: left;
  }
`;
const FooterLink = styled(Link).attrs({
  rel: 'noreferrer noopener',
  target: '_blank',
  color: 'inherit',
})``;

type Props = {
  className?: string;
};

// TODO: add FAQ

const gamesListSourceUrl = '//nukecritic.com/rgg/';
const authorUrl = '//github.com/DmitryScaletta';
const reportBugUrl = '//github.com/honeykingdom/rgg/issues';

const buildDateString = format(new Date(buildDate), 'P p');

const Footer = ({ className }: Props) => {
  return (
    <FooterRoot className={className}>
      <FooterInner>
        <Typography variant="inherit" color="textSecondary">
          Games in database:{' '}
          <Typography variant="inherit" color="textPrimary">
            {gamesCount}
          </Typography>
          <br />
          Games list from:{' '}
          <Typography variant="inherit" color="textPrimary">
            <FooterLink
              href={gamesListSourceUrl}
              onClick={() => analytics.event.ui.link(gamesListSourceUrl)}
            >
              nukecritic.com/rgg/
            </FooterLink>
          </Typography>
        </Typography>

        <Typography variant="inherit" color="textSecondary">
          Author:{' '}
          <Typography variant="inherit" color="textPrimary">
            <FooterLink
              href={authorUrl}
              onClick={() => analytics.event.ui.link(authorUrl)}
            >
              DmitryScaletta
            </FooterLink>
          </Typography>
          <br />
          Last update:{' '}
          <Typography variant="inherit" color="textPrimary">
            {buildDateString}
          </Typography>
        </Typography>

        <Typography variant="inherit" color="textSecondary">
          <Typography variant="inherit" color="textPrimary">
            <FooterLink
              href={reportBugUrl}
              onClick={() => analytics.event.ui.link(reportBugUrl)}
            >
              Report a bug
            </FooterLink>
          </Typography>
        </Typography>
      </FooterInner>
    </FooterRoot>
  );
};

export default React.memo(Footer);
