import { Routes } from '@angular/router';

import { AuthLayoutComponent } from "../../layouts/auth-layout/auth-layout.component";
import { SignupComponent } from '../../pages/signup/signup.component';
import { LoginGuard } from '../../_helpers';

export const AuthLayoutRoutes: Routes = [
	{ path: 'login', component: AuthLayoutComponent, canActivate: [LoginGuard] },
	{ path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
];
