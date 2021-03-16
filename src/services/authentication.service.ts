import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../core/models/user';
import { RestResponse } from '../core/models/rest-response';
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public currentUser: Observable<User>;
    private readonly currentUserSubject: BehaviorSubject<User>;
    private readonly endpoint = 'login';
    constructor(private readonly http: HttpClient) {
        try {
            this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
            this.currentUser = this.currentUserSubject.asObservable();
        } catch (error) {
        }
    }

    public get currentUserValue(): User {
        return  this.currentUserSubject.getValue();
    }

    public login = (user: User) => {
        return this.http.post<RestResponse<User>>(`${environment.url}/${this.endpoint}`, user);
    }

    public logout = () => {
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
