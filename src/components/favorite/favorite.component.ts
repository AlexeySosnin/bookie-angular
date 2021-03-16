import { Highlights } from '../../core/models/highlights';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sport } from '../../core/models/sport';
import { Region } from '../../core/models/region';
import { Leagues } from '../../core/models/leagues';
import { ApiService } from '../../services/api.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from '../../store/state/app.state';
import { selectUserList } from '../../store/selectors/user.selector';
import { GetUsers } from '../../store/actions/user.actions';
import { User } from '../../core/models/user';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Evend } from '../../core/models/evend';
import { EventService } from '../../EventService';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  count$: Observable<number>;
  public sport: Sport[];
  public highlights: Highlights;
  public regions: Region[];
  public leagues: Leagues[];
  public events: Event[];
  public user: User;
  public users$ = this.store.pipe(select(selectUserList));
  public isLoading: boolean = false;
  public chckNext: string;
  public favoriEvent: Evend[];


  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private changeDetector: ChangeDetectorRef,
    private eventService: EventService,
    private readonly ngxService: NgxUiLoaderService,
    public toastr: ToastrManager,
    private store: Store<IAppState>) {
    setInterval(() => {
      this.favoriEvent = JSON.parse(sessionStorage.getItem('matchFavorite'));
      if (this.favoriEvent && this.favoriEvent.length > 0) {
        this.api.checkFavorites(this.favoriEvent.map(u => u.id).toString()).subscribe(r => {
          var completed = r.data.filter(u => u.status == 2).map(e => e.id);
          if (completed && completed.length > 0) {
            this.favoriEvent = this.favoriEvent.filter(e => !completed.includes(e.id));
            sessionStorage.setItem('matchFavorite', JSON.stringify(this.favoriEvent));
          }
        })
      }
    }, 15000)
  }

  ngOnInit(): void {

  }

  public getEventDetail(event: Evend): void {
    this.router.navigate(['/event-detail/' + event.id]);
  }

  public deleteFavorite(event: Evend) {
    this.favoriEvent = JSON.parse(sessionStorage.getItem('matchFavorite'));
    this.favoriEvent = this.favoriEvent.filter(item => item.id !== event.id);
    sessionStorage.setItem('matchFavorite', JSON.stringify(this.favoriEvent));
    this.toastr.warningToastr('', event.name + ' Favorilerden çıkarıldı');

  }
  public favoriEventFunc(): Evend[] {
    this.favoriEvent = JSON.parse(sessionStorage.getItem('matchFavorite'));
    return this.favoriEvent;
  }

}
