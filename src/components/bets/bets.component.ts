import { Highlights } from '../../core/models/highlights';
import { Component, OnInit } from '@angular/core';
import { Sport } from '../../core/models/sport';
import { Region } from '../../core/models/region';
import { Leagues } from '../../core/models/leagues';
import { ApiService } from '../../services/api.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../store/state/app.state';
import { selectUserList } from '../../store/selectors/user.selector';
import { GetUsers } from '../../store/actions/user.actions';
import { User } from '../../core/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {

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
  public selectedLeague: Leagues[];


  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private readonly ngxService: NgxUiLoaderService,
    public toastr: ToastrManager,
    private activatedRoute: ActivatedRoute,


    private store: Store<IAppState>) {

    this.user = new User();
    this.user.token = '1Iktsa40MbZ3FJmXyGZsYhdMdJEHq2EbYvTFzIaZJt5HehIA3hEjibuTt58tsWpubq6NnmOLZnIs5SWC';
    sessionStorage.setItem('currentUser', JSON.stringify(this.user));


    api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sport = data.data;
      this.sport.forEach(item => {
        item.show = false;
        item.regions.forEach(region => {
          region.leagues.forEach(lea => {
            lea.check = false;
          })
        });

      });
    });
    api.highlights().subscribe(data => {
      this.highlights = data.data;
      this.isLoading = true;
    });
    this.chckNext = '0';
    this.selectedLeague = [];

  }

  ngOnInit(): void {
    this.store.dispatch(new GetUsers());

  }

  public onSearchChange(searchValue: string): void {
    sessionStorage.setItem('search', '' + searchValue);
    if ((searchValue && (searchValue.length == 0 || searchValue.length >= 3)) || searchValue == "")
      this.store.dispatch(new GetUsers());
  }
  public getRegions(item: Sport): void {

    this.regions = [];
    if (item.show) {
      item.show = false;
    } else {
      this.sport.forEach(km => {
        km.show = false;
      });
      item.show = true;

    }
    const urlParams = window.location.href;
    if (urlParams.indexOf('history') > -1) {
      this.router.navigate(['/dashboard']);
    }



  }
  public getLeague(id: number, item: Region): void {
    let isLoading = false;
    if (item.show) {
      item.show = false;
    } else {
      this.regions.forEach(km => {
        km.show = false;
      });
      item.show = true;
    }
    const urlParams = window.location.href;
    if (urlParams.indexOf('history') > -1) {
      this.router.navigate(['/dashboard']);
    }



  }

  public getEventsObject(sport: Sport, region: Region, lig: Leagues): void {
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
    if (sessionStorage.getItem('hours') == prm) {
      sessionStorage.setItem('hours', '');
    } else
      sessionStorage.setItem('hours', prm);
    this.store.dispatch(new GetUsers());
    this.api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sport = data.data;
      this.sport.forEach(item => {
        item.show = false;
        item.regions.forEach(region => {
          region.leagues.forEach(lea => {
            lea.check = false;
          })
        });

      });
    });
  }

  public getHoursClass(prm: string): string {

    if (sessionStorage.getItem('hours') === prm) {
      return 'active';
    } else {
      return '';
    }

  }
  public checkNext(values: any, league: Leagues) {

    if (values.target.checked) {
      league.check = true;
      this.chckNext = this.chckNext + ',' + league.id;
      this.selectedLeague.push(league);
    } else {
      league.check = false;
      this.chckNext = this.chckNext.replace('' + league.id + ',', '');
      this.selectedLeague = this.selectedLeague.filter(item => item.id !== league.id);
    }
    let filter = '0';
    this.selectedLeague.forEach(item => {
      if (item.check) {
        filter += ',' + item.id;
      }
    });

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('sport_id', '');
    sessionStorage.setItem('region_id', '');
    sessionStorage.setItem('hours', '');
    sessionStorage.setItem('league_id', '' + filter);

    this.store.dispatch(new GetUsers());

    let prm = window.location.href;
    if (prm.indexOf('detail') > -1) {
      this.router.navigate(['/dashboard']);

    }


  }

}
