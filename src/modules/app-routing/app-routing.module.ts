import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { AppMasterGuard } from '../../guards/app-master.guard';
import { LiveComponent } from '../../components/live/live.component';
import { DetailComponent } from '../../components/detail/detail.component';
import { LoginComponent } from '../../components/login/login.component';
import { HistoryComponent } from '../../components/history/history.component';
import { EventDetailComponent } from '../../components/event-detail/event-detail.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { ResultComponent } from '../../components/result/result.component';
const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AppMasterGuard] },
    { path: 'history', component: HistoryComponent, canActivate: [AppMasterGuard] },
    { path: 'live', component: LiveComponent, canActivate: [AppMasterGuard] },
    { path: 'result', component: ResultComponent, canActivate: [AppMasterGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [AppMasterGuard] },
    { path: 'detail/:id', component: DetailComponent, canActivate: [AppMasterGuard] },
    { path: 'event-detail/:id', component: EventDetailComponent, canActivate: [AppMasterGuard] },
    { path: 'login/:token/:user', component: LoginComponent, canActivate: [AppMasterGuard] },
    { path: 'login/:token/:user/:language', component: LoginComponent, canActivate: [AppMasterGuard] },
    { path: 'login/:token/', component: LoginComponent, canActivate: [AppMasterGuard] },
    {
        path: '**',
        redirectTo: '/dashboard',
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
