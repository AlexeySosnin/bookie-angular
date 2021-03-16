import { Component, OnInit, Input } from '@angular/core';
import { Live } from '../../core/models/live';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../EventService';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Template } from '@angular/compiler/src/render3/r3_ast';
@Component({
    selector: 'app-live-match',
    templateUrl: './live-match.component.html',
    styleUrls: ['./live-match.component.css'],
})
export class LiveMatchComponent implements OnInit {
    @Input()
    public isShow: boolean;
    private eventId= 0;
    public isRefreshing: boolean;
    public showBlur = false;
    public blurText = "DEVRE ARASI";
    public frameUrl: SafeResourceUrl;
    constructor(private readonly api: ApiService, private readonly router: Router, private eventService: EventService, private sanitizer: DomSanitizer) {
        this.eventService.GetEvent('live_animation_url').subscribe(data => {
            if(data == null) {
                this.isShow = false;
                return;
            }
            this.isShow = true;
            this.updateSrc(data);
        });
        this.eventService.GetEvent('newsocketeventid').subscribe(eventId => {
            this.eventId = eventId
        });
        this.eventService.GetEvent('wseventupdated').subscribe(data => {
            var tempData = data.events.filter(u=> u.id == this.eventId);
            if(tempData && tempData > 0){
                this.blurText = tempData[0].stats.current_period;
                this.showBlur = tempData[0].stats.is_timeout;
            }
        });
    }

    public updateSrc(url) {
        this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isRefreshing = true;

        setTimeout(() => {
            this.isRefreshing = false;
        }, 100);
    }

    public getisShowLive(): boolean {
        if(!this.isShow) return false;
        let prm = window.location.href;
        if (prm.indexOf('live') > -1 || prm.indexOf('event-detail') > -1) {
            return true;
        } else {
            return false;
        }
    }
    ngOnInit(): void { }
}
