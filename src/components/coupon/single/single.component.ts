import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { MatchPrice } from '../../../core/models/matchPrice';
import { NewCoupon } from '../../../core/models/coupon';
import { ApiService } from '../../../services/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EventService } from '../../../EventService';

@Component({
    selector: 'app-single',
    templateUrl: './single.component.html',
    styleUrls: ['./single.component.css'],
})
export class SingleComponent implements OnInit {
    @Input()
    isActive: boolean;
    constructor(private readonly api: ApiService, private changeDetector: ChangeDetectorRef,
        private eventService: EventService, private readonly ngxService: NgxUiLoaderService, public toastr: ToastrManager) { }
    public sending: boolean = false;
    public chckNext: boolean = false;
    // tslint:disable-next-line: member-ordering
    public percent: string = '';
    // tslint:disable-next-line: member-ordering
    public percentAll: string = '1';
    // tslint:disable-next-line: member-ordering
    public quantity: string = '0';

    // tslint:disable-next-line: member-ordering
    public listOrj: MatchPrice[];
    public odds: number[];
    public isLoading: boolean = false;
    public isErrorMsg: boolean = false;
    public isSuccesMsg: boolean = false;
    public errorMsg: string;
    public max: string;
    public isChanged: boolean = false;
    ngOnInit(): void {
        this.isLoading = true;
        this.eventService.GetEvent('wsmarketupdated').subscribe(data => {
            if (!this.isActive) return;
            this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
            this.listOrj.forEach(u => {
                var odd = data.odds.filter(k => k.id === u.price.id);
                if (odd && odd.length > 0) {
                    if (u.price.price != odd[0].price) {
                        this.isChanged = true;
                    }
                    u.price.price = odd[0].price;
                    sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
                }
            })

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

    public getSelectedEvent(): MatchPrice[] {
        this.percent = '1';
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (this.listOrj && this.listOrj.length > 0)
            this.percent = '' + this.listOrj[0].price.price;

        this.percentAll = '' + (parseFloat(this.quantity) * parseFloat(this.percent)).toFixed(2);
        this.max = this.percentAll;
        return this.listOrj ?? [];
    }

    public wait() {

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
        const coupon = new NewCoupon();
        coupon.state = 1;
        coupon.stake = parseFloat(this.quantity);
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
                this.deleteAllItem();

                this.isSuccesMsg = true;
                setTimeout(() => {
                    this.isSuccesMsg = false;
                    this.isErrorMsg = false;
                    this.sending = false;
                }, 2000);
            },
            (error) => {
                this.errorMsg = error;
                this.isErrorMsg = true;
                this.sending = false;
            }
        );
    }
    public delete(selectedItem: any) {
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.listOrj = this.listOrj.filter((item) => item.price.id !== selectedItem.price.id);
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
    }
    public changeM(e): void {
        this.quantity = e.target.value;
        this.percentAll = '' + (parseFloat(e.target.value) * parseFloat(this.percent)).toFixed(2);
    }
    public deleteAllItem() {
        this.listOrj = [];
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
    }
    public checkNext(values: any) {
        this.chckNext = values.target.checked;
    }

    public noBets(): boolean {
        let listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!listOrj || listOrj.length === 0) return true;
        return false;
    }
}
