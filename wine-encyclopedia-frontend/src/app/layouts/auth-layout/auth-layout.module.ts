import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthLayoutRoutes } from './auth-layout.routing';
import { SignupComponent } from "../../pages/signup/signup.component";
import { LoginComponent } from "../../pages/login/login.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
	ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
	SignupComponent,
	LoginComponent
  ],
	schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthLayoutModule { }
