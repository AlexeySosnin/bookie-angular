import { Highlights } from '../../core/models/highlights';
import { ChangeDetectorRef, Component, OnInit, ViewRef } from '@angular/core';
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
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  public sport: Sport[];
  public selectedSport: Sport;
  public events: Evend[];
  public eventsOrj: Evend[];
  public favoriEvent: Evend[];

  constructor(private readonly api: ApiService,
    private readonly router: Router,
    private readonly ngxService: NgxUiLoaderService,
    public toastr: ToastrManager,
    private changeDetector: ChangeDetectorRef,
    private eventService: EventService,
    private store: Store<IAppState>) {

    let _cont = this;
    api.sports(null).subscribe(data => {
      this.sport = data.data;
      if (this.sport) {
        this.sport.forEach((item, index) => {
          if (index === 0) {
            item.show = true;
            _cont.selectedSport = item;
          } else {
            item.show = false;

          }
        });
      }
    });

    this.eventService.GetEvent('wseventupdated').subscribe(data => {
      if (this.events) {

        this.events.forEach(u => {
          var event = data.events.filter(k => k.id === u.id);
          if (event && event.length > 0) {
            u.stats = event[0].stats;
            u.status = event[0].status;
          }
          if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
          }
        });
      }
    });

  }

  ngOnInit(): void {
  }
  public getCheckLength(name: string): string {
    if (name.length > 18) {
      return '...';
    }
    return '';

  }
  public getLeague(obj, item: Region): void {
    if (item.show) item.show = false;
    else {
      this.sport.forEach(e =>
        e.regions.forEach(k => k.show = false));
      this.api.live('', '' + obj.id, '' + item.id).subscribe(data => {
        this.events = data.data.map(x => { x.show = false; return x; });
        this.eventsOrj = data.data.map(x => { x.show = false; return x; });
        item.show = true;
      });

    }
  }
  public getRegions(item: Sport): void {
    this.sport.forEach(element => {
      element.regions.forEach(e => {
        e.show = false;
      })
    });
    if (item.show) {
      item.show = false;
    } else {
      this.sport.forEach(element => {
        element.show = false;
      });
      item.show = true;
    }
  }
  public addFavoriteMatch(item: Evend) {

    item.isFavorite = !item.isFavorite;
    this.favoriEvent = JSON.parse(sessionStorage.getItem('matchFavorite'));
    if (!this.favoriEvent) {
      this.favoriEvent = [];
    }
    if (item.isFavorite) {
      this.favoriEvent.push(item);
      sessionStorage.setItem('matchFavorite', JSON.stringify(this.favoriEvent));
      this.toastr.warningToastr('', item.name + ' Favorilere eklendi');

    } else {

      this.favoriEvent = JSON.parse(sessionStorage.getItem('matchFavorite'));
      this.favoriEvent = this.favoriEvent.filter(tm => tm.id !== item.id);
      sessionStorage.setItem('matchFavorite', JSON.stringify(this.favoriEvent));
      this.toastr.warningToastr('', item.name + ' Favorilerden çıkarıldı');
    }


  }
  public isAddedFavorite(event: Evend): string {
    return event.isFavorite ? 'added' : '';
  }
  public onSearchChange(searchValue: string): void {
    this.events = this.eventsOrj.filter(item => item.name.indexOf(searchValue) > -1);
  }
  public detailMatch(event: any) {
    sessionStorage.setItem('sport_id', '' + event.sport.id);
    this.router.navigate(['/event-detail/' + event.id]);
    this.store.dispatch(new GetUsers());

  }
  public getPeriodInfo(item: any): string {
    if (!item.stats.current_minute) {
      item.stats.current_minute = '';
    }

    if (item.sport.id === 1) {
      if (item.stats.current_period) {
        return item.stats.score + ' ' + item.stats.current_period + '.Yarı ' + item.stats.current_minute + "'";

      } else {
        return '';

      }
    } else if (item.sport.id === 4
      || item.sport.id === 5
      || item.sport.id === 40
      || item.sport.id === 175
      || item.sport.id === 9) {
      return `${item.stats.score} Set ${item.stats.current_period} ${item.stats.current_minute ? item.stats.current_minute + "'" : ""}`;
    } else if (item.sport.id === 51 || item.sport.id === 53 || item.sport.id === 125) {
      return `${item.stats.score} Map ${item.stats.current_period} ${item.stats.current_minute ? item.stats.current_minute + "'" : ""}`;
    } else if (item.sport.id === 3) {
      return `${item.stats.score} ${item.stats.current_period} .Çeyrek  ${item.stats.current_minute ? item.stats.current_minute + "'" : ""}`;
    } else {
      return item.stats.score + ' ' + (item.stats.current_minute && item.stats.current_minute == '' ? item.stats.current_minute + "'" : "");

      //return item.stats.score + ' ' + item.stats.current_period + '   ' + item.stats.current_minute ? item.stats.current_minute + "'" : "";
    }
  }


}
