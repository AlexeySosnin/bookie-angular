import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-cashout',
  templateUrl: './cashout.component.html',
  styleUrls: ['./cashout.component.css']
})
export class CashoutComponent implements OnInit {

  public cashout: any[];

  constructor(private readonly api: ApiService, public toastr: ToastrManager) {


    api.couponCreated().subscribe(data => {
      this.cashout = data.data;
    });


  }
  public cashOut(item: any) {
    let cash = {
      coupon_id: item.id,
      token: sessionStorage.getItem('member')
    };

    this.api.cashOut(cash).subscribe(data => {
      this.toastr.warningToastr('', data.message);
    }, error => {
      this.toastr.warningToastr('', error);
    })
  }
  ngOnInit(): void {
  }

}
