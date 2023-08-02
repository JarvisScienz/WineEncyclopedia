import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookiesService } from '../_services/cookies.service'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
		private cookiesService: CookiesService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		console.log("JWT INTERCEPTOR");
        // add auth header with jwt if user is logged in and request is to the api url
        const user = (this.cookiesService.getCookieUser() != "") ? JSON.parse(this.cookiesService.getCookieUser()) : null;
        const isLoggedIn = user != null && user.userData && user.tokenJWT;
        //const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn /*&& isApiUrl*/) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${user.tokenJWT}`
                }
            });
        }

        return next.handle(request);
    }
}