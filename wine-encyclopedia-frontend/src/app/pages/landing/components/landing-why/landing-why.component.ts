import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

/**
 * LandingWhyComponent
 *
 * Section explaining why Wine Encyclopedia exists.
 * Features three reasons with icons and scroll animations.
 */
@Component({
  selector: 'app-landing-why',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-why.component.html',
  styleUrls: ['./landing-why.component.css']
})
export class LandingWhyComponent implements AfterViewInit {
  reasons = [
    {
      icon: 'fas fa-puzzle-piece',
      titleKey: 'why.reason1.title',
      descriptionKey: 'why.reason1.description'
    },
    {
      icon: 'fas fa-database',
      titleKey: 'why.reason2.title',
      descriptionKey: 'why.reason2.description'
    },
    {
      icon: 'fas fa-heart',
      titleKey: 'why.reason3.title',
      descriptionKey: 'why.reason3.description'
    }
  ];

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.setupScrollAnimation();
  }

  /**
   * Setup Intersection Observer for scroll animations
   */
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
