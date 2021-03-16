import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    public errorLog: boolean;
    public loginUrl: string;

    constructor(
        private readonly router: Router
        ) {
            this.loginUrl = 'pages/login';

        }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.errorLog = false;
            } else if (err.status === 402) {
                this.errorLog = false;
            } else if (err.status === 406) {
                this.errorLog = false;
            } else if (err.status === 403) {
                this.errorLog = false;
                this.router.navigate([this.loginUrl]);
            } else if (err.status === 400) {
                this.errorLog = false;
            } else if (err.status === 500) {
               this.errorLog = false;
            } else if (err.status === 405) {
                this.errorLog = false;
                this.loginUrl = '/';
                this.router.navigate([this.loginUrl]);
            } else if (err.status === 0) {
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
