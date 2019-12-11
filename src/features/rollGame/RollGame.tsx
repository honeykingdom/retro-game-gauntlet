import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import WheelCanvas from 'features/wheel/WheelCanvas';
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
      <WheelCanvas />
      <Result />
    </RollGameRoot>
  );
};

export default RollGame;
