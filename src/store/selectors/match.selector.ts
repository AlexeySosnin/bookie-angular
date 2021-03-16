import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { IMatchState } from '../state/match.state';

const selectMatch = (state: IAppState) => state.matchs;

export const selectMatchList = createSelector(
  selectMatch,
  (state: IMatchState) => state.matchs
);

export const selectedMatch = createSelector(
  selectMatch,
  (state: IMatchState) => state.selectedMatch
);
