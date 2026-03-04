import { Component, OnInit } from '@angular/core';
import { WineTastedService } from 'src/app/_services/wineTasted.service';
import { CookiesService } from 'src/app/_services/cookies.service';
import { WineService } from 'src/app/_services/wine.service';
import { WineryService } from 'src/app/_services/winery.service';
import { UserService } from 'src/app/_services/user.service';
import { WineTastingSheet } from 'src/app/_models/wine-tasting-sheet.model';
import { NavigationExtras, Router } from '@angular/router';
import { Wine } from 'src/app/_models/wine';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lastThreeWines: any[] = [];
  lastThreeWineries: any[] = [];
  userUid: string = '';

  constructor(
    private router: Router,
    private wineTastedService: WineTastedService,
    private cookiesService: CookiesService,
    private wineService: WineService,
    private wineryService: WineryService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const userCookie = this.cookiesService.getCookieUser();
    if (userCookie) {
      try {
        this.userUid = JSON.parse(userCookie).uid;
      } catch (e) {
        this.userUid = '';
      }
    }
    if (this.userUid) {
      this.loadLastThreeWines();
      this.loadVisitedWineries();
    }
  }

  private loadLastThreeWines(): void {
    this.wineTastedService.getWinesTasted(this.userUid).subscribe((wines: any[]) => {
      if (wines && wines.length > 0) {
        wines = wines.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        this.lastThreeWines = wines.slice(0, 3);

        this.wineService.getWines().subscribe((allWines: any[]) => {
          this.lastThreeWines = this.lastThreeWines.map(wine => {
            const match = allWines.find(w => String(w.id) === String(wine.wineId));
            return match && match.img ? { ...wine, img: match.img, url: match.img } : wine;
          });
        });
      }
    });
  }

  private loadVisitedWineries(): void {
    this.userService.getUserInformation(this.userUid).subscribe((user: any) => {
      const reviews: any = user.reviews || {};
      const visitedIds = Object.keys(reviews);
      if (visitedIds.length === 0) return;

      this.wineryService.getWineriesList().subscribe((allWineries: any[]) => {
        this.lastThreeWineries = allWineries
          .filter(w => visitedIds.includes(String(w.id)))
          .slice(0, 3);
      });
    });
  }

  viewWineTastedDetails(wine: WineTastingSheet) {
		let navigationExtras: NavigationExtras = {
			queryParams: wine,
			fragment: 'anchor',
			skipLocationChange: true
		};

		this.router.navigate(['/wine-tasted-details'], { state: { wineData: wine } });
	}

  viewWineDetails(wine: WineTastingSheet) {
    this.wineService.getWinesById(wine.wineId).subscribe((wine: Wine) => {
      this.router.navigate(['/wine'], { state: { wineData: wine } });
    });
	}
}
