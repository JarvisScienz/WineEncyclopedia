import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CookiesService } from '../../_services/cookies.service'
import { AuthenticationService } from '../../_services/authentication.service'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	userLogged = true;
    userName: string = '';
	isMenuCollapsed = true;
	constructor(private authService: AuthenticationService,
		private cookiesService: CookiesService) { }

	ngOnInit(): void {
		this.authService.isLoggedIn$.subscribe(isLoggedIn => {
			//console.log ("CurrentValue: " + this.authService.currentUserValue());
			var isLogged = (this.cookiesService.getCookieUser() != "") ? true : false;
			if (isLogged) {
				this.userLogged = isLogged;
                const currentUser = this.authService.currentUserValue;
                if (currentUser && currentUser.username) {
                    this.userName = currentUser.username;
                }
			} else {
				this.userLogged = isLoggedIn;
                this.userName = '';
			}

			// Puoi eseguire altre operazioni qui in base allo stato di autenticazione
			// ...
		});
	}

	logout(){
		this.authService.logout().pipe(first())
			.subscribe(
				data => {
					console.log("SI");
				},
				error => {
					console.log("AuthService.logout error. Description: " + error);
			});
	}

    getFirstLetter(): string {
        if (this.userName) {
            return this.userName.charAt(0).toUpperCase();
        }
        return 'D';
    }
}
