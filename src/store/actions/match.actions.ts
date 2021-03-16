import { Action } from '@ngrx/store';
import { MatchPrice } from '../../core/models/matchPrice'; 

export enum EMatchActions {
  GetMatchs = '[Evend] Get Matchs',
  GetMatchsSuccess = '[Evend] Get Matchs Success',
  GetMatch = '[Evend] Get Match',
  GetMatchSuccess = '[Evend] Get Match Success',

}

export class GetMatchs implements Action {
  public readonly type = EMatchActions.GetMatchs;
}

export class GetMatchsSuccess implements Action {
  public readonly type = EMatchActions.GetMatchsSuccess;
  constructor(public payload: MatchPrice[]) {
  }
}

export class GetMatch implements Action {
  public readonly type = EMatchActions.GetMatch;
  constructor(public payload: MatchPrice) {}
}
export class GetMatchSuccess implements Action {
  public readonly type = EMatchActions.GetMatchSuccess;
  constructor(public payload: MatchPrice) {}
} 

export type MatchActions = GetMatchs | GetMatchsSuccess | GetMatch | GetMatchSuccess;