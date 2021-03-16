import { ChangeDetectorRef, Component, Input, OnInit, ViewRef } from '@angular/core';
import { MatchPrice } from '../../../core/models/matchPrice';
import { NewCoupon } from '../../../core/models/coupon';
import { ApiService } from '../../../services/api.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { EventService } from '../../../EventService';

@Component({
    selector: 'app-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.css'],
})
export class SystemComponent implements OnInit {
    @Input()
    isActive: boolean;
    public sending: boolean = false;
    public chckNext: boolean = false;
    public oran1: boolean = false;
    public oran2: boolean = false;
    public oran3: boolean = false;
    form: FormGroup;
    public oranCalc1: number;
    public oranCalc2: number;
    public oranCalc3: number;
    public oranLbl1: string = 'Sistem 1/ 3';
    public oranLbl2: string = 'Sistem 2/ 3';
    public oranLbl3: string = 'Sistem 3/ 3';
    public isSuccesMsg: boolean = false;
    public max: number;
    public percent: number;
    public percentAll: number;
    public banko: boolean = false;
    public oran3IsShow: boolean = true;
    public toplamKuponSay: number = 0;
    public bankoCount: number = 0;
    public isChanged: boolean = false;

    constructor(private readonly api: ApiService, private changeDetector: ChangeDetectorRef,
        private eventService: EventService) {
        this.oranCalc1 = 0;
        this.oranCalc2 = 0;
        this.oranCalc3 = 0;
        this.max = 0;
    }

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

    public count: number;

    public quantity: number = 1;

    public listOrj: MatchPrice[];
    public odds: number[];
    public isLoading: boolean = false;
    public isErrorMsg: boolean = false;
    public errorMsg: string;

    public getSelectedEventv3(): MatchPrice[] {
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        let tmp = this.listOrj.filter((item) => item.couponCount > 0);
        this.bankoCount = this.listOrj.filter(u => u.banko == true).length;

        return tmp;
    }

    public getSelectedEventv2(): MatchPrice[] {
        //this.percent = 1;
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        /*this.percent = this.listOrj.length;

        this.percentAll = this.quantity * this.percent;*/
        if (this.listOrj.length > 0) {
            this.isSuccesMsg = false;
            //  this.isErrorMsg  = false;
        }
        this.listOrj.forEach((item, index) => {
            let calPercent = this.subItem(this.listOrj, index);
            for (let index = 0; index < calPercent.length; index++) {
                item.couponCount = calPercent.length;
            }
        });
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
        let ik = this.listOrj.filter((item) => !item.banko).length;
        return this.listOrj;
    }

    public getSelectedEvent(): MatchPrice[] {
        //this.percent = 1;
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        /*this.percent = this.listOrj.length;

        this.percentAll = this.quantity * this.percent;*/
        if (this.listOrj.length > 0) {
            this.isSuccesMsg = false;
            //  this.isErrorMsg  = false;
        }
        this.listOrj.forEach((item, index) => {
            let calPercent = this.subItem(this.listOrj, index);
            for (let index = 0; index < calPercent.length; index++) {
                item.couponCount = calPercent.length;
            }
        });
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));

        return this.listOrj;
    }

    public noBets(): boolean {
        let listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (!listOrj || listOrj.length === 0) return true;
        return false;
    }

    public wait() {

    }
    public next(): void {
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
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.odds = [];
        let checkOption = true;
        let coupon = new NewCoupon();
        coupon.state = 3;

        coupon.system = [];
        coupon.counters = [];
        this.listOrj.forEach((item, k) => {
            if (item.chk) {
                coupon.is_changes_accepted = true;
                checkOption = false;
                coupon.system.push(k + '/' + this.getSelectedEventv3().length);
            }
            if (item.banko) {
                coupon.counters.push(item.price.id);
            }
            this.odds.push(item.price.id);
        });
        if (checkOption) {
            this.errorMsg = 'Lütfen Oran seçiniz';
            this.isErrorMsg = true;
            return;
        }

        coupon.odds = this.odds;
        coupon.stake = this.percentAll;
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
    public delete(selectedItem: any) {
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.listOrj = this.listOrj.filter((item) => item.price.id !== selectedItem.price.id);
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
    }
    public deleteAllItem() {
        this.listOrj = [];
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
        this.calcPrm();
    }
    public changeM(e): void {
        this.quantity = e.target.value;
        this.percentAll = parseFloat(e.target.value) * this.percent;
        //    this.calc();
        this.calcPrm();
    }
    public checkNextPrm(values: any, item: MatchPrice, k: number) {
        this.isLoading = false;
        item.chk = values.target.checked;
        this.listOrj.forEach((it) => {
            if (item.event.id === it.event.id) {
                it.chk = item.chk;
                this.percent = item.couponCount;
                this.percentAll = Number(item.couponCount) * Number(this.quantity);

            } else {
                it.chk = false;
            }
        });
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
        this.isLoading = true;
        this.calcPrm();
    }

    public subItem(arra: any[], limit: number): string[] {
        var result_set = [],
            result;

        arra = arra.filter((item) => !item.banko);
        for (var x = 0; x < Math.pow(2, arra.length); x++) {
            result = [];
            let i = arra.length - 1;
            do {
                if ((x & (1 << i)) !== 0) {
                    result.push(arra[i].price.price);
                }
            } while (i--);

            if (result.length >= limit) {
                result_set.push(result);
            }
        }
        let newList = [];
        result_set.forEach((item) => {
            if (item.length === limit) {
                newList.push(item);
            }
        });

        return newList;
    }
    public bankoCheck(bnk: any): void {
        if (!bnk.banko) {
            //banko seçili hesaplamaları buna göre yapalım
            this.banko = !bnk.banko;
        }
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        this.listOrj.forEach((item, index) => {
            item.lock = false;
            if (item.event.id === bnk.event.id) {
                item.banko = !bnk.banko;
            }
        });

        let countBanko = this.listOrj.filter((banko) => banko.banko);
        if (countBanko.length === this.listOrj.length - 2 && !bnk.banko) {
            this.listOrj.forEach((item) => {
                if (item.event.id != bnk.event.id && !item.banko) {
                    item.lock = true;
                }
            });
        }
        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
        this.calcPrm();
    }
    public calcPrm() {
        this.listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));

        let oranCount = 0;
        let sumCount = 0;
        let bankoOran = 1;
        this.listOrj.forEach((it, index) => {
            it.couponCalc = 0;
            let calPercent = this.subItem(this.listOrj, index);
            it.couponCount = calPercent.length;

            if (it.chk) {
                oranCount++;
                if (!it.banko) {
                }
                sumCount = sumCount + it.couponCount;
            }
            if (it.banko) {
                bankoOran = bankoOran * Number(it.price.price);
            }
        });
        this.max = 0;
        this.listOrj.forEach((item, index) => {
            if (!item.chk) {
                item.couponCalc = 0;
            }
            if (item.chk) {
                let calPercent = this.subItem(this.listOrj, index);

                let s = 1;
                let sum = 0;
                let allPrice = 0;
                for (let index = 0; index < calPercent.length; index++) {
                    const element = calPercent[index];

                    s = 1;

                    for (let k = 0; k < element.length; k++) {
                        s = s * Number(element[k]);
                    }
                    allPrice = allPrice + bankoOran * s;
                    s = bankoOran * s * Number(this.quantity / sumCount) * Number(sumCount);
                    sum = sum + s;
                }
                item.couponCalc = sum;
                item.allPrice = allPrice;
            }
            this.max = Number(this.max) + Number(item.couponCalc);
            console.log(this.percent, this.percentAll, this.max);
        });

        sessionStorage.setItem('matchPrice', JSON.stringify(this.listOrj));
        this.isLoading = true;
        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    public checkNext(values: any) {
        this.chckNext = values.target.checked;
    }

    public getCheck(item: any): string {
        if (item.banko) {
            return 'checked';
        } else {
            return '';
        }
    }
    public allPossibleCombinationsSub(length: number, level: number): string {
        let rtn = '';
        let levelSub = 0;
        for (let index = length; index < this.listOrj.length; index++) {
            if (level >= levelSub) {
                return;
            } else {
                rtn = rtn + ' * ' + this.listOrj[index].price.price;
            }
            levelSub++;
        }

        return rtn;
    }
    public getShow(item: any): boolean {
        //return true;

        if (item.lock) {
            return false;
        } else {
            return true;
        }
    }
}
