import { Store } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { GetUsers } from '../../store/actions/user.actions';
import { ChangeDetectorRef, Component, OnInit, ViewRef, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { Live } from '../../core/models/live';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Sport } from '../../core/models/sport';
import { Evend } from '../../core/models/evend';

import { MatchPrice } from '../../core/models/matchPrice';
import { IUser } from '../../core/models/user.interface';
import { EventService } from '../../EventService';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
    public matchDetail: any;
    public lives: Live[];
    public livesTmp: Live[];
    public isLoading: boolean = false;

    public activeTab: string;
    public eventDetail: Evend;
    public searchkey: String;
    constructor(private readonly api: ApiService, private changeDetector: ChangeDetectorRef, private eventService: EventService, private store: Store<IAppState>, private readonly activatedRouter: ActivatedRoute, private readonly router: Router) {
        this.isLoading = false;


        this.activeTab = 'all';
        this.activatedRouter.paramMap.subscribe((params) => {
            if (params.has('id')) {
                sessionStorage.setItem('event_id', params.get('id'));
                this.api.eventDetail(params.get('id')).subscribe((data) => {
                    this.matchDetail = data.data;
                    this.eventService.BroadcastEvent('newsocketeventid', params.get('id'));
                    this.eventService.BroadcastEvent('live_animation_url', this.matchDetail.live_animation_url);
                    this.api.markets(params.get('id')).subscribe((data) => {
                        this.lives = data.data;
                        this.isLoading = true;
                    });
                });
            }
        });
        /*api.eventDetail(sessionStorage.getItem('event_id')).subscribe((data) => {
            this.matchDetail = data.data;
            this.eventDetail = data.data;
            api.markets(sessionStorage.getItem('event_id')).subscribe((data) => {
                this.isLoading = true;
                this.lives = data.data;
                this.clearState();
            });
        });*/


        this.eventService.GetEvent('wsmarketupdated').subscribe(data => {
            if (!this.lives) {
                return;
            }
            data.odds.forEach(element => {
                const filtered = this.lives
                    // filter nested lists first
                    .map(obj => {
                        // here we can use Object.assign to make shallow copy of obj, to preserve previous instance unchanged
                        return Object.assign({}, obj, {
                            odds: obj.odds.filter(el => el.id == element.id)
                        })
                    })
                    // then omit all items with empty list
                    .filter(obj => obj.odds.length > 0)

                if (filtered.length > 0 && filtered[0].odds.length > 0) {
                    if (filtered[0].odds[0].price > element.price) {
                        filtered[0].odds[0]["newValueState"] = -1;
                        filtered[0].odds[0]["destroyStateTime"] = new Date(Date.now() + 10000).getTime();
                        filtered[0].odds[0].price = element.price
                    } else if (filtered[0].odds[0].price < element.price) {
                        filtered[0].odds[0]["newValueState"] = 1;
                        filtered[0].odds[0]["destroyStateTime"] = new Date(Date.now() + 10000).getTime();
                        filtered[0].odds[0].price = element.price
                    }
                }

            });

            data.markets.forEach(element => {
                const filtered = this.lives
                    // filter nested lists first
                    .map(obj => {
                        // here we can use Object.assign to make shallow copy of obj, to preserve previous instance unchanged
                        return Object.assign({}, obj, {
                            odds: obj.odds.filter(el => el.id == element.id)
                        })
                    })
                    // then omit all items with empty list
                    .filter(obj => obj.odds.length > 0)

                if (filtered.length > 0 && filtered[0].odds.length > 0) {
                    if (filtered[0].odds[0].price > element.price) {
                        filtered[0].odds[0]["newValueState"] = -1;
                        filtered[0].odds[0]["destroyStateTime"] = new Date(Date.now() + 10000).getTime();
                        filtered[0].odds[0].price = element.price
                    } else if (filtered[0].odds[0].price < element.price) {
                        filtered[0].odds[0]["newValueState"] = 1;
                        filtered[0].odds[0]["destroyStateTime"] = new Date(Date.now() + 10000).getTime();
                        filtered[0].odds[0].price = element.price
                    } else {
                        filtered[0].odds[0]["newValueState"] = 0;
                        filtered[0].odds[0].price = element.price
                    }
                }
            });
        });

        this.eventService.GetEvent('wseventupdated').subscribe(data => {
            var event = data.events.filter(u => u.id == this.matchDetail.id);
            if (event && event.length > 0) {
                this.matchDetail.stats = event[0].stats;
                this.matchDetail.status = event[0].status;
            }
            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        });
        this.clearState();
    }
    clearState() {
        setInterval(() => {
            if (!this.lives || this.lives.length == 0) return;
            const filtered = this.lives
                .map(obj => {
                    return Object.assign({}, obj, {
                        odds: obj.odds.filter(el => el["destroyStateTime"] < Date.now() && el["newValueState"] && el["newValueState"] != 0)
                    })
                })
                .filter(obj => obj.odds.length > 0)
            if (filtered.length > 0) {
                filtered.forEach(d => {
                    d.odds.forEach(element => {
                        element["newValueState"] = 0;
                    });
                });
            }
        }, 5000);
    }


    ngOnInit(): void {
        this.searchkey = sessionStorage.getItem('search');
    }
    public onBack(): void {
        this.router.navigate(['/dashboard/']);
    }
    public dashboard(): void {
        this.router.navigate(['/calendar/']);
    }

    public onSearchChange(searchValue: string): void {
        sessionStorage.setItem('search', '' + searchValue);
        if ((searchValue && (searchValue.length == 0 || searchValue.length >= 3)) || searchValue == "")
            this.store.dispatch(new GetUsers());
    }
    public getEventIsSelected(event: Evend): string {
        var list = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!list) return '';
        return list.filter(i => i.price.id == event.id).length > 0 ? 'active' : '';
    }
    public showLock(market: any, odd): boolean {

        if (!market) {
            return false;
        }
        if (market.is_suspended || !market.is_active || odd.is_suspended || !odd.is_active || !odd.price || Number(odd.price) === 0) {
            return true;
        } else return false;
    }
    public getKeyWithParameter(item: any, prm: string, index: number) {
        if (prm == "yellow_card_score") {
            if (item['set1_yellow_card_score'] && item['set2_yellow_card_score'])
                return Number(item['set1_yellow_card_score'].split(':')[index]) + Number(item['set2_yellow_card_score'].split(':')[index])
            else
                return "0";
        } else if (prm === "red_card_score") {
            if (item["set1_red_card_score"] && item["set2_red_card_score"]) {
                return Number(item['set1_red_card_score'].split(':')[index]) + Number(item['set2_red_card_score'].split(':')[index])
            } else return "0";
        } else if (prm === "corner_score") {
            if (item["set1_corner_score"] && item["set2_corner_score"])
                return Number(item['set1_corner_score']?.split(':')[index]) + Number(item['set2_corner_score']?.split(':')[index])
            else
                return "0";
        }
        let str = "";
        if (prm == "")
            str = item;
        else
            str = item[prm];
        if (str) {
            return str.split(':')[index];
        } else {
            return '0';
        }
    }

    counter(i: number) {
        return new Array(i);
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
    public getPercent(item: any, itemName: string) {
        let str = "";
        let team1 = 0;
        let team2 = 0;
        if (itemName === "yellow_card_score") {
            if (item['set1_yellow_card_score'] && item['set2_yellow_card_score']) {
                team1 = Number(item['set1_yellow_card_score'].split(':')[0]) + Number(item['set2_yellow_card_score'].split(':')[0])
                team2 = Number(item['set1_yellow_card_score'].split(':')[1]) + Number(item['set2_yellow_card_score'].split(':')[1])
            }
        } else if (itemName === "red_card_score") {
            if (item['set1_red_card_score'] && item['set2_red_card_score']) {
                team1 = Number(item['set1_red_card_score'].split(':')[0]) + Number(item['set2_red_card_score'].split(':')[0])
                team2 = Number(item['set1_red_card_score'].split(':')[1]) + Number(item['set2_red_card_score'].split(':')[1])
            }
        } else if (itemName === "corner_score") {
            if (item['set1_corner_score'] && item['set2_corner_score']) {
                team1 = Number(item['set1_corner_score'].split(':')[0]) + Number(item['set2_corner_score'].split(':')[0])
                team2 = Number(item['set1_corner_score'].split(':')[1]) + Number(item['set2_corner_score'].split(':')[1])
            }
        } else {
            str = item[itemName];
            if (str) {
                team1 = Number(str.split(':')[0]);
                team2 = Number(str.split(':')[1]);
            }
            else {
                return 50;
            }
        }
        if (team1 == team2) return '50';
        let percent = (team2 / (team1 + team2)) * 100
        return percent;
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

    public selectedEvent(event: IUser, percent: any): void {
        if (percent.price === '0.00') {
            return;
        }
        const matchPrice = new MatchPrice();
        matchPrice.event = this.matchDetail;

        matchPrice.price = percent;
        matchPrice.banko = false;
        matchPrice.lock = false;
        matchPrice.chk = false;
        matchPrice.couponCount = 0;
        matchPrice.couponCalc = 0;
        let list = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!list) {
            list = [];
        }
        let isAdded = true;
        list.forEach((item) => {
            if (item.event.id === event.event_id) {
                item.event = this.matchDetail;
                item.price = percent;
                isAdded = false;
            }
        });

        if (isAdded) {
            list.push(matchPrice);
        }
        sessionStorage.setItem('matchPrice', JSON.stringify(list));
    }
}
