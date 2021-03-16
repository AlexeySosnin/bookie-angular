import { Highlights } from '../../core/models/highlights';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; 
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { GetUsers } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-favorite-league',
  templateUrl: './favorite-league.component.html',
  styleUrls: ['./favorite-league.component.css']
})
export class FavoriteLeagueComponent implements OnInit {

  public highlights: Highlights;
  public  isLoading: boolean = false;

  
  constructor(private readonly api: ApiService,    
              private readonly router: Router,
              private readonly ngxService: NgxUiLoaderService,
              public toastr: ToastrManager,
              private store: Store<IAppState>) {
             
          
    api.highlights().subscribe(data => {
      this.highlights = data.data;
      this.isLoading  = true;
    });


  }

  ngOnInit(): void {

  }
  public getEvents(item: any): void {
    
    sessionStorage.setItem('search', '');
    sessionStorage.setItem('league_name', '' + item.name);
    sessionStorage.setItem('region_id', '' + item.region_id);
    sessionStorage.setItem('sport_id', '' + item.sport_id);
    sessionStorage.setItem('sport_name', '' + item.sport.name);
    this.store.dispatch(new GetUsers());
    
    this.router.navigate(['/dashboard']);
  }

  public openLeague(item) {
    sessionStorage.setItem('league_id', '' + item.id);
    sessionStorage.setItem('league_name', '');
    sessionStorage.setItem('region_id', '' + item.region.id);
    sessionStorage.setItem('region_name', '');
    sessionStorage.setItem('sport_id', '' + item.sport.id);
    sessionStorage.setItem('sport_name', '');
    this.store.dispatch(new GetUsers());
  }

}
