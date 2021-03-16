import { Component, OnInit } from '@angular/core';
import { MockData } from '../../constants/mock-data';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from './dashboard.service';
import { MatchPrice } from '../../core/models/matchPrice';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { Router } from '@angular/router';
import { GetUsers } from '../../store/actions/user.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    selectedTabIndex: number | null = 0;
    bxViewcolumnDefs = MockData.agGridColumnDefs_homeScreen;
    bxViewrowData = MockData.agGridRowDefs_homeScreen;
    workFlowViewcolumnDefs = [];
    workFlowViewrowData = [];
    dialogConfiguration = {
        width: '2000px',
        height: '900px',
        data: null,
        disableClose: true,
    };
    isShow: boolean;
    searchkey: String;
    public list: MatchPrice[];
    constructor(private _store: Store<IAppState>,
        private _router: Router,
        public translate: TranslateService,
        private readonly router: Router,
        public dialog: MatDialog,
        private store: Store<IAppState>,
        public dashboardService: DashboardService) {
        if (!sessionStorage.getItem('matchPrice')) {
            this.list = [];
            sessionStorage.setItem('matchPrice', JSON.stringify([]));
        } else {
            this.list = JSON.parse(sessionStorage.getItem('matchPrice'));
        }
        let t: any[];



    }
    ngOnInit() {
        this.searchkey = sessionStorage.getItem('search');
    }

    onAddTowerClick($event: any) {
        this.openDialog();
    }

    openDialog() { }


    public live(): void {
        sessionStorage.setItem('isShowLive', 'X');
        this.router.navigate(['/result']);

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
}
