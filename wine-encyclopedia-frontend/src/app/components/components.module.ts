import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

/*import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";*/

import { HeaderComponent } from "./header/header.component";
import { ErrorInterceptor } from '../_helpers/error.interceptor';
import { JwtInterceptor } from '../_helpers/jwt.interceptor';


@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
          { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
          { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
          provideHttpClient(withInterceptorsFromDi())
  ]
})
export class ComponentsModule {}
