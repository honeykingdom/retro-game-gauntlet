/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import { AppDispatch } from 'app/store';
import {
  numberOfGamesSelector,
  selectedPlatformIdsSelector,
} from 'features/options/optionsSlice';
import { getRandomGames } from 'features/rollGame/rollGameUtils';
import { RolledGame } from 'features/rollGame/rollGameTypes';

interface RollGameState {
  isRolling: boolean;
  gameIndex: number | null;
  rolledGames: RolledGame[];
}

const initialState: RollGameState = {
  isRolling: false,
  gameIndex: null,
  rolledGames: [],
};

const rollGame = createSlice({
  name: 'rollGame',
  initialState,
  reducers: {
    updateRolledGamesThunk: (
      state,
      { payload }: PayloadAction<RolledGame[]>,
    ) => {
      state.rolledGames = payload;
    },
    rollGameStart: (state) => {
      state.isRolling = true;
      state.gameIndex = null;
    },
    rollGameComplete: (state, { payload }: PayloadAction<number>) => {
      state.isRolling = false;
      state.gameIndex = payload;
    },
  },
});

export const { rollGameStart, rollGameComplete } = rollGame.actions;

const { updateRolledGamesThunk } = rollGame.actions;

export default rollGame.reducer;

// selectors
export const isRollingSelector = (state: RootState) => state.rollGame.isRolling;

export const rolledGamesSelector = (state: RootState) =>
  state.rollGame.rolledGames;

export const rolledGameIndexSelector = (state: RootState) =>
  state.rollGame.gameIndex;

export const rolledGameSelector = (state: RootState) => {
  if (state.rollGame.gameIndex === null) return null;

  return state.rollGame.rolledGames[state.rollGame.gameIndex];
};

// actions
export const updateRolledGames = () => (
  dispatch: AppDispatch,
  getState: () => RootState,
) => {
  const state = getState();

  const numberOfGames = numberOfGamesSelector(state);
  const selectedPlatformIds = selectedPlatformIdsSelector(state);

  const rolledGames = getRandomGames(selectedPlatformIds, numberOfGames);

  dispatch(updateRolledGamesThunk(rolledGames));
};
