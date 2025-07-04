import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { Wine } from 'src/app/_models/wine';
import { Winery } from 'src/app/_models/winery';
import { WineryService } from 'src/app/_services/winery.service';
import { UserService } from 'src/app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { WineService } from 'src/app/_services/wine.service';

@Component({
	selector: 'winery',
	templateUrl: './winery.component.html',
	styleUrls: ['./winery.component.css']
})
export class WineryComponent implements OnInit {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	notificationService: NotificationsComponent;
	wines: Wine[] = [];
	wineries: Winery[] = [];
	wineryDetails!: Winery;
	winesList: Wine[] = [];
	review: boolean = false;
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";
	reviewComment: string = "";

	constructor(private wineryService: WineryService,
		private userService: UserService,
		private router: Router,
		private cookiesService: CookiesService,
		private toastr: ToastrService,
		private wineService: WineService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
			this.notificationService = new NotificationsComponent(this.toastr);
		 }



	ngOnInit() {
		this.wineryDetails = history.state.wineryData;
		this.wineService.getWinesByWinery(this.wineryDetails.name).subscribe((wines: any[]) => {
			this.winesList = wines;
		});
		this.review = history.state.review;
		(this.review) ? this.loadReview() : '';
	}

	refresh() {
		this.getAllWineries();
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
	}

	loadReview() {
		this.userService.getUserInformation(this.userUid).subscribe((response) => {
			this.reviewComment = response.reviews[this.wineryDetails.id] || "";
		});
	}

	filterWinery() {
		
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

	viewWineDetails(wine: any) {
		this.router.navigate(['/wine'], { state: { wineData: wine } });
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

	saveReview(wineryID: string, review: string) {
		this.userService.saveReviewService(this.userUid, wineryID, review).subscribe((response) => {
			console.log(response);
			this.notificationService.successNotification("Recensione salvata!");
		});
	}
}