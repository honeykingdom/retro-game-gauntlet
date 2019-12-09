import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import {
  isRollingSelector,
  rolledGameSelector,
} from 'features/rollGame/rollGameSlice';
import SelectedPlatformsMessage from 'features/rollGame/SelectedPlatformsMessage';

const ResultRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
  text-align: center;
`;

const Result = () => {
  const isRolling = useSelector(isRollingSelector);
  const rolledGame = useSelector(rolledGameSelector);

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
        <Typography variant="h6" color="textSecondary">
          Platform:{' '}
          <Typography variant="inherit" color="textPrimary">
            {platform}
          </Typography>
        </Typography>
      </>
    );
  };

  return (
    <ResultRoot>
      {isRolling || !rolledGame ? (
        <SelectedPlatformsMessage />
      ) : (
        renderRolledGame()
      )}
    </ResultRoot>
  );
};

export default Result;
