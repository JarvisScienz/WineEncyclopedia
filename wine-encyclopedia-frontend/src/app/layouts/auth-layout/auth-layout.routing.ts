import { Routes } from '@angular/router';

import { LoginComponent } from "../../pages/login/login.component";
import { SignupComponent } from '../../pages/signup/signup.component';
import { LoginGuard } from '../../_helpers';

export const AuthLayoutRoutes: Routes = [
	{ path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
	{ path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
];
