import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import {
  GetUsersSuccess,
  EUserActions,
  GetUserSuccess,
  GetEventSuccess,
  GetUser,
  GetUsers
} from '../actions/user.actions';
import { selectUserList } from '../selectors/user.selector';  
import { IUserHttp} from '../../core/models/http-models/user-http.interface';
import { ApiService } from '../../services/api.service';
@Injectable()
export class UserEffects {
  @Effect()
  getUser$ = this._actions$.pipe(
    ofType<GetUser>(EUserActions.GetUser),
    map(action => action.payload),
    withLatestFrom(this._store.pipe(select(selectUserList))),
    switchMap(([id, users]) => {
      const selectedUser = users.filter(user => user.id === +id)[0];
      return of(new GetUserSuccess(selectedUser));
    })
  );
  @Effect()
  getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(EUserActions.GetUsers),
    switchMap(() => this.apiService.filter(sessionStorage.getItem('league_id'),sessionStorage.getItem('sport_id'),
                                          sessionStorage.getItem('region_id'),sessionStorage.getItem('hours'),
                                          sessionStorage.getItem('search'))),
    switchMap((userHttp: IUserHttp) => of(new GetUsersSuccess(userHttp.data)))
  );

  constructor(
    private apiService: ApiService,
    private _actions$: Actions,
    private _store: Store<IAppState>
  ) {}
}
