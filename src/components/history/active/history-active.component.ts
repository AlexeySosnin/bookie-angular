import { Highlights } from '../../../core/models/highlights';
import { Component, OnInit, Input } from '@angular/core';
import { Sport } from '../../../core/models/sport';
import { Region } from '../../../core/models/region';
import { Leagues } from '../../../core/models/leagues';
import { ApiService } from '../../../services/api.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../../store/state/app.state';
import { selectUserList } from '../../../store/selectors/user.selector';
import { GetUsers } from '../../../store/actions/user.actions';
import { User } from '../../../core/models/user';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Evend } from '../../../core/models/evend';
import { NewCoupon } from '../../../core/models/coupon';
import { FormControl } from '@angular/forms';

declare var $: any;
@Component({
  selector: 'app-history-active',
  templateUrl: './history-active2.component.html',
  styleUrls: ['./history-active.component.css']
})
export class HistoryActiveComponent implements OnInit {

  count$: Observable<number>;

  public history: NewCoupon[];

  public couponDetail: any;

  public detailShow: boolean = false;

  public status = new FormControl('');
  public month = new FormControl('');
  public year = new FormControl('');
  public isLoading: boolean = false;
  public isLogined: boolean = false;

  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private readonly ngxService: NgxUiLoaderService,
    public toastr: ToastrManager,
    private store: Store<IAppState>) {
    this.isLoading = false;
  }

  ngOnInit(): void {
    if (sessionStorage.hasOwnProperty('member')) {
      this.isLogined = true;
      this.month.patchValue(new Date().getMonth() + 1);
      this.year.patchValue(new Date().getFullYear());
      this.api.coupons(this.status.value, this.month.value, this.year.value).subscribe(data => {
        this.history = data.data;
        this.history.forEach(item => {
          item.showDetail = false;

        });
        this.isLoading = true;

      });
    } else {
      this.isLoading = true;
      this.isLogined = false;
    }

  }

  public GetPercent(item) {
    return Number(item.possible_win) / Number(item.stake)
  }
  public zebra(k: number): string {
    return k % 2 === 0 ? 'even' : 'odd';
  }

  public search(): void {
    this.api.coupons(this.status.value, this.month.value, this.year.value).subscribe(data => {
      this.history = data.data;
    });



  }
  public detailPage(item: any) {
    console.log(item);
    if (item.showDetail) {
      this.history.forEach(item => {
        item.showDetail = false;
      })
      return;
    } else {
      this.history.forEach(item => {
        item.showDetail = false;
      });
      this.api.coupon(item.id).subscribe(data => {
        this.couponDetail = data.data;
        item.showDetail = true;
      })
    }

  }
  public print(): void {
    //$('#printarea').print();
  }

}
