import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="about-page">
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">{{ getText('title') }}</h1>
          <p class="hero-subtitle">{{ getText('subtitle') }}</p>
        </div>
      </section>

      <!-- Company Info -->
      <section class="company-section">
        <div class="container">
          <div class="content-grid">
            <div class="text-content">
              <h2 class="section-title">{{ getText('whoWeAre') }}</h2>
              <p class="description">{{ getText('description1') }}</p>
              <p class="description">{{ getText('description2') }}</p>
            </div>
            <div class="image-content">
              <div class="placeholder-image">
                <span>🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="services-section">
        <div class="container">
          <h2 class="section-title center">{{ getText('servicesTitle') }}</h2>
          <div class="services-grid">
            @for (service of services; track service.icon) {
              <div class="service-card">
                <span class="service-icon">{{ service.icon }}</span>
                <h3 class="service-title">{{ getServiceText(service.key, 'title') }}</h3>
                <p class="service-description">{{ getServiceText(service.key, 'description') }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="tech-section">
        <div class="container">
          <h2 class="section-title center">{{ getText('techStackTitle') }}</h2>
          <div class="tech-grid">
            @for (tech of techStack; track tech.name) {
              <div class="tech-item">
                <span class="tech-icon">{{ tech.icon }}</span>
                <span class="tech-name">{{ tech.name }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <h2 class="cta-title">{{ getText('ctaTitle') }}</h2>
          <p class="cta-subtitle">{{ getText('ctaSubtitle') }}</p>
          <div class="cta-buttons">
            <a href="mailto:contact@normad-system.com" class="btn-primary">
              {{ getText('contactUs') }}
            </a>
            <a routerLink="/blog" class="btn-secondary">
              {{ getText('viewBlog') }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-page {
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
      padding: 6rem 0 4rem;
      text-align: center;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      opacity: 0.9;
    }

    .company-section, .services-section, .tech-section {
      padding: 4rem 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .section-title.center {
      text-align: center;
    }

    .description {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #4b5563;
      margin-bottom: 1.5rem;
    }

    .placeholder-image {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8rem;
    }

    .services-section {
      background: #f9fafb;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .service-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .service-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .service-description {
      color: #6b7280;
      line-height: 1.6;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .tech-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .tech-item:hover {
      transform: translateY(-4px);
    }

    .tech-icon {
      font-size: 3rem;
    }

    .tech-name {
      font-weight: 500;
      text-align: center;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      display: inline-block;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .placeholder-image {
        height: 300px;
        font-size: 6rem;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .tech-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  `]
})
export class AboutComponent {
  private languageService = inject(LanguageService);

  services = [
    { key: 'webDev', icon: '💻' },
    { key: 'mobileDev', icon: '📱' },
    { key: 'cloudInfra', icon: '☁️' },
    { key: 'devOps', icon: '🔧' },
    { key: 'consulting', icon: '💡' },
    { key: 'support', icon: '🛠️' },
  ];

  techStack = [
    { name: 'Angular', icon: '🅰️' },
    { name: 'NestJS', icon: '🐈' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Azure', icon: '☁️' },
    { name: 'AWS', icon: '🟧' },
    { name: 'Docker', icon: '🐋' },
    { name: 'Kubernetes', icon: '☸️' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'MySQL', icon: '🐬' },
    { name: 'Redis', icon: '🔴' },
  ];

  private translations = {
    ko: {
      title: 'Normad System 소개',
      subtitle: '혁신적인 웹 시스템 개발 전문 기업',
      whoWeAre: '우리는 누구인가',
      description1:
        'Normad System은 최신 웹 기술과 클라우드 인프라를 활용하여 혁신적인 솔루션을 제공하는 기술 중심의 개발 회사입니다. 우리는 고객의 비즈니스 목표를 달성하기 위해 최고 품질의 소프트웨어를 개발합니다.',
      description2:
        '경험 많은 개발팀과 함께 웹 애플리케이션, 모바일 앱, 클라우드 인프라 구축까지 다양한 서비스를 제공합니다. 최신 기술 트렌드를 블로그를 통해 공유하며, 기술 커뮤니티에 기여하고 있습니다.',
      servicesTitle: '제공 서비스',
      techStackTitle: '기술 스택',
      ctaTitle: '프로젝트를 시작할 준비가 되셨나요?',
      ctaSubtitle: '여러분의 아이디어를 현실로 만들어드립니다',
      contactUs: '문의하기',
      viewBlog: '블로그 보기',
      webDev_title: '웹 개발',
      webDev_description: '현대적이고 반응형인 웹 애플리케이션을 개발합니다',
      mobileDev_title: '모바일 개발',
      mobileDev_description: 'iOS와 Android를 위한 네이티브 및 하이브리드 앱',
      cloudInfra_title: '클라우드 인프라',
      cloudInfra_description: 'AWS, Azure를 활용한 확장 가능한 인프라 구축',
      devOps_title: 'DevOps',
      devOps_description: 'CI/CD 파이프라인 및 자동화 솔루션',
      consulting_title: '기술 컨설팅',
      consulting_description: '아키텍처 설계 및 기술 전략 수립',
      support_title: '유지보수 및 지원',
      support_description: '24/7 기술 지원 및 시스템 모니터링',
    },
    en: {
      title: 'About Normad System',
      subtitle: 'Innovative Web System Development Company',
      whoWeAre: 'Who We Are',
      description1:
        'Normad System is a technology-driven development company that provides innovative solutions using the latest web technologies and cloud infrastructure. We develop the highest quality software to achieve our clients\' business goals.',
      description2:
        'With our experienced development team, we provide various services from web applications, mobile apps, to cloud infrastructure. We share the latest technology trends through our blog and contribute to the tech community.',
      servicesTitle: 'Our Services',
      techStackTitle: 'Tech Stack',
      ctaTitle: 'Ready to Start Your Project?',
      ctaSubtitle: 'We bring your ideas to life',
      contactUs: 'Contact Us',
      viewBlog: 'View Blog',
      webDev_title: 'Web Development',
      webDev_description: 'Building modern and responsive web applications',
      mobileDev_title: 'Mobile Development',
      mobileDev_description: 'Native and hybrid apps for iOS and Android',
      cloudInfra_title: 'Cloud Infrastructure',
      cloudInfra_description: 'Scalable infrastructure using AWS and Azure',
      devOps_title: 'DevOps',
      devOps_description: 'CI/CD pipelines and automation solutions',
      consulting_title: 'Technical Consulting',
      consulting_description: 'Architecture design and technology strategy',
      support_title: 'Maintenance & Support',
      support_description: '24/7 technical support and system monitoring',
    },
    ja: {
      title: 'Normad Systemについて',
      subtitle: '革新的なWebシステム開発専門企業',
      whoWeAre: '私たちについて',
      description1:
        'Normad Systemは、最新のWeb技術とクラウドインフラを活用して革新的なソリューションを提供する技術中心の開発会社です。お客様のビジネス目標を達成するために最高品質のソフトウェアを開発します。',
      description2:
        '経験豊富な開発チームと共に、Webアプリケーション、モバイルアプリ、クラウドインフラ構築まで様々なサービスを提供しています。最新の技術トレンドをブログで共有し、技術コミュニティに貢献しています。',
      servicesTitle: '提供サービス',
      techStackTitle: '技術スタック',
      ctaTitle: 'プロジェクトを始める準備はできましたか？',
      ctaSubtitle: 'あなたのアイデアを現実にします',
      contactUs: 'お問い合わせ',
      viewBlog: 'ブログを見る',
      webDev_title: 'Web開発',
      webDev_description: 'モダンでレスポンシブなWebアプリケーションを開発',
      mobileDev_title: 'モバイル開発',
      mobileDev_description: 'iOSとAndroid向けネイティブ&ハイブリッドアプリ',
      cloudInfra_title: 'クラウドインフラ',
      cloudInfra_description: 'AWSとAzureを活用したスケーラブルなインフラ構築',
      devOps_title: 'DevOps',
      devOps_description: 'CI/CDパイプラインと自動化ソリューション',
      consulting_title: '技術コンサルティング',
      consulting_description: 'アーキテクチャ設計と技術戦略策定',
      support_title: 'メンテナンス＆サポート',
      support_description: '24/7技術サポートとシステム監視',
    },
  };

  getText(key: string): string {
    const lang = this.languageService.getLanguage();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  getServiceText(serviceKey: string, type: 'title' | 'description'): string {
    const key = `${serviceKey}_${type}`;
    return this.getText(key);
  }
}
