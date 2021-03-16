import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() onMenuClick = new EventEmitter<any>();
    constructor(

    ) {

      
    }

    ngOnInit() {}

    menuClick() {
        this.onMenuClick.emit();
    }
    public getActive(str: string): string{
        if(window.location.href.indexOf('event-detail')>-1 && str ==='live'){
            return 'active';
        }
      
        if(window.location.href.indexOf(str)>-1){
            return 'active';

        }
    }
}
