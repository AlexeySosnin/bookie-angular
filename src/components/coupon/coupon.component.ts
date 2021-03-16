import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Evend } from '../../core/models/evend';
import { Coupon } from '../../core/models/coupon.interface';
import { ApiService } from '../../services/api.service';
import { NewCoupon } from '../../core/models/coupon';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MdialogComponent } from './mdialog/mdialog.component';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { EventService } from '../../EventService';

(window as any).global = window;

declare global {
    interface Window {
        io: any;
    }
    interface Window {
        Echo: any;
    }
    interface Window {
        Pusher: any;
    }
}
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'sportsbook',
    wsHost: '88.99.55.247',
    wsPort: 6001,
    wssPort: 6001,
    encrypted: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.css'],
})
export class CouponComponent implements OnInit {
    @Input()
    list: Coupon[];

    @Input()
    isShow: boolean;

    public isLive: boolean;

    public last_winners: any[];

    public history: NewCoupon[];
    public activeTab: string;
    public activeTabCash: string;
    public winners: any[];
    public selectedCoupon: any;

    @Output()
    userSelected: EventEmitter<number> = new EventEmitter();
    public currentEvent: Observable<Evend>;
    constructor(
        private eventService: EventService,
        private readonly api: ApiService,
        private changeDetector: ChangeDetectorRef,
        private readonly router: Router,
        public dialog: MatDialog
    ) {
        this.activeTab = 'single';
        this.activeTabCash = 'coupon';

        if (sessionStorage.getItem('member'))
            this.api.coupons().subscribe((data) => {
                this.history = data.data;
            });

        this.api.last_winners().subscribe((data) => {
            this.winners = data.data.most_winners;
        });
        const list = JSON.parse(sessionStorage.getItem('matchPrice'))
        this.checkCouponList(list);
        list.forEach(element => {
            this.connectToWebSocket(element.event.id);
        });
        this.eventService.GetEvent('newsocketeventid').subscribe(data => {
            this.connectToWebSocket(data);
        });
         if(list.length ==1) {
            this.activeTab = 'single';
        } else {
            this.activeTab = 'combined';
        }

    }

    public checkCouponList(list) {
      if (list && list.length > 0) {
        this.api.checkFavorites(list.map(u => u.event.id).toString()).subscribe(r => {
          var completed = r.data.filter(u => u.status == 2).map(e => e.id);
          if (completed && completed.length > 0) {
            list = list.filter(e => !completed.includes(e.event.id));
            sessionStorage.setItem('matchPrice', JSON.stringify(list));
          }
        })
      }
    }

    public connectToWebSocket(id) {
        window.Echo
        .channel(`brand-channel-${id}`)
        .listen('.market.update', e => {
            this.eventService.BroadcastEvent('wsmarketupdated', e);
        })
        .listen('.event.update', e => {
            this.eventService.BroadcastEvent('wseventupdated', e);
        })
    }
    public openDialog(item: any): void {
        this.selectedCoupon = item;
        const dialogRef = this.dialog.open(MdialogComponent, {
            width: '250px',
            autoFocus: true,
            disableClose: true,
            data: item,
        });

        dialogRef.afterClosed().subscribe((result) => { });
    }

    historyPage(): void {
        this.router.navigate(['/history']);
    }
    highligth(): boolean {
        let prm = window.location.href;
        if (prm.indexOf('live') > -1 || prm.indexOf('event-detail') > -1) {
            return false;
        } else {
            return true;
        }
    }
    ngOnInit(): void {
        let currentLocation = '' + window.location;
        if (currentLocation.indexOf('event-detail') > -1) {
            this.isLive = true;
        } else {
            this.isLive = false;
        }
    }
    public changeTab(tab: string): void {
        let listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if(listOrj.length > 2 && tab === 'system') {
            this.activeTab = tab;
        } else if(listOrj.length ==1) {
            this.activeTab = 'single';
        } else if((listOrj.length > 1 && tab == 'single') || (listOrj.length == 1 && tab != 'single')) {return}
        else {
            this.activeTab = 'combined';
        }
        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    public getClass(id: string): string {
        let listOrj = JSON.parse(sessionStorage.getItem('matchPrice'));
        if (listOrj && listOrj.length > 1 && this.activeTab === 'single') {
            this.changeTab('combined');
        }
        if (listOrj && listOrj.length === 2 && this.activeTab === 'system') {
            this.changeTab('combined');
        }
        if (listOrj && listOrj.length === 1 && this.activeTab === 'combined') {
            this.changeTab('single');
        }
        
        if (this.activeTab === id) {
            return 'tab-nav-item tab-nav-item-1 ui-state-default ui-corner-top  ui-tabs-selected ui-state-active';
        } else {
            return 'tab-nav-item tab-nav-item-1 ui-state-default ui-corner-top';
        }
    }
    public hideTab(id: string): string {
        if (this.activeTab === id) {
            return 'betcart-pane ui-tabs-panel ui-widget-content ui-corner-bottom';
        } else {
            return 'betcart-pane ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide';
        }
    }

    public activeTabFnc(tab: string) {
        this.activeTabCash = tab;
    }

    public activeTabFncClass(tab: string): string {
        if (this.activeTabCash === tab) {
            return 'dec_txt betcard';
        } else {
            return 'g-right my-bets';
        }
    }
    public showActiveTab(tab: string): boolean {
        if (this.activeTabCash === tab) {
            return true;
        } else {
            return false;
        }
    }
}
