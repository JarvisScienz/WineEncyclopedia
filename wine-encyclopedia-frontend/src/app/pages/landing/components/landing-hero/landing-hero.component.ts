import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

/**
 * LandingHeroComponent
 *
 * Hero section with animated background, tagline, description and CTAs.
 * Features a wine-inspired gradient background with subtle decorative elements.
 */
@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './landing-hero.component.html',
  styleUrls: ['./landing-hero.component.css']
})
export class LandingHeroComponent {
  /**
   * Scroll to the features section
   */
  scrollToFeatures(): void {
    const element = document.getElementById('features');
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

  /**
   * Open GitHub repository in new tab
   */
  openGitHub(): void {
    window.open('https://github.com/yourusername/wine-encyclopedia', '_blank');
  }
}
