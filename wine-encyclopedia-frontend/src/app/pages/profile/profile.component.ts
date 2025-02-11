import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = {
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com',
    registrationDate: new Date('2023-05-15'),
  };

  totalTasted = 50; // Numero totale di vini degustati
  yearlyTastings = { 2021: 12, 2022: 18, 2023: 20 }; // Dati annuali

  constructor() {}

  ngOnInit() {
    this.loadChart();
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
}
