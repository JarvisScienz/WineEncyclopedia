import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

interface TechItem {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

/**
 * LandingTechComponent
 *
 * Section highlighting the technology stack and development philosophy.
 * Features tech badges and philosophy cards.
 */
@Component({
  selector: 'app-landing-tech',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-tech.component.html',
  styleUrls: ['./landing-tech.component.css']
})
export class LandingTechComponent implements AfterViewInit {
  techItems: TechItem[] = [
    {
      icon: 'fas fa-layer-group',
      titleKey: 'tech.modern.title',
      descriptionKey: 'tech.modern.description'
    },
    {
      icon: 'fas fa-sitemap',
      titleKey: 'tech.architecture.title',
      descriptionKey: 'tech.architecture.description'
    },
    {
      icon: 'fas fa-code-branch',
      titleKey: 'tech.open.title',
      descriptionKey: 'tech.open.description'
    }
  ];

  technologies = [
    { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031' },
    { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
    { name: 'Firebase', icon: 'fas fa-fire', color: '#FFCA28' },
    { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: '#7952B3' },
    { name: 'Git', icon: 'fab fa-git-alt', color: '#F05032' }
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
