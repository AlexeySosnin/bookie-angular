import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { IUser } from '../../core/models/user.interface';
import { MatchPrice } from '../../core/models/matchPrice';
import { Sport } from '../../core/models/sport';
import { Leagues } from '../../core/models/leagues';
import { Evend } from '../../core/models/evend';
import { ApiService } from '../../services/api.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { Router } from '@angular/router';
import { Highlights } from '../../core/models/highlights';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Upcoming } from '../../core/models/upcoming';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GetUsers } from '../../store/actions/user.actions';
import { Region } from '../../core/models/region';
import { FormControl } from '@angular/forms';


export interface Message {
  author: string;
  message: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  public sports: Sport[];
  public regions: Region[];
  public sport : any;
  public region : any;
  public list: any[];
  public isLoading: boolean;
  public evenDetail: any[];

  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private store: Store<IAppState>,
    private readonly ngxService: NgxUiLoaderService
  ) {
    this.isLoading = false;
    api.sports(sessionStorage.getItem('hours')).subscribe(data => {
      this.sports = data.data;
      this.isLoading = true;
    });

    api.getTodayResults(1).subscribe(r => {
      this.list = r.data.map(x => { x.showDetail = false; return x; });
    })
  }


  ngOnInit(): void {

  }


  public load(): void {
    this.list = [];
    this.api.results(this.sport, this.region, '').subscribe(data => {

      this.list = data.data.map(x => { x.showDetail = false; return x; });
    })
  }

  public detail(item: any): void {

    this.api.results(item.id, '', '').subscribe(data => {
      this.list = data.data;
      this.list.forEach(item => {
        item.showDetail = false;
      })
    })

  }


  public eventDetail(item: any): void {


  }
  public showDetail(item: any) {
    if (item.showDetail) {
      this.list.forEach(item => {
        item.showDetail = false;
      })
      return;
    } else {
      this.list.forEach(item => {
        item.showDetail = false;
      })
      this.api.results_detail(item.id).subscribe(data => {
        this.evenDetail = data.data;
        item.showDetail = true;
      })



    }
  }
  public changeSport(val) {
    this.sport = val;
    this.region = "";
    this.regions = [];
    this.sports.forEach(item => {
      if (item.id == val) {
        this.regions.push(...item.regions);
      };
    });
  }

  public changeRegion(val) {
    this.region = val;
  }
}