import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

/**
 * LandingCtaComponent
 *
 * Call to action section inviting users to explore, contribute, and follow the project.
 * Features prominent buttons and encouraging messaging.
 */
@Component({
  selector: 'app-landing-cta',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-cta.component.html',
  styleUrls: ['./landing-cta.component.css']
})
export class LandingCtaComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.setupScrollAnimation();
  }

  private setupScrollAnimation(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    elements.forEach((el: Element) => observer.observe(el));
  }

  openGitHub(): void {
    window.open('https://github.com/yourusername/wine-encyclopedia', '_blank');
  }

  openContact(): void {
    window.location.href = 'mailto:contact@wine-encyclopedia.com';
  }
}
