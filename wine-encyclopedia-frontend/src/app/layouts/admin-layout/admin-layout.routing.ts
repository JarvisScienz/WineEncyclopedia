import { Routes } from "@angular/router";

import { TastginSheetComponent } from '../../pages/tasting-sheet/tasting-sheet.component';
import { WineTastedComponent } from '../../pages/wine-tasted/wine-tasted.component';

import { AuthGuard } from '../../_helpers';

export const AdminLayoutRoutes: Routes = [
	//{ path: "endpoints", component: EndPointsComponent, canActivate: [AuthGuard]},
	//{ path: '', redirectTo: '/tasting-sheet', pathMatch: 'full' },
	{ path: "tasting-sheet", component: TastginSheetComponent, canActivate: [AuthGuard] },
	{ path: "wine-tasted", component: WineTastedComponent, canActivate: [AuthGuard] }
];
