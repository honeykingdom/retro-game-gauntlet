import type { DefaultColorScheme } from '@mui/material/styles/experimental_extendTheme';

export type ColorScheme = DefaultColorScheme;

export type Options = {
  secondsToSpin: number;
  speed: number;
  numberOfGames: number;
};

export type OptionName = keyof Options;

export type RolledGame = {
  name: string;
  platform: string;
};

export type RollGameState = {
  isRolling: boolean;
  rolledGame: RolledGame | null;
  selectedPlatforms: string[];
  options: Options;
};
