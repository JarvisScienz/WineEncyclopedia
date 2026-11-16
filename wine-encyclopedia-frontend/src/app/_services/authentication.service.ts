import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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
	private uriResendVerification = this.apiUrl + '/authentication/resendVerification';

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

	login(email: string, password: string, rememberMe: boolean = false) {
		console.log("Authentication.service.Login function");
		const cookieDays = rememberMe ? 30 : 1;
		return this.http.post<any>(this.uriLogin, { email: email, password: password }, { withCredentials: true })
			.pipe(map(user => {
				console.log(user);
				this.cookiesService.setCookie("user", JSON.stringify(user.userData.user), cookieDays);
				this.cookiesService.setCookie("userEmail", email, cookieDays);
				this.router.navigate(["/profile"]);
				this.setUserData(user.userData.user.uid, email);
				return user;
			}),
			catchError(err => {
                console.error("Errore durante il login:", err);
                const code: string = err?.error?.error || 'login_error';
                return throwError(code);
            }));
	}

	logout() {
		const raw = this.cookiesService.getCookieUser();
		const email = raw ? JSON.parse(raw).email : undefined;
		// La pulizia locale avviene sempre, anche se la chiamata fallisce
		// (es. token scaduto): così non si può restare "loggati" a metà.
		const clearLocalSession = () => {
			this.cookiesService.deleteCookie("jwt"); // cookie legacy
			this.cookiesService.deleteCookie("user");
			this.cookiesService.deleteCookie("userEmail");
			this.isLoggedInSubject.next(false);
			this.currentUserSubject.next(null!);
			this.router.navigate(["/login"]);
		};
		return this.http.post<any>(this.uriLogout, { email: email }, { withCredentials: true })
			.pipe(
				catchError(err => of(null)),
				map(() => clearLocalSession())
			);
	}

	resendVerificationEmail(email: string, password: string): Observable<any> {
		return this.http.post<any>(this.uriResendVerification, { email, password }).pipe(
			catchError(err => {
				const code: string = err?.error?.error || 'resend_error';
				return throwError(code);
			})
		);
	}

	signup(username: string, password: string) {
		return this.http.post<any>(this.uriSignup, { email: username, password: password })
			.pipe(map(user => {
				console.log(user);
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