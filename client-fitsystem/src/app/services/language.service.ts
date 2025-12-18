import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'ko' | 'en' | 'ja';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  currentLanguage = signal<Language>('ko');

  constructor() {
    // Only access localStorage in browser environment
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && ['ko', 'en', 'ja'].includes(savedLang)) {
        this.currentLanguage.set(savedLang);
      }
    }
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    // Only access localStorage in browser environment
    if (this.isBrowser) {
      localStorage.setItem('language', lang);
    }
  }

  getLanguage(): Language {
    return this.currentLanguage();
  }
}
