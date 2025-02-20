import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CookiesService } from '../_services/cookies.service'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
		private cookiesService: CookiesService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = (this.cookiesService.getCookieUser() != "") ? JSON.parse(this.cookiesService.getCookieUser()) : null;
        const jwtToken = (this.cookiesService.getCookie("jwt") != "") ? this.cookiesService.getCookie("jwt") : null;
        const isLoggedIn = user != null && jwtToken != null;
        //const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn /*&& isApiUrl*/) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                },
                withCredentials: true
            });
        }

        return next.handle(request);
    }
}