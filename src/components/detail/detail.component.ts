import { Store } from '@ngrx/store';
import { IAppState } from './../../store/state/app.state';
import { GetUsers } from './../../store/actions/user.actions';
import { Component, OnInit } from '@angular/core';
import { Live } from '../../core/models/live';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { IUser } from '../../core/models/user.interface';
import { MatchPrice } from '../../core/models/matchPrice';
import { Evend } from '../../core/models/evend';
import { Region } from '../../core/models/region';
import { Leagues } from '../../core/models/leagues';
import { Sport } from '../../core/models/sport';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
    public matchDetail: any;
    public eventDetail: Evend;
    public lives: Live[];
    public isLoading: boolean = false;
    public searchkey: string;

    public activeTab: string;
    public list: MatchPrice[];
    public event_id: number;

    constructor(private readonly api: ApiService, private store: Store<IAppState>, private readonly router: Router) {
        this.activeTab = 'all';
        this.isLoading = false;

        api.eventDetail(sessionStorage.getItem('event_id')).subscribe((data) => {
            this.matchDetail = data.data;
            this.eventDetail = data.data;
            api.markets(sessionStorage.getItem('event_id')).subscribe((data) => {
                this.isLoading = true;
                this.lives = data.data;
            });
        });
    }

    ngOnInit(): void {
        this.searchkey = sessionStorage.getItem('search');
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
        return '</div>';
    }

    public changeActiveTab(prm: string) {
        this.activeTab = prm;
        this.api.markets(sessionStorage.getItem('event_id'), prm).subscribe((data) => {
            this.isLoading = true;
            this.lives = data.data;
        });
    }

    public getClass(tab: string): string {
        if (this.activeTab === tab) {
            return 'groups_markets active';
        } else {
            return 'groups_markets ';
        }
    }
    public onSearchChange(searchValue: string): void {
        sessionStorage.setItem('search', '' + searchValue);
        let prm = window.location.href;
        if (prm.indexOf('detail') > -1 || prm.indexOf('event-detail') > -1) {
            this.router.navigate(['/dashboard']);
        } else {
        }
        if ((searchValue && (searchValue.length == 0 || searchValue.length >= 3)) || searchValue == "")


            this.store.dispatch(new GetUsers());
    }
    public getEventIsSelected(event: Evend): string {
        this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!this.list) return '';
        return this.list.filter(i => i.price.id == event.id).length > 0 ? 'active' : '';
    }
    public showLock(market: any, odd): boolean {
        if (!market) {
            return false;
        }
        if (market.is_suspended || !market.is_active || odd.is_suspended || !odd.is_active || !odd.price || Number(odd.price) === 0) {
            return true;
        } else return false;
    }

    public selectedEvent(event: IUser, percent: any): void {
        this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!this.list) {
            this.list = [];
        }

        if (Number(percent.price) === 0) {
            return;
        }
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


        var eventPrice = this.list.filter(item => item.event.event_id != event.event_id);
        eventPrice.push(matchPrice);
        sessionStorage.setItem('matchPrice', JSON.stringify(eventPrice));
    }

    public clearUnUsageData(data: MatchPrice) {
        delete data.event.league;
        delete data.event.sport;
        delete data.event.stats;
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
