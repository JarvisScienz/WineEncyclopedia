import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface Feature {
  icon: string;
  titleKey: string;
  descriptionKey: string;
  comingSoon?: boolean;
  gradient: string;
}

/**
 * LandingFeaturesComponent
 *
 * Grid of feature cards showcasing what users can find.
 * Includes current features and upcoming capabilities.
 */
@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-features.component.html',
  styleUrls: ['./landing-features.component.css']
})
export class LandingFeaturesComponent implements AfterViewInit {
  features: Feature[] = [
    {
      icon: 'fas fa-wine-bottle',
      titleKey: 'features.wineries.title',
      descriptionKey: 'features.wineries.description',
      gradient: 'gradient-burgundy'
    },
    {
      icon: 'fas fa-clipboard-list',
      titleKey: 'features.tasting.title',
      descriptionKey: 'features.tasting.description',
      gradient: 'gradient-purple'
    },
    {
      icon: 'fas fa-leaf',
      titleKey: 'features.grapes.title',
      descriptionKey: 'features.grapes.description',
      gradient: 'gradient-gold'
    },
    {
      icon: 'fas fa-book-open',
      titleKey: 'features.education.title',
      descriptionKey: 'features.education.description',
      gradient: 'gradient-burgundy'
    },
    {
      icon: 'fas fa-robot',
      titleKey: 'features.ai.title',
      descriptionKey: 'features.ai.description',
      comingSoon: true,
      gradient: 'gradient-purple'
    },
    {
      icon: 'fas fa-user-circle',
      titleKey: 'features.community.title',
      descriptionKey: 'features.community.description',
      comingSoon: true,
      gradient: 'gradient-gold'
    }
  ];

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
}
