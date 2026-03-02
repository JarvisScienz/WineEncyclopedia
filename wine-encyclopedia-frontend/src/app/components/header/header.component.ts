import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CookiesService } from '../../_services/cookies.service'
import { AuthenticationService } from '../../_services/authentication.service'
import { UserService } from '../../_services/user.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	userLogged = true;
	userName: string = '';
	email: string = '';
	isMenuCollapsed = true;

	constructor(
		private authService: AuthenticationService,
		private cookiesService: CookiesService,
		private userService: UserService
	) { }

	ngOnInit(): void {
		this.authService.isLoggedIn$.subscribe(() => {
			const isLogged = this.cookiesService.getCookieUser() !== '';
			if (isLogged) {
				this.userLogged = true;
				// Email from the dedicated plain-text cookie — always reliable
				this.email = this.cookiesService.getCookie('userEmail');
				// Fetch name from Firestore profile
				const uid = JSON.parse(this.cookiesService.getCookieUser()).uid;
				if (uid) {
					this.userService.getUserInformation(uid).subscribe({
						next: (user: any) => {
							if (user?.name) {
								this.userName = user.name;
							}
						}
					});
				}
			} else {
				this.userLogged = false;
				this.userName = '';
				this.email = '';
			}
		});
	}

	logout() {
		this.authService.logout().pipe(first())
			.subscribe({
				error: (error: any) => console.log('AuthService.logout error. Description: ' + error)
			});
	}

	getFirstLetter(): string {
		if (this.userName) {
			return this.userName.charAt(0).toUpperCase();
		}
		if (this.email) {
			return this.email.charAt(0).toUpperCase();
		}
		return '';
	}
}
