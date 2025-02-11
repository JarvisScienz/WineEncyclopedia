import { Routes } from "@angular/router";

import { TastginSheetComponent } from '../../pages/tasting-sheet/tasting-sheet.component';
import { WineTastedComponent } from '../../pages/wine-tasted/wine-tasted.component';

import { AuthGuard } from '../../_helpers';
import { MyCellarComponent } from "src/app/pages/my-cellar/my-cellar.component";
import { WineriesComponent } from "src/app/pages/wineries/wineries.component";
import { WinesComponent } from "src/app/pages/wines/wines.component";
import { WineComponent } from "src/app/pages/wine/wine.component";
import { WineryComponent } from "src/app/pages/winery/winery.component";
import { ProfileComponent } from "src/app/pages/profile/profile.component";
import { WineTastedDetailsComponent } from "src/app/pages/wine-tasted-details/wine-tasted-details.component";

export const AdminLayoutRoutes: Routes = [
	//{ path: "endpoints", component: EndPointsComponent, canActivate: [AuthGuard]},
	//{ path: '', redirectTo: '/tasting-sheet', pathMatch: 'full' },
	{ path: "tasting-sheet", component: TastginSheetComponent, canActivate: [AuthGuard] },
	{ path: "wine-tasted", component: WineTastedComponent, canActivate: [AuthGuard] },
	{ path: "wine-tasted-details", component: WineTastedDetailsComponent, canActivate: [AuthGuard] },
	{ path: "my-cellar", component: MyCellarComponent, canActivate: [AuthGuard] },
	{ path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: "wines", component: WinesComponent, canActivate: [AuthGuard] },
	{ path: "wine", component: WineComponent, canActivate: [AuthGuard] },
	{ path: "winery", component: WineryComponent, canActivate: [AuthGuard] },
	{ path: "wineries", component: WineriesComponent, canActivate: [AuthGuard] },
];
