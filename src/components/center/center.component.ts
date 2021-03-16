import { GetUsers } from './../../store/actions/user.actions';
import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import { selectUserList } from '../../store/selectors/user.selector';
import { Router } from '@angular/router';
import { MatchPrice } from '../../core/models/matchPrice';
import { Sport } from '../../core/models/sport';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})
export class CenterComponent implements OnInit {

  public users$ = this._store.pipe(select(selectUserList));
  public list: MatchPrice[];

  public sport: Sport;

  @Input()
  public isShow: boolean;

  constructor(private readonly _store: Store<IAppState>, private readonly _router: Router) {

  }

  ngOnInit(): void {
      this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
  }
}
