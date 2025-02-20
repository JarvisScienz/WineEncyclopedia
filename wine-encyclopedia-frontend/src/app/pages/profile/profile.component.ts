import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CookiesService } from 'src/app/_services/cookies.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    name: 'Mario Rossi',
    email: '',
    registrationDate: new Date('2023-05-15'),
  };
  userUid: string  = "";

  totalTasted = 0; // Numero totale di vini degustati
  yearlyTastings = { }; // Dati annuali

  constructor(private appService: AppService,
    private cookiesService: CookiesService
  ) {
    this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
    this.user.email = JSON.parse(this.cookiesService.getCookieUser()).email;
  }

  ngOnInit() {
    this.getWineTastedInYears();
    
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
        this.loadChart();
		}));
  }
}
