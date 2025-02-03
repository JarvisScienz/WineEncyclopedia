import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements AfterViewInit {
  @ViewChild('radarCanvas', { static: false }) radarCanvas!: ElementRef;
  radarChart!: Chart;

  ngAfterViewInit(): void {
    this.createRadarChart();
  }

  createRadarChart() {
    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Rotondità', 'Persistenza', 'Intensità', 'Tannino', 'Struttura', 'Morbidezza', 'Equilibrio', 'Alcol', 'Acidità'],
        datasets: [
          {
            label: 'Vino',
            data: [80, 70, 75, 90, 60, 85, 80, 75, 80],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
          }/*,
          {
            label: 'Cibo',
            data: [60, 85, 80, 75, 70, 90, 80, 75, 80],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }*/
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }
}
