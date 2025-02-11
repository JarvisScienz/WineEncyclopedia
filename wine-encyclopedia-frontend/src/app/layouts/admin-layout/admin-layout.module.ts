import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DisplayBoardComponent } from '../../display-board.component';
import { UsersComponent } from '../../users.component';
import { TastginSheetComponent } from '../../pages/tasting-sheet/tasting-sheet.component';
import { WineTastedComponent } from '../../pages/wine-tasted/wine-tasted.component';
import { MyCellarComponent } from '../../pages/my-cellar/my-cellar.component';
import { WineriesComponent } from '../../pages/wineries/wineries.component';
import { WinesComponent } from '../../pages/wines/wines.component';
import { WinesFilterFilterPipe } from '../../filters/wines-filters.pipe';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { RadarChartComponent } from '../../components/radar-chart/radar-chart.component';

import { ErrorInterceptor } from '../../_helpers';
import { JwtInterceptor } from '../../_helpers/jwt.interceptor';
import { WineryComponent } from "src/app/pages/winery/winery.component";
import { WineComponent } from "src/app/pages/wine/wine.component";
import { ProfileComponent } from "src/app/pages/profile/profile.component";
import { WineTastedDetailsComponent } from "src/app/pages/wine-tasted-details/wine-tasted-details.component";

@NgModule({
  declarations: [
    DisplayBoardComponent,
    UsersComponent,
    TastginSheetComponent,
    WineTastedComponent,
    MyCellarComponent,
    WinesFilterFilterPipe,
    NotificationsComponent,
    RadarChartComponent,
    WineriesComponent,
    WinesComponent,
    WineryComponent,
    WineComponent,
    ProfileComponent,
    WineTastedDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
	ReactiveFormsModule,
    NgbModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
	schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminLayoutModule { }
