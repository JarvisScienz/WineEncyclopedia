import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-wine-slider',
	templateUrl: './wine-slider.component.html',
	styleUrls: ['./wine-slider.component.css']
})
export class WineSliderComponent {
	@Input() wines: any[] = [];
	visibleWines: any[] = [];
	currentIndex = 0;
	itemsPerPage = 6;

	ngOnChanges() {
		this.updateVisibleWines();
	}

	updateVisibleWines() {
		this.visibleWines = this.wines.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
	}

	nextSlide() {
		if (this.currentIndex + this.itemsPerPage < this.wines.length) {
			this.currentIndex += this.itemsPerPage;
			this.updateVisibleWines();
		}
	}

	prevSlide() {
		if (this.currentIndex > 0) {
			this.currentIndex -= this.itemsPerPage;
			this.updateVisibleWines();
		}
	}
}
