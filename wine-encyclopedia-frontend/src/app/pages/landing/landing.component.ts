import { Component, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../_services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LandingHeroComponent } from './components/landing-hero/landing-hero.component';
import { LandingWhyComponent } from './components/landing-why/landing-why.component';
import { LandingFeaturesComponent } from './components/landing-features/landing-features.component';
import { LandingVisionComponent } from './components/landing-vision/landing-vision.component';
import { LandingTechComponent } from './components/landing-tech/landing-tech.component';
import { LandingCtaComponent } from './components/landing-cta/landing-cta.component';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';

/**
 * LandingComponent
 *
 * Main landing page component that orchestrates all sections.
 * Includes navigation with language switcher and smooth scrolling.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    LandingHeroComponent,
    LandingWhyComponent,
    LandingFeaturesComponent,
    LandingVisionComponent,
    LandingTechComponent,
    LandingCtaComponent,
    LandingFooterComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  // Signals for reactive state
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll')
  checkScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  /**
   * Toggle language between Italian and English
   */
  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Smooth scroll to section
   */
  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();
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
