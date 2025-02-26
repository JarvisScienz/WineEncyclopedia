import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { Wine } from 'src/app/_models/wine';
import { Winery } from 'src/app/_models/winery';
import { WineryService } from 'src/app/_services/winery.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
	selector: 'wineries',
	templateUrl: './wineries.component.html',
	styleUrls: ['./wineries.component.css']
})
export class WineriesComponent implements OnInit {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: Wine[] = [];
	wineries: Winery[] = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";
	reviews: any;

	constructor(private wineryService: WineryService,
		private userService: UserService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
			
		 }



	ngOnInit() {
		this.getAllWineries();
		this.getUserInformation();
	}

	getUserInformation() {
		this.userService.getUserInformation(this.userUid).subscribe((response) => {
			this.reviews = response.reviews || {};
		});
	}
	refresh() {
		this.getAllWineries();
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
	}

	viewWineryDetails(winery: any, review: boolean) {
		this.router.navigate(['/winery'], { state: { wineryData: winery, review: review } });
	}

	extractWineries(jsonArray: any[]) {
		this.wineryList = [...new Set(jsonArray.map(item => item.winery))].sort();
	}

	getAllWineries() {
		this.wineryService.getWineries().subscribe((wineries => {
			if (wineries == null)
				this.wines = [];
			else
				this.wineries = wineries;
			this.extractWineries(this.wines);
		}));
	}

	getWineryList() {
		this.wineryService.getWineriesList().subscribe((wineryList => {
			if (wineryList == null)
				this.wineryList = [];
			else
				this.wineryList = wineryList;
		}));
	}

	updateTastedWine(wine: WineTastingSheet) {
		console.log(wine);
		let navigationExtras: NavigationExtras = {
			queryParams: wine,
			fragment: 'anchor',
			skipLocationChange: true
		};

		this.router.navigate(['/tasting-sheet'], navigationExtras);
	}

	getWineIcon(wine: WineTastingSheet) {
		var wineColor = wine.color?.split("_")[0] || "";
		var pathImage = "";
		switch (wineColor) {
			case "red":
				pathImage = "../../assets/images/red-wine.png";
				break;
			case "yellow":
				pathImage = "../../assets/images/yellow-wine.png";
				break;
			case "rose":
				pathImage = "../../assets/images/rose-wine.png";
				break;
		}
		return pathImage;

	}

	isWineryVisited(wineryID: string) {
		return (this.reviews[wineryID] != null);
	}
}