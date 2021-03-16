import { Store } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { GetUsers } from '../../store/actions/user.actions';
import { Component, OnInit } from '@angular/core';
import { Live } from '../../core/models/live';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IUser } from '../../core/models/user.interface';
import { MatchPrice } from '../../core/models/matchPrice';
import { Evend } from '../../core/models/evend';
import { Percent } from '../../core/models/percent';
import { Region } from '../../core/models/region';
import { Leagues } from '../../core/models/leagues';
import { Sport } from '../../core/models/sport';
import { IUserHttp } from '../../core/models/http-models/user-http.interface';
import { GroupEvent } from '../../core/models/group';
import { FormControl } from '@angular/forms';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public matchDetail: any;
  public eventDetail: Evend;
  public lives: Live[];
  public isLoading: boolean = false;

  public activeTab: string;
  public list: MatchPrice[];
  public calendar: GroupEvent[];
  public calendarOrj: GroupEvent[];
  public newList: Evend[];

  public sport: Sport[];

  public optSport = new FormControl('1');
  public inputSearch = new FormControl('');
  public searchkey: string;

  constructor(private readonly api: ApiService,
    private readonly ngxService: NgxUiLoaderService,
    private store: Store<IAppState>,
    private readonly router: Router) {
    this.newList = [];
    api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sport = data.data;

    });

  }

  ngOnInit(): void {
    this.searchkey = sessionStorage.getItem('search');

    this.search();
  }


  public search(): void {
    this.isLoading = false;
    this.calendarOrj = [];
    this.calendar = [];
    this.api.group('', this.optSport.value, '', null, this.inputSearch.value, true, true).subscribe(data => {
      this.calendar = data.data;
      if (data.data.length > 0) {

        this.newList = data.data[0].events;
        this.activeTab = '' + data.data[0].date;
      }
      this.calendarOrj = data.data;
      this.isLoading = true;
    });

  }
  public onBack(): void {
    this.router.navigate(['/dashboard/']);

  }
  public dashboard(): void {
    this.router.navigate(['/dashboard/']);

  }

  public getContentHtml(): string {
    return '<div class="content" >';
  }
  public CloseDiv(): string {
    return "</div>";
  }
  public getEvents(item: any) {
    let _tht = this;
    _tht.newList = item.events;
    this.activeTab = item.date;
  }

  public onSearchChange(searchValue: string): void {
    sessionStorage.setItem('search', '' + searchValue);
    if ((searchValue && (searchValue.length == 0 || searchValue.length >= 3)) || searchValue == "")
      this.store.dispatch(new GetUsers());
  }
  public detail(item: any): void {

    this.router.navigate(['/event-detail/' + item.id]);
  }

  public getClass(tab: string): string {
    if (this.activeTab === tab) {
      return 'date today selected';
    } else {
      return 'date today';

    }
  }


  public getSportEvent(sport: Sport) {

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_id', '');
    sessionStorage.setItem('league_name', '');
    sessionStorage.setItem('region_id', '');
    sessionStorage.setItem('region_name', '');
    sessionStorage.setItem('sport_id', '' + sport.id);
    sessionStorage.setItem('sport_name', '');
    this.store.dispatch(new GetUsers());
    this.router.navigate(['/dashboard/']);


  }
  public getRegionEvent(region: Region) {

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_id', '');
    sessionStorage.setItem('league_name', '');
    sessionStorage.setItem('region_id', '' + region.id);
    sessionStorage.setItem('region_name', '');
    sessionStorage.setItem('sport_id', '');
    sessionStorage.setItem('sport_name', '');
    this.store.dispatch(new GetUsers());
    this.router.navigate(['/dashboard/']);


  }
  public getLeagueEvent(league: Leagues) {

    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_id', '' + league.id);
    sessionStorage.setItem('league_name', '');
    sessionStorage.setItem('region_id', '');
    sessionStorage.setItem('region_name', '');
    sessionStorage.setItem('sport_id', '');
    sessionStorage.setItem('sport_name', '');
    this.store.dispatch(new GetUsers());
    this.router.navigate(['/dashboard/']);


  }

}
