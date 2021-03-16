import { Highlights } from './../../core/models/highlights';
import { Component, OnInit } from '@angular/core';
import { Sport } from '../../core/models/sport';
import { Region } from '../../core/models/region';
import { Leagues } from '../../core/models/leagues';
import { ApiService } from '../../services/api.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../store/state/app.state';
import { selectUserList } from '../../store/selectors/user.selector';
import { GetUsers } from './../../store/actions/user.actions';
import { User } from '../../core/models/user';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {

  count$: Observable<number>;
  public sport: Sport[];
  public highlights: Highlights;
  public regions: Region[];
  public leagues: Leagues[];
  public events: Event[];
  public user: User;
  public users$ = this.store.pipe(select(selectUserList));
  public isLoading: boolean = false;
  public chckNext: string;
  public searchkey: string;

  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private readonly ngxService: NgxUiLoaderService,
    public toastr: ToastrManager,
    private store: Store<IAppState>) {
    this.user = new User();
    this.user.token = '1Iktsa40MbZ3FJmXyGZsYhdMdJEHq2EbYvTFzIaZJt5HehIA3hEjibuTt58tsWpubq6NnmOLZnIs5SWC';
    sessionStorage.setItem('currentUser', JSON.stringify(this.user));

    api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sport = data.data;
      this.sport.forEach(item => {
        item.show = false;
      });

    });
    this.chckNext = '0';

  }

  ngOnInit(): void {
    this.store.dispatch(new GetUsers());
    this.searchkey = sessionStorage.getItem('search');
  }

  public live() {
    this.router.navigate(['/live']);

  }

  public onSearchChange(searchValue: string): void {
    if ((searchValue && (searchValue.length == 0 || searchValue.length >= 3)) || searchValue == "")

      sessionStorage.setItem('search', '' + searchValue);
    this.store.dispatch(new GetUsers());
  }
  public getRegions(item: Sport): void {
    if (item.show) {
      item.show = false;
    } else {
      this.sport.forEach(km => {
        km.show = false;
      });
      item.show = true;

    }
    this.api.region(item.id).subscribe(data => {

      this.regions = data.data;
      // tslint:disable-next-line: no-shadowed-variable
      this.regions.forEach(item => {
        item.show = false;
      });
    });


  }
  public getLeague(id: number, item: Region): void {
    if (item.show) {
      item.show = false;
    } else {
      this.regions.forEach(km => {
        km.show = false;
      });
      item.show = true;
    }
    this.api.league(id, item.id).subscribe(data => {

      this.leagues = data.data;
    });
  }
  public getEventsObject(sport: Sport, region: Region, lig: Leagues): void {
    // :number, region_id: number,league_id: number
    // item.sport.id,item.region_id,item.id

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_id', '' + lig.id);
    sessionStorage.setItem('league_name', '' + lig.name);
    sessionStorage.setItem('region_id', '' + region.id);
    sessionStorage.setItem('region_name', '' + region.name);
    sessionStorage.setItem('sport_id', '' + sport.id);
    sessionStorage.setItem('sport_name', '' + sport.name);
    this.store.dispatch(new GetUsers());

    this.router.navigate(['/dashboard']);
  }
  public getEvents(item: any): void {
    // :number, region_id: number,league_id: number
    // item.sport.id,item.region_id,item.id

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_id', '' + this.chckNext);
    sessionStorage.setItem('league_name', '' + item.name);
    sessionStorage.setItem('region_id', '' + item.region_id);
    sessionStorage.setItem('sport_id', '' + item.sport_id);
    sessionStorage.setItem('sport_name', '' + item.sport.name);
    this.store.dispatch(new GetUsers());

    this.router.navigate(['/dashboard']);
  }

  public selectLeagues(item: Leagues) {
    let league = sessionStorage.getItem('league_id');
    if (league.indexOf('' + item.id) > -1) {
      league = league.replace('' + item.id + ',', '');
    } else {
      league = league + ',' + item.id,
        sessionStorage.setItem('league_id', '' + league);

    }


  }
  public setHours(prm: string) {
    sessionStorage.setItem('hours', prm);
    this.api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sport = data.data;
      this.sport.forEach(item => {
        item.show = false;
      });

    });
  }

  public getHoursClass(prm: string): string {
    if (sessionStorage.getItem('hours') === prm) {
      return 'color: #ea2e2e;background-color: #000!important;';
    } else {
      return '';
    }

  }
  public checkNext(values: any, league: Leagues) {
    if (values.target.checked) {
      this.chckNext = this.chckNext + ',' + league.id;
    } else {
      this.chckNext = this.chckNext.replace(league.id + ',', '');
    }
    sessionStorage.setItem('league_id', '' + this.chckNext);
    this.store.dispatch(new GetUsers());

  }

}
