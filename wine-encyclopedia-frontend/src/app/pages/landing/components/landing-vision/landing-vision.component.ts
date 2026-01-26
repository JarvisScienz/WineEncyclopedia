import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../_services/translation.service';

interface VisionItem {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

/**
 * LandingVisionComponent
 *
 * Section describing the long-term vision and future goals.
 * Features a timeline-style layout with scroll animations.
 */
@Component({
  selector: 'app-landing-vision',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-vision.component.html',
  styleUrls: ['./landing-vision.component.css']
})
export class LandingVisionComponent implements AfterViewInit {
  visionItems: VisionItem[] = [
    {
      icon: 'fas fa-bullseye',
      titleKey: 'vision.reference.title',
      descriptionKey: 'vision.reference.description'
    },
    {
      icon: 'fas fa-globe-europe',
      titleKey: 'vision.expansion.title',
      descriptionKey: 'vision.expansion.description'
    },
    {
      icon: 'fas fa-users',
      titleKey: 'vision.community.title',
      descriptionKey: 'vision.community.description'
    }
  ];

  constructor(
    private elementRef: ElementRef,
    public translationService: TranslationService
  ) {}

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
