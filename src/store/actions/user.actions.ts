import { Action } from '@ngrx/store';
import { Evend } from '../../core/models/evend'; 
import { MatchPrice } from '../../core/models/matchPrice';

export enum EUserActions {
  GetUsers = '[Evend] Get Evends',
  GetUsersSuccess = '[Evend] Get Evends Success',
  GetUser = '[Evend] Get Evend',
  GetUserSuccess = '[Evend] Get Evend Success',
}

export class GetUsers implements Action {
  public readonly type = EUserActions.GetUsers;
}

export class GetUsersSuccess implements Action {
  public readonly type = EUserActions.GetUsersSuccess;
  constructor(public payload: Evend[]) {
  }
}

export class GetUser implements Action {
  public readonly type = EUserActions.GetUser;
  constructor(public payload: MatchPrice) {}
}
export class GetEventSuccess implements Action {
  public readonly type = EUserActions.GetUserSuccess;
  constructor(public payload: MatchPrice) {}
}
export class GetUserSuccess implements Action {
  public readonly type = EUserActions.GetUserSuccess;
  constructor(public payload: Evend) {}
}

export type UserActions = GetUsers | GetUsersSuccess | GetUser | GetUserSuccess;
