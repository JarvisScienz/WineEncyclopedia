import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
export class WineriesComponent implements OnInit, AfterViewInit, OnDestroy {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: Wine[] = [];
	wineries: Winery[] = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";
	reviews: any = {};

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

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

	ngAfterViewInit() {
		this.observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !this.isLoadingMore && this.hasMore) {
					this.loadMore();
				}
			},
			{ threshold: 0.1 }
		);
		this.observer.observe(this.scrollAnchor.nativeElement);
	}

	ngOnDestroy() {
		this.observer?.disconnect();
	}

	getUserInformation() {
		this.userService.getUserInformation(this.userUid).subscribe((response) => {
			this.reviews = response.reviews || {};
		});
	}
	refresh() {
		this.wineries = [];
		this.lastDocId = null;
		this.hasMore = true;
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
		this.getAllWineries();
	}

	viewWineryDetails(winery: any, review: boolean) {
		this.router.navigate(['/winery'], { state: { wineryData: winery, review: review } });
	}

	extractWineries(jsonArray: any[]) {
		this.wineryList = [...new Set(jsonArray.map(item => item.winery))].sort();
	}

	getAllWineries() {
		this.isLoadingMore = true;
		this.wineryService.getWineries(this.pageSize, null).subscribe((wineries => {
			this.wineries = wineries ?? [];
			this.hasMore = wineries.length === this.pageSize;
			this.lastDocId = wineries.length ? wineries[wineries.length - 1].id : null;
			this.isLoadingMore = false;
		}));
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore) return;
		this.isLoadingMore = true;
		this.wineryService.getWineries(this.pageSize, this.lastDocId).subscribe((wineries => {
			this.wineries = [...this.wineries, ...wineries];
			this.hasMore = wineries.length === this.pageSize;
			this.lastDocId = wineries.length ? wineries[wineries.length - 1].id : this.lastDocId;
			this.isLoadingMore = false;
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