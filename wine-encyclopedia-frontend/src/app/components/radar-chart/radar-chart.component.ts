import { Component, AfterViewInit, ElementRef, ViewChild, Input, SimpleChanges } from '@angular/core';
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
  @Input() radarChartData: any;

  ngAfterViewInit(): void {
    this.createRadarChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['radarChartData']) {
      // Se i dati del grafico cambiano, aggiorna il grafico
      this.updateRadarChart();
    }
  }

  updateRadarChart() {
    // Se il grafico è già stato creato, aggiorna i dati
    if (this.radarChart) {
      this.radarChart.data.datasets[0].data = this.radarChartData || [];  // Aggiorna i dataset
      this.radarChart.update();  // Rende effettive le modifiche
    }
  }

  updateChartDataAtIndex(index: number, newValue: number) {
    if (this.radarChart && this.radarChart.data.datasets.length > 0) {
      // Modifica il dato nell'indice specifico
      this.radarChart.data.datasets[0].data[index] = newValue;
      // Chiamare update per riflettere il cambiamento
      this.radarChart.update();
    }
  }


  createRadarChart() {
    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Rotondità', 'Persistenza', 'Intensità', 'Tannino', 'Struttura', 'Morbidezza', 'Equilibrio', 'Alcol', 'Acidità'],
        datasets: [
          {
            label: 'Vino',
            data: this.radarChartData, //[80, 70, 75, 90, 60, 85, 80, 75, 80],
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
            suggestedMax: 4
          }
        }
      }
    });
  }
}
