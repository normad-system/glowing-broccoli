import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="section-title">💪 FitSystem</h3>
            <p class="section-text">
              웹 시스템 개발 전문 기업<br />
              최신 기술로 비즈니스를 성공으로 이끕니다
            </p>
          </div>

          <div class="footer-section">
            <h4 class="section-title">서비스</h4>
            <ul class="link-list">
              <li><a routerLink="/services/web">웹 개발</a></li>
              <li><a routerLink="/services/mobile">모바일 앱</a></li>
              <li><a routerLink="/services/cloud">클라우드</a></li>
              <li><a routerLink="/services/consulting">컨설팅</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="section-title">회사</h4>
            <ul class="link-list">
              <li><a routerLink="/about">회사 소개</a></li>
              <li><a routerLink="/portfolio">포트폴리오</a></li>
              <li><a routerLink="/blog">기술 블로그</a></li>
              <li><a routerLink="/contact">문의하기</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="section-title">문의</h4>
            <ul class="contact-list">
              <li>📧 contact&#64;fitsystem.com</li>
              <li>📞 +82-2-1234-5678</li>
              <li>📍 서울특별시 강남구</li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 FitSystem. All rights reserved.</p>
          <div class="social-links">
            <a href="#" target="_blank">GitHub</a>
            <a href="#" target="_blank">LinkedIn</a>
            <a href="#" target="_blank">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1f2937;
      color: white;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .section-text {
      color: #9ca3af;
      line-height: 1.6;
      margin: 0;
    }

    .link-list, .contact-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .link-list a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
    }

    .link-list a:hover {
      color: #3B82F6;
    }

    .contact-list li {
      color: #9ca3af;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid #374151;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
    }

    .social-links a:hover {
      color: #3B82F6;
    }

    @media (max-width: 640px) {
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
