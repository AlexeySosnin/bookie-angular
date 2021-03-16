import { RouterReducerState } from '@ngrx/router-store';

import { IUserState, initialUserState } from './user.state';
import { IMatchState, initialMatchState } from './match.state';
import { initialConfigState, IConfigState } from './config.state';


export interface IAppState {
  router?: RouterReducerState;
  users: IUserState;
  matchs: IMatchState;
  config: IConfigState;
}

export const initialAppState: IAppState = {
  users: initialUserState,
  matchs: initialMatchState,
  config: initialConfigState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
