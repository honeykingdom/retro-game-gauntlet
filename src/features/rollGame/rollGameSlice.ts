/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { LS } from 'utils/constants';
import { lsRead, lsWrite } from 'utils/ls';
import type {
  OptionName,
  Options,
  RolledGame,
  RollGameState,
} from './rollGameTypes';
import {
  DEFAULT_OPTIONS,
  DEFAULT_SELECTED_PLATFORMS,
} from './rollGameConstants';

const getInitialOptions = (): Options =>
  typeof window === 'undefined'
    ? DEFAULT_OPTIONS
    : { ...DEFAULT_OPTIONS, ...lsRead(LS.Options) };

const initialState: RollGameState = {
  isRolling: false,
  rolledGame: null,
  selectedPlatforms: DEFAULT_SELECTED_PLATFORMS,
  options: getInitialOptions(),
};

type OptionUpdatedPayload = {
  name: OptionName;
  newValue: Options[OptionName];
};

const rollGame = createSlice({
  name: 'rollGame',
  initialState,
  reducers: {
    rollGameStarted: (state) => {
      state.isRolling = true;
      state.rolledGame = null;
    },
    rollGameCompleted: (state, { payload }: PayloadAction<RolledGame>) => {
      state.isRolling = false;
      state.rolledGame = payload;
    },
    platformsChanged: {
      prepare: (payload: string[]) => {
        lsWrite(LS.Platforms, payload);
        return { payload };
      },
      reducer: (state, { payload }: PayloadAction<string[]>) => {
        state.selectedPlatforms = payload;
      },
    },
    optionChanged: {
      prepare: (payload: OptionUpdatedPayload) => {
        if (payload.name !== 'theme') {
          const lsOptions = lsRead(LS.Options) || {};
          (lsOptions[payload.name] as any) = payload.newValue;
          lsWrite(LS.Options, lsOptions);
        }
        return { payload };
      },
      reducer: (state, { payload }: PayloadAction<OptionUpdatedPayload>) => {
        (state.options[payload.name] as any) = payload.newValue;
      },
    },
  },
});

export const {
  rollGameStarted,
  rollGameCompleted,

  platformsChanged,
  optionChanged,
} = rollGame.actions;

export default rollGame.reducer;

// selectors
export const isRollingSelector = (state: RootState) => state.rollGame.isRolling;

export const rolledGameSelector = (state: RootState) =>
  state.rollGame.rolledGame;

export const selectedPlatformsSelector = (state: RootState) =>
  state.rollGame.selectedPlatforms;

export const secondsToSpinSelector = (state: RootState) =>
  state.rollGame.options.secondsToSpin;

export const speedSelector = (state: RootState) => state.rollGame.options.speed;

export const numberOfGamesSelector = (state: RootState) =>
  state.rollGame.options.numberOfGames;

export const themeSelector = (state: RootState) => state.rollGame.options.theme;
