export type AppTheme = 'light' | 'dark';

export type Options = {
  secondsToSpin: number;
  speed: number;
  numberOfGames: number;
  theme: AppTheme;
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
