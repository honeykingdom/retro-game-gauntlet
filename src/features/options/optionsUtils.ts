import { LS_OPTIONS } from 'utils/constants';

export const writeOptionsToLocalStorage = (options: Record<string, any>) => {
  localStorage.setItem(LS_OPTIONS, JSON.stringify(options));
};

export const readOptionsFromLocalStorage = () => {
  const options = localStorage.getItem(LS_OPTIONS);

  try {
    return JSON.parse(options || '{}');
  } catch (e) {
    return {};
  }
};
