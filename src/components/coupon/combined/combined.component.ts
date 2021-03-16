import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { MatchPrice } from '../../../core/models/matchPrice';
import { NewCoupon } from '../../../core/models/coupon';
import { ApiService } from '../../../services/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EventService } from '../../../EventService';

@Component({
    selector: 'app-combined',
    templateUrl: './combined.component.html',
    styleUrls: ['./combined.component.css'],
})
export class CombinedComponent implements OnInit {
    @Input()
    isActive: boolean = false;
    public chckNext: boolean = false;
    public max: number;
    public countCoupon: string;
    public isChanged: boolean = false;

    constructor(private readonly api: ApiService, private changeDetector: ChangeDetectorRef,
        private eventService: EventService, private readonly ngxService: NgxUiLoaderService, public toastr: ToastrManager) { }

    ngOnInit(): void {
        this.eventService.GetEvent('wsmarketupdated').subscribe(data => {
            if (!this.isActive) return;
            this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
            this.listOrj.forEach(u => {
                var odd = data.odds.filter(k => k.id === u.price.id);
                if (odd && odd.length > 0) {
                    if (u.price.price != odd[0].price) {
                        console.log(this.isChanged);
                        this.isChanged = true;
                    }
                    u.price.price = odd[0].price;
                }
            })
            sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        });

        this.eventService.GetEvent('wseventupdated').subscribe(data => {
            data.events.forEach(event => {
                var finishedEvent = this.listOrj.filter(u => u.event.id == event.id && event.status == 2);
                if (finishedEvent && finishedEvent.length > 0) {
                    this.listOrj = this.listOrj.filter(u => u.event.id != finishedEvent[0].event.id)
                    sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
                    if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                        this.changeDetector.detectChanges();
                    }
                }

            });
        });
    }
    public percent: number = 0;
    public count: number;
    public percentAll: number = 0;
    public quantity: string = '0';

    public listOrj: MatchPrice[];
    public odds: number[];
    public isLoading: boolean = false;
    public isErrorMsg: boolean = false;
    public errorMsg: string;
    public isSuccesMsg: boolean = false;
    public activeTab: string;
    public sending: boolean = false;

    public getSelectedEvent(): MatchPrice[] {
        this.percent = 1;
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));

        this.countCoupon = '' + this.listOrj.length;
        this.listOrj.forEach((item) => {
            this.percent = Number(item.price.price) * Number(this.percent);
        });
        this.percentAll = Number(this.quantity) * Number(this.percent);
        this.max = this.percentAll;
        if (this.listOrj.length > 0) {
            this.isSuccesMsg = false;
        }
        return this.listOrj;
    }

    public noBets(): boolean {
        let listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!listOrj || listOrj.length === 0) return true;
        return false;
    }
    public next(): void {
        console.log(this.isChanged);
        if (!this.chckNext && this.isChanged) {
            this.errorMsg = "Oran değişimini kabul etmeniz gerekmektedir.";
            this.isErrorMsg = true;
            this.sending = false;
            return;
        }
        if (!sessionStorage.hasOwnProperty('member') && sessionStorage.getItem('member') === null) {
            this.errorMsg = "Invalid User";
            this.isErrorMsg = true;
            this.sending = false;
            return;
        }
        this.sending = true;
        let coupon = new NewCoupon();
        coupon.state = 2;
        coupon.stake = Number(this.quantity);
        coupon.is_changes_accepted = true;

        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.odds = [];
        this.listOrj.forEach((item) => {
            this.odds.push(item.price.id);
        });
        coupon.odds = this.odds;
        this.api.create(coupon).subscribe(
            (data) => {
                this.errorMsg = data.message;
                this.isSuccesMsg = true;
                this.isErrorMsg = false;
                this.sending = false;
                this.deleteAllItem();
            },
            (error) => {
                this.errorMsg = error;
                this.isErrorMsg = true;
                this.sending = false;
            }
        );
    }
    public wait() {

    }
    public delete(selectedItem: any) {
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.listOrj = this.listOrj.filter((item) => item.price.id !== selectedItem.price.id);
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
    }
    public changeM(e): void {
        this.quantity = e.target.value;
        this.percentAll = Number(e.target.value) * this.percent;
    }
    public deleteAllItem() {
        this.listOrj = [];
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
    }
    public checkNext(values: any) {
        this.chckNext = values.target.checked;
    }
    public getActiveClass(tab: string): string {
        if (this.activeTab === tab) {
            return 'nav-wrap-li b-livetabs__item  ui-state-active tabs-active';
        } else {
            return 'nav-wrap-li b-livetabs__item  ui-state-active';
        }
    }
}
