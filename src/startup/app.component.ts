import { Component, OnInit } from '@angular/core';
import { MatchPrice } from '../core/models/matchPrice';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/state/app.state';
import { Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from  'ngx-ui-loader';
 

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    routes: AppRouterLink[] = [];
    title = 'Angular';

  
    
    ngOnInit(): void {
        this.loadRoutes();
    }

    loadRoutes(): void {
        this.routes.push(new AppRouterLink('//dashboard', 'Dashboard'));
    }
}

class AppRouterLink {
    constructor(link: string, name: string) {
        this.link = link;
        this.name = name;
    }

    public link: string;
    public name: string;
}
