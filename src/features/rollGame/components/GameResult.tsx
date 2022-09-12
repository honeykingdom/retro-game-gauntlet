import React from 'react';
import { Typography, styled } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import SelectedPlatformsMessage from './SelectedPlatformsMessage';
import { isRollingSelector, rolledGameSelector } from '../rollGameSlice';

const GameResultRoot = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  text-align: center;
`;

const Result = () => {
  const isRolling = useAppSelector(isRollingSelector);
  const rolledGame = useAppSelector(rolledGameSelector);

  const renderRolledGame = () => {
    if (!rolledGame) return null;

    const { name, platform } = rolledGame;

    return (
      <>
        <Typography
          variant="h4"
          style={{ marginBottom: 8, textAlign: 'center' }}
        >
          {name}
        </Typography>
        <Typography variant="h6" color="textSecondary" component="span">
          Platform:{' '}
          <Typography variant="inherit" color="textPrimary" component="span">
            {platform}
          </Typography>
        </Typography>
      </>
    );
  };

  return (
    <GameResultRoot>
      {isRolling || !rolledGame ? (
        <SelectedPlatformsMessage />
      ) : (
        renderRolledGame()
      )}
    </GameResultRoot>
  );
};

export default Result;
