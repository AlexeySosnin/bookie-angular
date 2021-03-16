import { Highlights } from './../core/models/highlights';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../core/models/category';
import { RestResponse } from '../core/models/rest-response';
import { Region } from '../core/models/region';
import { Sport } from '../core/models/sport';
import { Leagues } from '../core/models/leagues';
import { Evend } from '../core/models/evend';
import { IUser } from '../core/models/user.interface';
import { IUserHttp } from '../core/models/http-models/user-http.interface';
import { Live } from '../core/models/live';
import { environment } from '../environments/environment';
import { NewCoupon } from '../core/models/coupon';
import { GroupEvent } from '../core/models/group';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly endpoint = 'api';

    constructor(private readonly httpClient: HttpClient) { }

    public sports(hours): Observable<RestResponse<Sport[]>> {

        let prm = window.location.href;
        let filter = '';
        if (!hours) {
            filter = '';
        } else if (parseInt(hours) === 24) {
            filter = "&coming_days=1";
        } else {
            filter = `&coming_hours=${hours}`;
        }
        if (prm.indexOf('live') > -1 || prm.indexOf('event-detail') > -1 || prm.indexOf('calendar') > -1) {
            filter = filter + '&event_state=live';
        } else {
            filter = filter + '&event_state=early';
        }
        return this.httpClient.get<RestResponse<Sport[]>>(`${environment.url}${this.endpoint}/sports?with_regions_and_leagues=true${filter}`);
    }
    public sport(id): Observable<RestResponse<Category[]>> {
        return this.httpClient.get<RestResponse<Category[]>>(`${environment.url}${this.endpoint}/sports/${id}`);
    }

    public regions(): Observable<RestResponse<Category[]>> {
        return this.httpClient.get<RestResponse<Category[]>>(`${environment.url}${this.endpoint}/regions`);
    }
    public region(id): Observable<RestResponse<Region[]>> {
        let prm = window.location.href;
        let filter = '';
        if (prm.indexOf('live') > -1 || prm.indexOf('event-detail') > -1) {
            filter = '&event_state=live';
        } else {
            filter = '&event_state=early';
        }
        return this.httpClient.get<RestResponse<Region[]>>(`${environment.url}${this.endpoint}/regions?sport_id=${id}${filter}`);
    }
    public leagues(): Observable<RestResponse<Category[]>> {
        return this.httpClient.get<RestResponse<Category[]>>(`${environment.url}${this.endpoint}/leagues`);
    }
    public league(sport_id, region_id): Observable<RestResponse<Leagues[]>> {
        return this.httpClient.get<RestResponse<Leagues[]>>(`${environment.url}${this.endpoint}/leagues?sport_id=${sport_id}&region_id=${region_id}`);
    }

    public events(): Observable<RestResponse<Category[]>> {
        return this.httpClient.get<RestResponse<Category[]>>(`${environment.url}${this.endpoint}/leagues`);
    }
    public eventDetail(event_id: string): Observable<RestResponse<Evend>> {
        return this.httpClient.get<RestResponse<Evend>>(`${environment.url}${this.endpoint}/events/${event_id}`);
    }
    public markets(event_id: string, group?: string): Observable<RestResponse<Live[]>> {
        let mType = '';
        if (group) {
            mType = '&group=' + group;
        }
        return this.httpClient.get<RestResponse<Live[]>>(`${environment.url}${this.endpoint}/markets?event_id=${event_id}${mType}`);
    }
    public market(market: string): Observable<RestResponse<Evend[]>> {
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/markets/${market}`);
    }
    public event(league_id, sport_id, region_id): Observable<RestResponse<Evend[]>> {
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/events?league_id=${league_id}&sport_id=${sport_id}&region_id=${region_id}`);
    }
    public results(sport_id: string, league_id?: string, region_id?: string): Observable<RestResponse<Evend[]>> {
        let filter = '';
        if (region_id) {
            filter = `&region_id=${region_id}`;
        }
        if (league_id) {
            filter = `&league_id=${league_id}`;
        }
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/results?sport_id=${sport_id}${filter}`);
    }
    public getTodayResults(sport_id: number): Observable<RestResponse<Evend[]>> {
        let filter = `&from=${new Date(new Date().setHours(0, 0, 0, 0)).toLocaleDateString("tr-TR")}&to=${new Date(new Date().setHours(0, 0, 0, 0)).toLocaleDateString("tr-TR")}`;
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/results?sport_id=${sport_id}${filter}`);
    }
    public results_detail(event_id): Observable<RestResponse<Evend[]>> {
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/results/${event_id}`);
    }
    public checkFavorites(eventids): Observable<RestResponse<any[]>> {
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/events/check?ids=${eventids}`);
    }
    public eventSport(sport_id): Observable<RestResponse<Evend[]>> {
        return this.httpClient.get<RestResponse<Evend[]>>(`${environment.url}${this.endpoint}/events?sport_id=${sport_id}`);
    }
    public featuredEvent(): Observable<RestResponse<Evend>> {
        return this.httpClient.get<RestResponse<Evend>>(`${environment.url}${this.endpoint}/events/featured`);
    }
    public filter(league_id: string, sport_id: string, region_id: string, hours: string, search: string): Observable<IUserHttp> {
        let prm = window.location.href;
        let filter = '';
        if (prm.indexOf('live') > -1) {
            filter = '&state=live';
            hours = null;
        } else {
            filter = '&state=early';
        }

        if (search) {
            return this.httpClient.get<IUserHttp>(`${environment.url}${this.endpoint}/events/search?group_by=league|date&q=${search}&`);
        } else {
            if (league_id) {
                if (league_id === '0') {
                    sessionStorage.removeItem('league_id');
                }
                else if (league_id.length > 0) {
                    filter = filter + '&league_id=' + league_id.replace('0,', '');
                }
            }
            if (sport_id)
                if (sport_id.length > 0) {
                    filter = filter + '&sport_id=' + sport_id;
                }
            if (region_id)
                if (region_id.length > 0) {
                    filter = filter + '&region_id=' + region_id;
                }
            if (!hours) {
                return this.httpClient.get<IUserHttp>(`${environment.url}${this.endpoint}/events?group_by=league|date${filter}`);
            } else if (parseInt(hours) === 24) {
                return this.httpClient.get<IUserHttp>(`${environment.url}${this.endpoint}/events?group_by=league|date${filter}&coming_days=1`);
            } else {
                return this.httpClient.get<IUserHttp>(`${environment.url}${this.endpoint}/events?group_by=league|date${filter}&coming_hours=${hours}`);
            }
        }
    }

    public group(league_id: string, sport_id: string, region_id: string, hours: string, search: string, live?: boolean, isCalendar?: boolean): Observable<RestResponse<GroupEvent[]>> {
        let filter = '';
        if (live) {
            filter = '&state=live';
        }

        if (search) {
            return this.httpClient.get<RestResponse<GroupEvent[]>>(`${environment.url}${this.endpoint}/events/${isCalendar ? '/calendar/' : ''}search?group_by=date&q=${search}${filter}`);
        } else {
            if (league_id)
                if (league_id.length > 0) {
                    filter = filter + '&league_id=' + league_id.replace('0,', '');
                }
            if (sport_id)
                if (sport_id.length > 0) {
                    filter = filter + '&sport_id=' + sport_id;
                }
            if (region_id)
                if (region_id.length > 0) {
                    filter = filter + '&region_id=' + region_id;
                }
            if (!hours) {
                return this.httpClient.get<RestResponse<GroupEvent[]>>(`${environment.url}${this.endpoint}/events${isCalendar ? '/calendar' : ''}?group_by=date${filter}`);
            } else if (parseInt(hours) === 24) {
                return this.httpClient.get<RestResponse<GroupEvent[]>>(`${environment.url}${this.endpoint}/events${isCalendar ? '/calendar' : ''}?group_by=date${filter}&coming_days=1`);
            } else {
                return this.httpClient.get<RestResponse<GroupEvent[]>>(`${environment.url}${this.endpoint}/events${isCalendar ? '/calendar' : ''}?group_by=date${filter}&coming_hours=${hours}`);
            }
        }
    }
    public eventFilter(league_id: string, sport_id: string, region_id: string, hours: string, search: string): Observable<RestResponse<any[]>> {
        if (search) {
            return this.httpClient.get<RestResponse<any[]>>(`${environment.url}${this.endpoint}/events/search?q=${search}`);
        } else {
            if (parseInt(hours) === 24) {
                return this.httpClient.get<RestResponse<any[]>>(
                    `${environment.url}${this.endpoint}/events?league_id=${league_id}&sport_id=${sport_id}&region_id=${region_id}&coming_days=1`
                );
            } else {
                return this.httpClient.get<RestResponse<any[]>>(
                    `${environment.url}${this.endpoint}/events?league_id=${league_id}&sport_id=${sport_id}&region_id=${region_id}&coming_hours=${hours}`
                );
            }
        }
    }
    public live(league_id: string, sport_id: string, region_id: string): Observable<RestResponse<any[]>> {
        let filter = '';
        if (league_id.length > 0) {
            filter = filter + '&league_id=' + league_id.replace('0,', '');
        }
        if (sport_id.length > 0) {
            filter = filter + '&sport_id=' + sport_id;
        }
        if (region_id.length > 0) {
            filter = filter + '&region_id=' + region_id;
        }
        return this.httpClient.get<RestResponse<any[]>>(`${environment.url}${this.endpoint}/events?state=live${filter}`);
    }
    public create(coupon: any): Observable<IUserHttp> {
        coupon.token = sessionStorage.getItem('member');
        let od = '0';
        coupon.odds.forEach((item) => {
            od = od + ',' + item;
        });
        od = od.replace('0,', '');
        coupon.odds = od;
        if (coupon.system) {
            let sys = '0';
            coupon.system.forEach((item) => {
                sys = sys + ',' + item;
            });
            sys = sys.replace('0,', '');
            coupon.system = sys;
        }
        var queryString = Object.keys(coupon)
            .map((key) => key + '=' + coupon[key])
            .join('&');

        return this.httpClient.post<IUserHttp>(`${environment.url}${this.endpoint}/coupons`, coupon);
    }
    public cashOut(cashOut: any): Observable<IUserHttp> {
        return this.httpClient.post<IUserHttp>(`${environment.url}${this.endpoint}/cash_out`, cashOut);
    }
    public coupons(status?: string, month?: string, year?: string): Observable<RestResponse<NewCoupon[]>> {
        let filter = '';
        if (status) {
            filter = filter + '&status=' + status;
        }
        if (month) {
            filter = filter + '&month=' + month;
        }
        if (year) {
            filter = filter + '&year=' + year;
        }
        if (sessionStorage.getItem('member')) {
            return this.httpClient.get<RestResponse<NewCoupon[]>>(`${environment.url}${this.endpoint}/coupons?token=${sessionStorage.getItem('member')}${filter}`);
        }
    }
    public coupon(id: string): Observable<RestResponse<NewCoupon[]>> {
        return this.httpClient.get<RestResponse<NewCoupon[]>>(`${environment.url}${this.endpoint}/coupons/${id}`);
    }
    public couponCreated(): Observable<RestResponse<NewCoupon[]>> {
        if (sessionStorage.getItem('member')) {
            return this.httpClient.get<RestResponse<NewCoupon[]>>(`${environment.url}${this.endpoint}/coupons?status=eventuated&token=${sessionStorage.getItem('member')}`);
        } else {
            return this.httpClient.get<RestResponse<NewCoupon[]>>(`${environment.url}${this.endpoint}/coupons?status=eventuated`);
        }
    }
    public highlights(): Observable<RestResponse<Highlights>> {
        if (sessionStorage.getItem('member')) {
            return this.httpClient.get<RestResponse<Highlights>>(`${environment.url}${this.endpoint}/highlights?token=${sessionStorage.getItem('member')}`);
        } else {
            return this.httpClient.get<RestResponse<Highlights>>(`${environment.url}${this.endpoint}/highlights`);
        }
    }

    public last_winners(): Observable<RestResponse<any>> {
        if (sessionStorage.getItem('member')) {
            return this.httpClient.get<RestResponse<any>>(`${environment.url}${this.endpoint}/highlights?token=${sessionStorage.getItem('member')}`);
        } else {
            return this.httpClient.get<RestResponse<any>>(`${environment.url}${this.endpoint}/highlights`);
        }
    }
}
