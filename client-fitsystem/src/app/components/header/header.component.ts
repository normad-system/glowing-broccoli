import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LanguageService, Language } from '../../services/language.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo">
            <span class="logo-icon">💪</span>
            <span class="logo-text">FitSystem</span>
          </a>

          <nav class="nav">
            <a routerLink="/" class="nav-link">{{ getText('home') }}</a>
            <a routerLink="/blog" class="nav-link">{{ getText('blog') }}</a>
            <a routerLink="/about" class="nav-link">{{ getText('about') }}</a>
            <a routerLink="/contact" class="nav-link">{{ getText('contact') }}</a>
          </nav>

          <div class="header-actions">
            @if (currentUser$ | async; as user) {
              <div class="user-menu">
                <span class="user-name">{{ user.name || user.email }}</span>
                <button (click)="onLogout()" class="btn-logout">
                  {{ getText('logout') }}
                </button>
              </div>
            } @else {
              <div class="auth-buttons">
                <a routerLink="/login" class="btn-login">{{ getText('login') }}</a>
                <a routerLink="/register" class="btn-register">{{ getText('register') }}</a>
              </div>
            }
          </div>

          <div class="language-selector">
            <button 
              (click)="setLanguage('ko')" 
              [class.active]="currentLang() === 'ko'"
              class="lang-btn">
              🇰🇷 KO
            </button>
            <button 
              (click)="setLanguage('en')" 
              [class.active]="currentLang() === 'en'"
              class="lang-btn">
              🇺🇸 EN
            </button>
            <button 
              (click)="setLanguage('ja')" 
              [class.active]="currentLang() === 'ja'"
              class="lang-btn">
              🇯🇵 JA
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      font-weight: 700;
      font-size: 1.5rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .nav {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #374151;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: #3B82F6;
    }

    .language-selector {
      display: flex;
      gap: 0.5rem;
    }

    .lang-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .lang-btn:hover {
      background: #f9fafb;
    }

    .lang-btn.active {
      background: #3B82F6;
      color: white;
      border-color: #3B82F6;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-size: 0.875rem;
      color: #4a5568;
      font-weight: 500;
    }

    .btn-logout {
      padding: 0.5rem 1rem;
      background: #f7fafc;
      color: #4a5568;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }

    .auth-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .btn-login,
    .btn-register {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-login {
      color: #4a5568;
      background: transparent;
      border: 1px solid #e2e8f0;
    }

    .btn-login:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
    }

    .btn-register {
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }

    .btn-register:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  `]
})
export class HeaderComponent implements OnInit {
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentLang = this.languageService.currentLanguage;
  currentUser$ = this.authService.currentUser$;

  private translations = {
    ko: {
      home: '홈',
      blog: '블로그',
      about: '회사 소개',
      contact: '문의',
      login: '로그인',
      register: '회원가입',
      logout: '로그아웃',
    },
    en: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
    },
    ja: {
      home: 'ホーム',
      blog: 'ブログ',
      about: '会社紹介',
      contact: 'お問い合わせ',
      login: 'ログイン',
      register: '新規登録',
      logout: 'ログアウト',
    },
  };

  ngOnInit() {}

  setLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
  }

  getText(key: string): string {
    const lang = this.currentLang();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
