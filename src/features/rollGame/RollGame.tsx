import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import CircleCanvas from 'features/circle/CircleCanvas';
import Result from 'features/rollGame/Result';
import { updateRolledGames } from 'features/rollGame/rollGameSlice';

const RollGameRoot = styled.main`
  display: flex;
  flex-direction: column;
`;

type Props = {
  className?: string;
};

const RollGame = ({ className }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateRolledGames());
  }, [dispatch]);

  return (
    <RollGameRoot className={className}>
      <CircleCanvas />
      <Result />
    </RollGameRoot>
  );
};

export default RollGame;
