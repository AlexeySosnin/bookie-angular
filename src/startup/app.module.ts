import { BetsComponent } from './../components/bets/bets.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from '../modules/app-routing/app-routing.module';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AppMaterialModule } from '../modules/app-material/app-material.module';
import { BaseHttpService } from '../services/BaseHttpService';
import { HeaderComponent } from '../components/header/header.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { ImportDirective } from '../directives/import-wizard/import.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from '../components/login/login.component';
import { CouponComponent } from '../components/coupon/coupon.component';
import { CenterComponent } from '../components/center/center.component';
import { UpcomingComponent } from '../components/upcoming/upcoming.component';
import { DatePipe } from '@angular/common';
import { SportsComponent } from '../components/sports/sports.component';
import { SingleComponent } from '../components/coupon/single/single.component';
import { CombinedComponent } from '../components/coupon/combined/combined.component';
import { SystemComponent } from '../components/coupon/system/system.component';
import { JwtInterceptor } from '../modules/helps/jwt.interceptor';
import { ErrorInterceptor } from '../modules/helps/error.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from '../store/reducers/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '../store/effects/user.effects';
import { NgxUiLoaderModule, NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { FavoriteComponent } from '../components/favorite/favorite.component';
import { FavoriteLeagueComponent } from '../components/favorite-league/favorite-league.component';
import { MatchComponent } from '../components/match/match.component';
import { DetailComponent } from '../components/detail/detail.component';
import { DetailItemComponent } from '../components/detail-item/detail-item.component';
import { EventDetailComponent } from '../components/event-detail/event-detail.component';
import { CashoutComponent } from '../components/coupon/cashout/cashout.component';
import { LiveComponent } from '../components/live/live.component';
import { LiveMatchComponent } from '../components/live-match/live-match.component';
import { HistoryComponent } from '../components/history/history.component';
import { HistoryActiveComponent } from '../components/history/active/history-active.component';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { ResultComponent } from '../components/result/result.component';
import { MdialogComponent } from '../components/coupon/mdialog/mdialog.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { SafePipe } from '../directives/SafePipe';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, '../assets/i18n/', '.json');
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: 'red',
    bgsPosition: POSITION.topRight,
    bgsSize: 1,
    bgsType: SPINNER.rectangleBounce, // background spinner type
    fgsType: SPINNER.chasingDots, // foreground spinner type
    pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
    pbThickness: 1, // progress bar thickness
};

@NgModule({
    declarations: [
        SafePipe,
        AppComponent,
        DashboardComponent,
        HeaderComponent,
        ToolbarComponent,
        ImportDirective,
        LoginComponent,
        CouponComponent,
        CenterComponent,
        UpcomingComponent,
        SportsComponent,
        SingleComponent,
        CombinedComponent,
        SystemComponent,
        DetailComponent,
        DetailItemComponent,
        FavoriteComponent,
        FavoriteLeagueComponent,
        BetsComponent,
        MatchComponent,
        CashoutComponent,
        LiveComponent,
        LiveMatchComponent,
        HistoryComponent,
        HistoryActiveComponent,
        EventDetailComponent,
        CalendarComponent,
        ResultComponent,
        MdialogComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        AppRoutingModule,
        AppMaterialModule,
        FlexLayoutModule,
        StoreModule.forRoot(appReducers),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,

        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        EffectsModule.forRoot([UserEffects]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],

        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
    ],
    providers: [
        BaseHttpService,
        HttpClientModule,
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private translate: TranslateService) {
        if (!sessionStorage.hasOwnProperty('sport_id') || sessionStorage.getItem('sport_id') == '') {
            sessionStorage.setItem('sport_id', '1')
        }
        this.translate.addLangs(['en', 'tr']);
        this.translate.setDefaultLang('tr');

        if (sessionStorage.hasOwnProperty('language') && sessionStorage.getItem('language') != 'null') {
            this.translate.use(sessionStorage.getItem('language'));
        } else {
            var language = (navigator.language || window.navigator.language || 'tr').split('-')[0];
            this.translate.use(language);
            sessionStorage.setItem('language', language);
        }
    }
}
