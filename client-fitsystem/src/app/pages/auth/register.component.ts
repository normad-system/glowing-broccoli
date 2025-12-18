import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">{{ getText('register') }}</h1>
          <p class="auth-subtitle">{{ getText('registerSubtitle') }}</p>

          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">{{ getText('email') }} *</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                placeholder="example@email.com"
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="password">{{ getText('password') }} *</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="formData.password"
                name="password"
                required
                placeholder="••••••••"
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="name">{{ getText('name') }}</label>
              <input
                id="name"
                type="text"
                [(ngModel)]="formData.name"
                name="name"
                placeholder="{{ getText('namePlaceholder') }}"
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="phoneNumber">{{ getText('phoneNumber') }}</label>
              <input
                id="phoneNumber"
                type="tel"
                [(ngModel)]="formData.phoneNumber"
                name="phoneNumber"
                placeholder="010-1234-5678"
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="address">{{ getText('address') }}</label>
              <textarea
                id="address"
                [(ngModel)]="formData.address"
                name="address"
                rows="3"
                placeholder="{{ getText('addressPlaceholder') }}"
                [disabled]="loading()"
              ></textarea>
            </div>

            <button
              type="submit"
              class="btn-primary"
              [disabled]="loading()"
            >
              @if (loading()) {
                <span>{{ getText('registering') }}...</span>
              } @else {
                <span>{{ getText('register') }}</span>
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>
              {{ getText('hasAccount') }}
              <a routerLink="/login">{{ getText('loginNow') }}</a>
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
      max-width: 480px;
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
      gap: 1.25rem;
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

    .form-group input,
    .form-group textarea {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input:disabled,
    .form-group textarea:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }

    .form-group textarea {
      resize: vertical;
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
      margin-top: 0.5rem;
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  formData = {
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    address: '',
  };

  loading = signal(false);
  errorMessage = signal('');

  private texts: Record<string, Record<string, string>> = {
    ko: {
      register: '회원가입',
      registerSubtitle: '새 계정을 만드세요',
      email: '이메일',
      password: '비밀번호',
      name: '이름',
      phoneNumber: '전화번호',
      address: '주소',
      namePlaceholder: '홍길동',
      addressPlaceholder: '서울시 강남구...',
      registering: '가입 중',
      hasAccount: '이미 계정이 있으신가요?',
      loginNow: '로그인하기',
      emailExists: '이미 사용 중인 이메일입니다',
      errorOccurred: '오류가 발생했습니다',
    },
    en: {
      register: 'Sign Up',
      registerSubtitle: 'Create a new account',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      namePlaceholder: 'John Doe',
      addressPlaceholder: 'Seoul, Gangnam...',
      registering: 'Signing up',
      hasAccount: 'Already have an account?',
      loginNow: 'Sign in',
      emailExists: 'Email already exists',
      errorOccurred: 'An error occurred',
    },
    ja: {
      register: '新規登録',
      registerSubtitle: '新しいアカウントを作成する',
      email: 'メールアドレス',
      password: 'パスワード',
      name: '名前',
      phoneNumber: '電話番号',
      address: '住所',
      namePlaceholder: '山田太郎',
      addressPlaceholder: 'ソウル、江南...',
      registering: '登録中',
      hasAccount: 'すでにアカウントをお持ちですか？',
      loginNow: 'ログイン',
      emailExists: 'メールアドレスは既に使用されています',
      errorOccurred: 'エラーが発生しました',
    },
  };

  getText(key: string): string {
    const lang = this.languageService.currentLanguage();
    return this.texts[lang]?.[key] || this.texts['en'][key] || key;
  }

  onSubmit() {
    if (!this.formData.email || !this.formData.password) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const registerData = {
      email: this.formData.email,
      password: this.formData.password,
      name: this.formData.name || undefined,
      phoneNumber: this.formData.phoneNumber || undefined,
      address: this.formData.address || undefined,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Register error:', err);
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
