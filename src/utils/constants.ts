export const GLOBAL_FONT = 'Roboto, Helvetica, Arial, sans-serif';

export enum LS {
  Options = 'options',
  Platforms = 'platforms',
}

export const BREAKPOINTS = {
  sm: 450,
  md: 720,
  lg: 1200,
  xl: 1840,
};

export const PREVENT_FORWARD_PROPS = {
  shouldForwardProp: (p: string) => !p.startsWith('$'),
};
