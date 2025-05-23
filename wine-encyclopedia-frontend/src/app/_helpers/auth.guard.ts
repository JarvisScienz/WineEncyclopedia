﻿import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CookiesService } from '../_services/cookies.service'

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
    constructor(
        private router: Router,
		private cookiesService: CookiesService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const cookie = this.cookiesService.getCookieUser();	
        if (cookie) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}