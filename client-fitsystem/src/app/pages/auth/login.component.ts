import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">{{ getText('login') }}</h1>
          <p class="auth-subtitle">{{ getText('loginSubtitle') }}</p>

          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">{{ getText('email') }}</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="example@email.com"
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="password">{{ getText('password') }}</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                [disabled]="loading()"
              />
            </div>

            <button
              type="submit"
              class="btn-primary"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span>{{ getText('loading') }}...</span>
              } @else {
                <span>{{ getText('login') }}</span>
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>
              {{ getText('noAccount') }}
              <a routerLink="/register">{{ getText('registerNow') }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }

    .auth-container {
      width: 100%;
      max-width: 420px;
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .auth-subtitle {
      color: #718096;
      text-align: center;
      margin-bottom: 2rem;
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #2d3748;
      font-size: 0.875rem;
    }

    .form-group input {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }

    .btn-primary {
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: #718096;
      font-size: 0.875rem;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  private texts: Record<string, Record<string, string>> = {
    ko: {
      login: '로그인',
      loginSubtitle: '계정에 로그인하세요',
      email: '이메일',
      password: '비밀번호',
      loading: '로그인 중',
      noAccount: '계정이 없으신가요?',
      registerNow: '지금 가입하기',
      invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
      accountDeactivated: '계정이 비활성화되었습니다',
      errorOccurred: '오류가 발생했습니다',
    },
    en: {
      login: 'Login',
      loginSubtitle: 'Sign in to your account',
      email: 'Email',
      password: 'Password',
      loading: 'Logging in',
      noAccount: "Don't have an account?",
      registerNow: 'Sign up now',
      invalidCredentials: 'Invalid email or password',
      accountDeactivated: 'Account is deactivated',
      errorOccurred: 'An error occurred',
    },
    ja: {
      login: 'ログイン',
      loginSubtitle: 'アカウントにログインしてください',
      email: 'メールアドレス',
      password: 'パスワード',
      loading: 'ログイン中',
      noAccount: 'アカウントをお持ちでないですか？',
      registerNow: '今すぐ登録',
      invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      accountDeactivated: 'アカウントが無効化されています',
      errorOccurred: 'エラーが発生しました',
    },
  };

  getText(key: string): string {
    const lang = this.languageService.currentLanguage();
    return this.texts[lang]?.[key] || this.texts['en'][key] || key;
  }

  onSubmit() {
    if (!this.email || !this.password) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set(this.getText('errorOccurred'));
        }
        this.loading.set(false);
      },
    });
  }
}
