import { Injectable, signal, computed } from '@angular/core';
import { translations, Language } from '../i18n/translations';

/**
 * TranslationService
 *
 * Manages language state and provides translation functionality using Angular Signals.
 * - Default language: Italian ('it')
 * - Supports dynamic language switching without page reload
 * - Persists language preference in localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'wine-encyclopedia-lang';

  // Signal holding the current language
  private currentLang = signal<Language>(this.getInitialLanguage());

  // Computed signal for reactive access to current language
  readonly language = computed(() => this.currentLang());

  // Computed signal that returns true if current language is Italian
  readonly isItalian = computed(() => this.currentLang() === 'it');

  constructor() {
    // Persist initial language
    this.saveLanguage(this.currentLang());
  }

  /**
   * Get the initial language from localStorage or default to Italian
   */
  private getInitialLanguage(): Language {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'en' || stored === 'it') {
        return stored;
      }
    }
    return 'it'; // Default to Italian
  }

  /**
   * Save language preference to localStorage
   */
  private saveLanguage(lang: Language): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  /**
   * Get current language value
   */
  getCurrentLanguage(): Language {
    return this.currentLang();
  }

  /**
   * Set the current language
   * @param lang - The language to set ('it' or 'en')
   */
  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    this.saveLanguage(lang);
  }

  /**
   * Toggle between Italian and English
   */
  toggleLanguage(): void {
    const newLang: Language = this.currentLang() === 'it' ? 'en' : 'it';
    this.setLanguage(newLang);
  }

  /**
   * Get translation for a key in the current language
   * @param key - The translation key
   * @returns The translated string or the key if not found
   */
  translate(key: string): string {
    const translation = translations[key];
    if (translation) {
      return translation[this.currentLang()];
    }
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  /**
   * Get translation for a key in a specific language
   * @param key - The translation key
   * @param lang - The language to use
   * @returns The translated string or the key if not found
   */
  translateTo(key: string, lang: Language): string {
    const translation = translations[key];
    if (translation) {
      return translation[lang];
    }
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  /**
   * Get all translations for the current language
   * @returns Object with all translations
   */
  getAllTranslations(): { [key: string]: string } {
    const lang = this.currentLang();
    const result: { [key: string]: string } = {};

    for (const key of Object.keys(translations)) {
      result[key] = translations[key][lang];
    }

    return result;
  }
}
