import { combineReducers } from '@reduxjs/toolkit';

import rollGame from 'features/rollGame/rollGameSlice';
import options from 'features/options/optionsSlice';

const rootReducer = combineReducers({
  rollGame,
  options,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
