import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { CookiesService } from '../_services/cookies.service'
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private apiUrl = environment.apiUrl;
	private uriLogin = this.apiUrl + '/authentication/login';
	private uriLogout = this.apiUrl + '/authentication/logout';
	private uriSignup = this.apiUrl + '/authentication/createUser';

	userId!: string;
	email!: string;

	private currentUserSubject: BehaviorSubject<User>;
	private cookieUser: any;
	public currentUser: Observable<User>;
	private isLoggedInSubject = new BehaviorSubject<boolean>(false);
	isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

	constructor(private http: HttpClient, private router: Router,
		private cookiesService: CookiesService) {
		this.cookieUser = (this.cookiesService.getCookieUser() != "") ? JSON.parse(this.cookiesService.getCookieUser()) : null;
		this.currentUserSubject = new BehaviorSubject<User>(this.cookieUser);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	login(email: string, password: string) {
		console.log("Authentication.service.Login function");
		return this.http.post<any>(this.uriLogin, { email: email, password: password }, { withCredentials: true })
			.pipe(map(user => {
				console.log(user);
				// store user details and basic auth credentials in local storage to keep user logged in between page refreshes
				//user.authdata = window.btoa(username + ':' + password);
				this.cookiesService.setCookie("jwt", user.tokenJWT, 2);
				this.cookiesService.setCookie("user", JSON.stringify(user.userData.user), 2);
				this.cookiesService.setCookie("userEmail", email, 2);
				this.router.navigate(["/profile"]);
				this.setUserData(user.userData.user.uid, email);
				user.authdata = user.tokenJWT;
				return user;
			}),
			catchError(error => {
                console.error("Errore durante il login:", error);
                
                // Qui puoi gestire l'errore a seconda di come vuoi trattarlo
                // Ad esempio, puoi mostrare un messaggio all'utente o loggare l'errore
                // Ritorniamo un throwError per permettere ai componenti chiamanti di gestire l'errore come ritengono opportuno
                return throwError(() => new Error("Errore durante il login. Controlla le tue credenziali."));
            }));
	}

	logout() {
		let email = JSON.parse(this.cookiesService.getCookieUser()).email;
		return this.http.post<any>(this.uriLogout, { email: email })
			.pipe(map(user => {
				if (user) {
					this.cookiesService.setCookie("jwt", "", 2);
					this.cookiesService.setCookie("user", "", 2);
					this.cookiesService.setCookie("userEmail", "", 2);
					this.isLoggedInSubject.next(false);
					this.currentUserSubject.next(null!);
					this.router.navigate(["/login"]);
				}
			}));
	}

	signup(username: string, password: string) {
		return this.http.post<any>(this.uriSignup, { email: username, password: password })
			.pipe(map(user => {
				console.log(user);
				user.authdata = user.tokenJWT;
				//localStorage.setItem('currentUser', JSON.stringify(user));
				this.currentUserSubject.next(user);
				return user;
			}));
	}

	setUserData(userId: string, email: string) {
		//this.currentUserSubject?.next(user);
		this.userId = userId;
		this.email = email;
		this.isLoggedInSubject.next(true);
	}
}