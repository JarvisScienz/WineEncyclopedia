import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

//import { environment } from '@environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private uriLogin = '/api/authentication/login';
	private uriLogout = '/api/authentication/logout';
	private uriSignup = '/api/authentication/createUser';
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.uriLogin, { email: username, password: password })
            .pipe(map(user => {
				console.log(user);
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                //user.authdata = window.btoa(username + ':' + password);
				user.authdata = user.tokenJWT;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
		let userName = JSON.parse(localStorage.getItem('currentUser')!).username; 
        return this.http.post<any>(this.uriLogout, { username: userName })
            .subscribe(
				result => {
					if (result){
						localStorage.removeItem('currentUser');
        				this.currentUserSubject.next(null!);
						this.router.navigate(['/login']);
					}
				},
				error => {}
			);
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
}