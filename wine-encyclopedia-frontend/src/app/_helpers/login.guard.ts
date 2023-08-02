import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CookiesService } from '../_services/cookies.service'

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router,
		private cookiesService: CookiesService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const cookie = this.cookiesService.getCookieUser();
		if (!cookie) {
            // not logged in so return true
            return true;
        }

        // logged in so redirect to login page with the return url
        this.router.navigate(['/wine-tasted'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}