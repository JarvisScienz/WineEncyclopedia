import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container" *ngIf="isVisible">
      <div [innerHTML]="svgContent" class="spinner"></div>
      <p class="loading-text" *ngIf="showText">{{ loadingText }}</p>
    </div>
  `,
    styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() loadingText: string = 'Caricamento...';
  @Input() showText: boolean = true;
  @Input() svgPath: string = 'assets/images/loading-glass-2.svg';
  @Input() speed: 'slow' | 'normal' | 'fast' = 'normal';
svgContent: SafeHtml = '';

    constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadSvg();
  }

  ngOnChanges() {
    // Ricarica l'SVG se il path cambia
    this.loadSvg();
  }


  loadSvg() {
    if (this.svgPath) {
      this.http.get(this.svgPath, { responseType: 'text' })
        .subscribe({
          next: (svg) => {
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
          },
          error: (error) => {
            console.error('Errore nel caricamento SVG:', error);
            // Fallback: usa un spinner CSS semplice
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(`
              <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%;"></div>
            `);
          }
        });
    }
}
}