import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../core/models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private readonly authenticationService: AuthenticationService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.currentUserValue;
        if (!currentUser) {
            currentUser = new User();
            currentUser.token = '1Iktsa40MbZ3FJmXyGZsYhdMdJEHq2EbYvTFzIaZJt5HehIA3hEjibuTt58tsWpubq6NnmOLZnIs5SWC';
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        const prm = request.urlWithParams.indexOf('xls') > -1 ? "responseType: 'blob'" : '';
        let lang = 'tr';
        if (sessionStorage.hasOwnProperty('language')) {
            lang = sessionStorage.getItem('language');
        }
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                    Language: lang,
                    'Accept-Language': lang
                },
            });
        }
        return next.handle(request);
    }
}
