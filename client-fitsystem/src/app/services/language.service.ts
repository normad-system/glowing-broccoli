import { Injectable, signal } from '@angular/core';

export type Language = 'ko' | 'en' | 'ja';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLanguage = signal<Language>('ko');

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['ko', 'en', 'ja'].includes(savedLang)) {
      this.currentLanguage.set(savedLang);
    }
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);
  }

  getLanguage(): Language {
    return this.currentLanguage();
  }
}
