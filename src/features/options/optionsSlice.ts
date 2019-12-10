/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import {
  writeOptionsToLocalStorage,
  readOptionsFromLocalStorage,
} from 'features/options/optionsUtils';
import { AppTheme } from 'features/options/optionsTypes';

type OptionsState = {
  selectedPlatformIds: string[];
  secondsToSpin: number;
  speed: number;
  numberOfGames: number;
  currentTheme: AppTheme;
};

export type OptionName =
  | 'secondsToSpin'
  | 'speed'
  | 'numberOfGames'
  | 'selectedPlatformIds'
  | 'currentTheme';
type UpdateOptionAction = {
  name: OptionName;
  value: any;
};

const initialState: OptionsState = {
  selectedPlatformIds: ['playstation', 'playstation-2'],
  secondsToSpin: 30,
  speed: 3,
  numberOfGames: 16,
  currentTheme: 'dark',
  ...readOptionsFromLocalStorage(),
};

// TODO: remove side effect from reducers
const options = createSlice({
  name: 'options',
  initialState,
  reducers: {
    updateOption: (state, { payload }: PayloadAction<UpdateOptionAction>) => {
      const { name, value } = payload;
      (state as any)[name] = value;

      writeOptionsToLocalStorage(state);
    },
    selectPlatform: (state, { payload }: PayloadAction<string>) => {
      state.selectedPlatformIds = [payload];

      writeOptionsToLocalStorage(state);
    },
    togglePlatform: (state, { payload }: PayloadAction<string>) => {
      const index = state.selectedPlatformIds.indexOf(payload);

      if (index > -1) {
        state.selectedPlatformIds.splice(index, 1);
      } else {
        state.selectedPlatformIds.push(payload);
      }

      writeOptionsToLocalStorage(state);
    },
  },
});

export const { updateOption, selectPlatform, togglePlatform } = options.actions;

export default options.reducer;

// selectors
export const secondsToSpinSelector = (state: RootState) =>
  state.options.secondsToSpin;

export const speedSelector = (state: RootState) => state.options.speed;

export const numberOfGamesSelector = (state: RootState) =>
  state.options.numberOfGames;

export const selectedPlatformIdsSelector = (state: RootState) =>
  state.options.selectedPlatformIds;

export const currentThemeSelector = (state: RootState) =>
  state.options.currentTheme;
