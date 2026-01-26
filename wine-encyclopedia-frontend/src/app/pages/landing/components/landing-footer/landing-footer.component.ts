import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { TranslationService } from '../../../../_services/translation.service';

/**
 * LandingFooterComponent
 *
 * Footer with project info, useful links, and contact information.
 * Includes copyright and attribution.
 */
@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.css']
})
export class LandingFooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'GitHub', url: 'https://github.com/yourusername/wine-encyclopedia', icon: 'fab fa-github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'fab fa-linkedin-in' }
  ];

  constructor(public translationService: TranslationService) {}

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
