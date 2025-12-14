import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page">
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">{{ getText('title') }}</h1>
          <p class="hero-subtitle">{{ getText('subtitle') }}</p>
        </div>
      </section>

      <!-- Contact Content -->
      <section class="contact-section">
        <div class="container">
          <div class="content-grid">
            <!-- Contact Form -->
            <div class="form-container">
              <h2 class="form-title">{{ getText('formTitle') }}</h2>
              
              @if (submitted()) {
                <div class="success-message">
                  <span class="success-icon">✅</span>
                  <p>{{ getText('successMessage') }}</p>
                </div>
              } @else {
                <form (ngSubmit)="handleSubmit()" class="contact-form">
                  <div class="form-group">
                    <label for="name">{{ getText('name') }}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      [(ngModel)]="form.name"
                      required
                      class="form-input"
                      [placeholder]="getText('namePlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label for="email">{{ getText('email') }}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="form.email"
                      required
                      class="form-input"
                      [placeholder]="getText('emailPlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label for="subject">{{ getText('subject') }}</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      [(ngModel)]="form.subject"
                      required
                      class="form-input"
                      [placeholder]="getText('subjectPlaceholder')"
                    />
                  </div>

                  <div class="form-group">
                    <label for="message">{{ getText('message') }}</label>
                    <textarea
                      id="message"
                      name="message"
                      [(ngModel)]="form.message"
                      required
                      rows="6"
                      class="form-input"
                      [placeholder]="getText('messagePlaceholder')"
                    ></textarea>
                  </div>

                  <button type="submit" class="btn-submit">
                    {{ getText('submit') }}
                  </button>
                </form>
              }
            </div>

            <!-- Contact Info -->
            <div class="info-container">
              <h2 class="info-title">{{ getText('infoTitle') }}</h2>
              
              <div class="info-items">
                <div class="info-item">
                  <span class="info-icon">📧</span>
                  <div class="info-content">
                    <h3 class="info-label">{{ getText('emailLabel') }}</h3>
                    <a href="mailto:contact@normad-system.com" class="info-value">
                      contact@normad-system.com
                    </a>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <div class="info-content">
                    <h3 class="info-label">{{ getText('phoneLabel') }}</h3>
                    <a href="tel:+82-2-1234-5678" class="info-value">
                      +82-2-1234-5678
                    </a>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">📍</span>
                  <div class="info-content">
                    <h3 class="info-label">{{ getText('addressLabel') }}</h3>
                    <p class="info-value">
                      {{ getText('address') }}
                    </p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">⏰</span>
                  <div class="info-content">
                    <h3 class="info-label">{{ getText('hoursLabel') }}</h3>
                    <p class="info-value">{{ getText('hours') }}</p>
                  </div>
                </div>
              </div>

              <div class="social-links">
                <a href="https://github.com/normad-system" target="_blank" class="social-link">
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" class="social-link">
                  LinkedIn
                </a>
                <a href="https://twitter.com" target="_blank" class="social-link">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-page {
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .contact-section {
      padding: 4rem 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .form-title, .info-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .contact-form {
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
      color: #374151;
    }

    .form-input {
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3B82F6;
    }

    textarea.form-input {
      resize: vertical;
      font-family: inherit;
    }

    .btn-submit {
      padding: 1rem 2rem;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-submit:hover {
      background: #2563eb;
    }

    .success-message {
      text-align: center;
      padding: 3rem;
      background: #f0fdf4;
      border-radius: 12px;
      border: 2px solid #10b981;
    }

    .success-icon {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
    }

    .success-message p {
      font-size: 1.25rem;
      color: #065f46;
      font-weight: 600;
    }

    .info-items {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      gap: 1rem;
    }

    .info-icon {
      font-size: 2rem;
    }

    .info-content {
      flex: 1;
    }

    .info-label {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: #374151;
    }

    .info-value {
      color: #6b7280;
      line-height: 1.6;
    }

    a.info-value {
      color: #3B82F6;
      text-decoration: none;
    }

    a.info-value:hover {
      text-decoration: underline;
    }

    .social-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .social-link {
      padding: 0.75rem 1.5rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      text-decoration: none;
      color: #374151;
      font-weight: 600;
      transition: all 0.2s;
    }

    .social-link:hover {
      background: #3B82F6;
      color: white;
      border-color: #3B82F6;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  private languageService = inject(LanguageService);

  form: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  submitted = signal(false);

  private translations = {
    ko: {
      title: '문의하기',
      subtitle: '프로젝트 의뢰나 궁금하신 점이 있으시면 언제든 연락주세요',
      formTitle: '메시지 보내기',
      name: '이름',
      namePlaceholder: '홍길동',
      email: '이메일',
      emailPlaceholder: 'your@email.com',
      subject: '제목',
      subjectPlaceholder: '무엇을 도와드릴까요?',
      message: '메시지',
      messagePlaceholder: '자세한 내용을 입력해주세요...',
      submit: '보내기',
      successMessage: '메시지가 성공적으로 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.',
      infoTitle: '연락처 정보',
      emailLabel: '이메일',
      phoneLabel: '전화',
      addressLabel: '주소',
      address: '서울특별시 강남구 테헤란로 123',
      hoursLabel: '업무 시간',
      hours: '월-금 9:00 AM - 6:00 PM KST',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Have a project in mind or questions? Feel free to reach out',
      formTitle: 'Send a Message',
      name: 'Name',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      subject: 'Subject',
      subjectPlaceholder: 'How can we help?',
      message: 'Message',
      messagePlaceholder: 'Tell us more about your project...',
      submit: 'Send Message',
      successMessage: 'Message sent successfully! We\'ll get back to you soon.',
      infoTitle: 'Contact Information',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
      address: '123 Teheran-ro, Gangnam-gu, Seoul, South Korea',
      hoursLabel: 'Business Hours',
      hours: 'Mon-Fri 9:00 AM - 6:00 PM KST',
    },
    ja: {
      title: 'お問い合わせ',
      subtitle: 'プロジェクトのご依頼やご質問がございましたら、お気軽にご連絡ください',
      formTitle: 'メッセージを送る',
      name: '名前',
      namePlaceholder: '山田太郎',
      email: 'メール',
      emailPlaceholder: 'your@email.com',
      subject: '件名',
      subjectPlaceholder: 'どのようなご用件でしょうか？',
      message: 'メッセージ',
      messagePlaceholder: '詳細をお聞かせください...',
      submit: '送信',
      successMessage: 'メッセージが正常に送信されました！近日中にご連絡いたします。',
      infoTitle: '連絡先情報',
      emailLabel: 'メール',
      phoneLabel: '電話',
      addressLabel: '住所',
      address: 'ソウル特別市江南区テヘラン路123',
      hoursLabel: '営業時間',
      hours: '月-金 9:00 AM - 6:00 PM KST',
    },
  };

  getText(key: string): string {
    const lang = this.languageService.getLanguage();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  handleSubmit() {
    console.log('Form submitted:', this.form);
    // In a real application, you would send this to a backend API
    this.submitted.set(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      this.submitted.set(false);
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
    }, 3000);
  }
}
