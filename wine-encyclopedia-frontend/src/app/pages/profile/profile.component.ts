import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { User } from 'src/app/_models/user';
import { CookiesService } from 'src/app/_services/cookies.service';
import { AppService } from 'src/app/app.service';
import { levels, getLevel } from 'src/app/config/levels';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  userUid: string  = "";
  totalTasted: number = 0; // Numero totale di vini degustati
  yearlyTastings = { }; // Dati annuali
  levelInfo: any = {};
  userLevel: any; // Livello corrente
  nextLevel: any; // Livello successivo
  progressPercentage: number = 0; // Percentuale di completamento
  winesNeededForNextLevel: number = 0; // Vini mancanti per il prossimo livello

  constructor(private appService: AppService,
    private cookiesService: CookiesService
  ) {
    this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
    this.user.email = JSON.parse(this.cookiesService.getCookieUser()).email;
  }

  ngOnInit() {
    this.getWineTastedInYears();
    this.getUserInformation();
  }

  loadChart() {
    const ctx = document.getElementById('tastingChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.yearlyTastings),
        datasets: [{
          label: 'Vini degustati',
          data: Object.values(this.yearlyTastings),
          backgroundColor: '#6b3e26',
          borderColor: '#4a2d1f',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  getWineTastedInYears(){
    this.appService.getWineTastedInYears(this.userUid).subscribe(((count: null) => {
			if (count == null)
				this.yearlyTastings = {};
			else
				this.yearlyTastings = count;
        this.totalTasted = parseInt(Object.values(this.yearlyTastings).reduce((acc: any, val: any) => acc + val, 0) as string);
        this.loadChart();
		}));
  }

  getUserInformation(){
    this.appService.getUserInformation(this.userUid).subscribe(((user: null) => {
			if (user != null){
        this.user = user;
        this.levelInfo = getLevel(this.totalTasted);
        this.calculateLevelProgress();
      }
				
		}));
  }

  calculateLevelProgress(): void {
    // Trova il livello corrente
    this.userLevel = getLevel(this.totalTasted);

    // Trova il livello successivo
    const currentLevelIndex = levels.findIndex(
      (level) => level.name === this.userLevel.name
    );
    if (currentLevelIndex < levels.length - 1) {
      this.nextLevel = levels[currentLevelIndex + 1];
    } else {
      this.nextLevel = null; // Non c'è un livello successivo
    }

    // Calcola la percentuale di completamento e i vini mancanti
    if (this.userLevel && this.nextLevel) {
      const winesInCurrentLevel = this.userLevel.maxWines - this.userLevel.minWines;
      const winesDegustedInLevel = this.totalTasted - this.userLevel.minWines;
      this.progressPercentage = (winesDegustedInLevel / winesInCurrentLevel) * 100;
      this.winesNeededForNextLevel = this.nextLevel.minWines - this.totalTasted;
    } else {
      this.progressPercentage = 100; // Se non c'è un livello successivo, la barra è piena
      this.winesNeededForNextLevel = 0;
    }
  }
}
