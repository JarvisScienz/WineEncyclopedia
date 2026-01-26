import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../_services/translation.service';

/**
 * TranslatePipe
 *
 * Pipe for translating keys in templates.
 * Marked as impure to react to language changes.
 *
 * Usage:
 * {{ 'hero.tagline' | translate }}
 */
@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure to detect language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
