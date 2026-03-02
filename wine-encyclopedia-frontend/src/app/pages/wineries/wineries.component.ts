import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { CookiesService } from '../../_services/cookies.service';
import { Winery } from 'src/app/_models/winery';
import { WineryService } from 'src/app/_services/winery.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
	selector: 'wineries',
	templateUrl: './wineries.component.html',
	styleUrls: ['./wineries.component.css']
})
export class WineriesComponent implements OnInit, AfterViewInit, OnDestroy {

	/** Paginated list for the default browse view. */
	wineries: Winery[] = [];

	/** Full dataset fetched in background — used when any filter/search is active. */
	allWineries: Winery[] = [];
	allWineriesLoaded = false;
	isPreloading = false;

	/** Filter-dropdown option lists populated as batches arrive. */
	countryList: string[] = [];
	denominationList: string[] = [];

	filterText: string = "";
	filterCountry: string = "";
	filterDenomination: string = "";

	userUid: string = "";
	reviews: any = {};
	showFilters = false;

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

	constructor(
		private wineryService: WineryService,
		private userService: UserService,
		private router: Router,
		private cookiesService: CookiesService
	) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
	}

	ngOnInit() {
		this.getAllWineries();
		this.getUserInformation();
		this.preloadAllWineries();
	}

	ngAfterViewInit() {
		this.observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !this.isLoadingMore && this.hasMore && !this.isFilterModeActive) {
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

	get isFilterModeActive(): boolean {
		return !!(this.filterText.trim() || this.filterCountry || this.filterDenomination);
	}

	get displayedWineries(): Winery[] {
		let result: Winery[] = this.isFilterModeActive ? this.allWineries : this.wineries;

		if (this.filterCountry) {
			result = result.filter(w => w.country === this.filterCountry);
		}
		if (this.filterDenomination) {
			result = result.filter(w => w.denomination === this.filterDenomination);
		}
		if (this.filterText.trim()) {
			const q = this.filterText.trim().toLowerCase();
			result = result.filter(w => w.name && w.name.toLowerCase().includes(q));
		}

		return result;
	}

	get activeFiltersCount(): number {
		let count = 0;
		if (this.filterCountry) count++;
		if (this.filterDenomination) count++;
		return count;
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	preloadAllWineries() {
		if (this.allWineriesLoaded || this.isPreloading) return;
		this.isPreloading = true;
		const batchSize = 100;

		const fetchBatch = (lastId: string | null) => {
			this.wineryService.getWineries(batchSize, lastId).subscribe({
				next: batch => {
					this.allWineries = [...this.allWineries, ...(batch ?? [])];
					this.extractFilterOptions(batch ?? []);
					if ((batch ?? []).length === batchSize) {
						fetchBatch(batch[batch.length - 1].id);
					} else {
						this.allWineriesLoaded = true;
						this.isPreloading = false;
					}
				},
				error: () => { this.isPreloading = false; }
			});
		};

		fetchBatch(null);
	}

	extractFilterOptions(batch: any[]) {
		const merge = (existing: string[], incoming: string[]) =>
			[...new Set([...existing, ...incoming.filter(Boolean)])].sort() as string[];

		this.countryList = merge(this.countryList, batch.map(w => w.country));
		this.denominationList = merge(this.denominationList, batch.map(w => w.denomination));
	}

	getUserInformation() {
		this.userService.getUserInformation(this.userUid).subscribe((response) => {
			this.reviews = response.reviews || {};
		});
	}

	refresh() {
		this.wineries = [];
		this.allWineries = [];
		this.countryList = [];
		this.denominationList = [];
		this.lastDocId = null;
		this.hasMore = true;
		this.filterText = "";
		this.filterCountry = "";
		this.filterDenomination = "";
		this.allWineriesLoaded = false;
		this.isPreloading = false;
		this.showFilters = false;
		this.getAllWineries();
		this.preloadAllWineries();
	}

	getAllWineries() {
		this.isLoadingMore = true;
		this.wineryService.getWineries(this.pageSize, null).subscribe(wineries => {
			this.wineries = wineries ?? [];
			this.hasMore = wineries.length === this.pageSize;
			this.lastDocId = wineries.length ? wineries[wineries.length - 1].id : null;
			this.isLoadingMore = false;
		});
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore || this.isFilterModeActive) return;
		this.isLoadingMore = true;
		this.wineryService.getWineries(this.pageSize, this.lastDocId).subscribe(wineries => {
			this.wineries = [...this.wineries, ...(wineries ?? [])];
			this.hasMore = wineries.length === this.pageSize;
			this.lastDocId = wineries.length ? wineries[wineries.length - 1].id : this.lastDocId;
			this.isLoadingMore = false;
		});
	}

	viewWineryDetails(winery: any, review: boolean) {
		this.router.navigate(['/winery'], { state: { wineryData: winery, review: review } });
	}

	isWineryVisited(wineryID: string) {
		return (this.reviews[wineryID] != null);
	}
}
