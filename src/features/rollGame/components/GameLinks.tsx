import React from 'react';
import { Button, Box, Typography, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useAppSelector } from 'app/hooks';
import analytics from 'utils/analytics';
import { isRollingSelector, rolledGameSelector } from '../rollGameSlice';

const GameLinksRoot = styled('div')``;
const ServiceLink = styled(Button)<{ target?: string; rel?: string }>`
  width: 100%;
  text-transform: none !important;

  .MuiButton-label {
    justify-content: flex-start;
  }
`;
const Links = styled('div')`
  display: grid;
  grid-gap: 16px 16px;
`;

const getLinks = (name: string) => {
  // TODO: check other symbols and remove double spaces
  const searchQuery = encodeURI(name.replace(/[&:]/g, ''));
  const searchQueryGameFaqs = searchQuery.replace(/%20/g, '+');

  return [
    {
      id: 'youtube',
      text: 'YouTube',
      href: `//www.youtube.com/results?search_query=${searchQuery}`,
      icon: <YouTubeIcon />,
    },
    {
      id: 'gamefaqs',
      text: 'GameFAQs',
      href: `//gamefaqs.gamespot.com/search?game=${searchQueryGameFaqs}`,
    },
    {
      id: 'metacritic',
      text: 'Metacritic',
      href: `//www.metacritic.com/search/all/${searchQuery}/results`,
    },
    {
      id: 'hltb',
      text: 'How Long To Beat',
      href: `https://www.google.com/search?q=${searchQuery}%20site%3Ahowlongtobeat.com`,
    },
    {
      id: 'emuparadise',
      text: 'EmuParadise',
      href: `//www.emuparadise.me/roms/search.php?query=${searchQuery}&section=all`,
      icon: <GetAppIcon />,
    },
    {
      id: 'coolrom',
      text: 'CoolROM',
      href: `//coolrom.com.au/search?q=${searchQuery}`,
      icon: <GetAppIcon />,
    },
    {
      id: 'romhustler',
      text: 'RomHustler',
      href: `//romhustler.org/roms/search/?q=${searchQuery}`,
      icon: <GetAppIcon />,
    },
  ];
};

const GameLinks = () => {
  const isRolling = useAppSelector(isRollingSelector);
  const rolledGame = useAppSelector(rolledGameSelector);

  if (isRolling || !rolledGame) return null;

  const links = getLinks(rolledGame.name);

  return (
    <GameLinksRoot>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5">Links</Typography>
      </Box>

      <Links>
        {links.map(({ id, text, href, icon }) => (
          <ServiceLink
            key={id}
            variant="outlined"
            color="inherit"
            startIcon={icon || <SearchIcon />}
            size="medium"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => analytics.searchLink(id)}
          >
            <Typography
              variant="inherit"
              color="textSecondary"
              component="span"
            >
              Search on{' '}
              <Typography
                variant="inherit"
                color="textPrimary"
                component="span"
              >
                {text}
              </Typography>
            </Typography>
          </ServiceLink>
        ))}
      </Links>
    </GameLinksRoot>
  );
};

export default GameLinks;
