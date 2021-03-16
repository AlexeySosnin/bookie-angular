import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { IUser } from '../../core/models/user.interface';
import { MatchPrice } from '../../core/models/matchPrice';
import { Sport } from '../../core/models/sport';
import { Leagues } from '../../core/models/leagues';
import { Evend } from '../../core/models/evend';
import { ApiService } from '../../services/api.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { Router } from '@angular/router';
import { Highlights } from '../../core/models/highlights';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Upcoming } from '../../core/models/upcoming';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GetUsers } from '../../store/actions/user.actions';
import { Region } from '../../core/models/region';

export interface Message {
    author: string;
    message: string;
}

@Component({
    selector: 'app-upcoming',
    templateUrl: './upcoming.component.html',
    styleUrls: ['./upcoming.component.css'],
})
export class UpcomingComponent implements OnInit {
    @Input()
    events: IUser[];
    public list: MatchPrice[];

    public highlights: Highlights;
    public league: Leagues;
    public sport: Sport;
    public sportName: string;
    public regionName: string;
    public leagueName: string;
    public upcoming: Upcoming[];
    public CHAT_URL = 'ws://88.99.55.247:6001';
    public activeTab: string = '';

    public currentMatch: Observable<MatchPrice[]>;
    private readonly currentMatchSubject: BehaviorSubject<MatchPrice[]>;

    @Input()
    isShow: boolean;

    public isLoading: boolean = false;
    public messages: Subject<Message>;

    @Output()
    userSelected: EventEmitter<number> = new EventEmitter();
    public currentEvent: Observable<Evend>;
    constructor(
        private readonly api: ApiService,
        private readonly router: Router,
        private store: Store<IAppState>,
        private readonly ngxService: NgxUiLoaderService,

        public toastr: ToastrManager
    ) {
        sessionStorage.setItem('league_id', '');
        this.list = [];
        api.highlights().subscribe((data) => {
            this.highlights = data.data;
            this.isLoading = true;
            //this.router.navigate(['/dashboard']);
        });
        this.sportName = sessionStorage.getItem('sport_name');
        this.regionName = sessionStorage.getItem('region_name');
        this.leagueName = sessionStorage.getItem('league_name');
        setInterval(() => {
            this.store.dispatch(new GetUsers());
        }, 60000);
    }

    ngOnInit(): void {
        this.activeTab = sessionStorage.hasOwnProperty('sport_id') ? sessionStorage.getItem('sport_id') : '';
    }
    public getSportEvent(sport: Sport) {
        sessionStorage.setItem('league_id', '');
        sessionStorage.setItem('league_name', '');
        sessionStorage.setItem('region_id', '');
        sessionStorage.setItem('region_name', '');
        sessionStorage.setItem('sport_id', '' + sport.id);
        sessionStorage.setItem('sport_name', '');
        this.store.dispatch(new GetUsers());
    }
    public getRegionEvent(sport: Sport, region: Region) {
        sessionStorage.setItem('league_id', '');
        sessionStorage.setItem('league_name', '');
        sessionStorage.setItem('region_id', '' + region.id);
        sessionStorage.setItem('region_name', '');
        sessionStorage.setItem('sport_id', '' + sport.id);
        sessionStorage.setItem('sport_name', '');
        this.store.dispatch(new GetUsers());
    }
    public getLeagueEvent(sport: Sport, region: Region, league: Leagues) {
        sessionStorage.setItem('league_id', '' + league.id);
        sessionStorage.setItem('league_name', '');
        sessionStorage.setItem('region_id', '' + region.id);
        sessionStorage.setItem('region_name', '');
        sessionStorage.setItem('sport_id', '' + sport.id);
        sessionStorage.setItem('sport_name', '');
        this.store.dispatch(new GetUsers());
    }

    public selectedEvent(event: IUser, percent: any): void {
        this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!this.list) {
            this.list = [];
        }
        if (Number(percent.price) === 0) {
            return;
        }
        const existedData = this.list.filter(u => u.event.id === percent.event_id);
        this.list = this.list.filter((u) => u.event.id !== percent.event_id);
        if (existedData.length > 0 && existedData[0].price.id == percent.id) {
            sessionStorage.setItem('matchPrice', JSON.stringify(this.list));

            return;
        } else {
            this.isShow = this.isShow ? false : true;
            const matchPrice = new MatchPrice();
            matchPrice.event = { ...event };
            delete matchPrice.event.league;
            delete matchPrice.event.region;
            delete matchPrice.event.stats;
            delete matchPrice.event.away_team;
            delete matchPrice.event.home_team;
            delete matchPrice.event.featured_markets;
            delete matchPrice.event.sport;

            matchPrice.price = percent;
            matchPrice.banko = false;
            matchPrice.lock = false;
            matchPrice.chk = false;

            this.list.push(matchPrice);
            sessionStorage.setItem('matchPrice', JSON.stringify(this.list));
        }
    }

    public setEvent(event: Evend) {
        sessionStorage.setItem('event_id', '' + event.id);
        if (window.location.href.indexOf('live') > -1 || window.location.href.indexOf('event-detail') > -1) {
            this.router.navigate(['/event-detail/' + event.id]);
        } else {
            this.router.navigate(['/detail/' + event.id]);
        }
    }
    public favoriteEvent(item: any) {
        sessionStorage.setItem('search', '');
        sessionStorage.setItem('league_id', '');
        sessionStorage.setItem('league_name', '');
        sessionStorage.setItem('region_id', '');
        sessionStorage.setItem('region_name', '');
        sessionStorage.setItem('sport_id', '' + item.id);
        sessionStorage.setItem('sport_name', '' + item.name);
        this.activeTab = item.id;
        this.store.dispatch(new GetUsers());
        this.sportName = item.name;
    }
    public getActiveClass(tab: string): string {
        if (this.activeTab === tab) {
            return 'nav-wrap-li b-livetabs__item  ui-state-active tabs-active';
        } else {
            return 'nav-wrap-li b-livetabs__item  ui-state-active';
        }
    }
    public getEventIsSelected(event: Evend, percent: any): string {
        this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
        let rtn = '';
        return this.list.filter((item) => item.event.id === percent.event_id && percent.id === item.price.id).length == 0 ? '' : 'selected';
    }
    public tdShow(obj: any[], sport_id: number, chck_id: number): boolean {
        if (sport_id === chck_id && obj.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    public showLock(market: any, odd): boolean {
        let check = false;
        if (!market) {
            return false;
        }
        if (market.is_suspended || !market.is_active || odd.is_suspended ||!odd.is_active || !odd.price || Number(odd.price) === 0) {
            return true;
        } else return false;
    }
    public checkFavorite(): boolean {
        let prm = window.location.href;
        if (prm.indexOf('live') > -1 || prm.indexOf('event-detail') > -1) {
            return false;
        } else {
            return true;
        }
    }
    public getNodesSportCheck(sport: Sport): boolean {
        return sport.id === 4 || sport.id === 40 || sport.id === 5 || sport.id === 51 ? true : false;
    }
}
