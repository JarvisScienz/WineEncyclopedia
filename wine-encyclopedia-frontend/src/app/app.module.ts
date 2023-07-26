import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule } from "@angular/router";
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
	AdminLayoutComponent, 
	AuthLayoutComponent
  ],
  imports: [
	AppRoutingModule,
    BrowserModule,
	ComponentsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
	FormsModule,
	ToastrModule.forRoot(),
	NgbModule,
	NgxSpinnerModule,
	RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
	schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
