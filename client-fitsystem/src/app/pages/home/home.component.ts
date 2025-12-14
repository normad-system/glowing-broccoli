import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../services/blog-post.service';
import { CategoryService } from '../../services/category.service';
import { LanguageService } from '../../services/language.service';
import { BlogPost, Category } from '../../models/blog.model';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, BlogCardComponent],
  template: `
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">{{ getText('hero.title') }}</h1>
          <p class="hero-subtitle">{{ getText('hero.subtitle') }}</p>
        </div>
      </section>

      <!-- Categories -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">{{ getText('categories') }}</h2>
          <div class="categories-grid">
            @for (category of categories(); track category.id) {
              <a [routerLink]="['/category', category.slug]" class="category-card">
                <span class="category-icon">{{ category.icon }}</span>
                <h3 class="category-name">{{ getCategoryName(category) }}</h3>
                <p class="category-description">{{ getCategoryDescription(category) }}</p>
                <span class="category-count">{{ category._count?.posts || 0 }} posts</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- Featured Posts -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">{{ getText('featured') }}</h2>
          <div class="posts-grid">
            @for (post of featuredPosts(); track post.id) {
              <app-blog-card [post]="post" />
            }
          </div>
        </div>
      </section>

      <!-- Recent Posts -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">{{ getText('recent') }}</h2>
          <div class="posts-grid">
            @for (post of recentPosts(); track post.id) {
              <app-blog-card [post]="post" />
            }
          </div>
          <div class="view-all">
            <a routerLink="/blog" class="btn-primary">{{ getText('viewAll') }}</a>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <h2 class="cta-title">{{ getText('cta.title') }}</h2>
          <p class="cta-text">{{ getText('cta.text') }}</p>
          <a routerLink="/contact" class="btn-primary">{{ getText('cta.button') }}</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home {
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
      padding: 6rem 0;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      opacity: 0.9;
    }

    .section {
      padding: 4rem 0;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .category-icon {
      font-size: 3rem;
    }

    .category-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .category-description {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
      flex: 1;
    }

    .category-count {
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .view-all {
      text-align: center;
      margin-top: 3rem;
    }

    .btn-primary {
      background: #3B82F6;
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563EB;
    }

    .cta-section {
      background: #f9fafb;
      padding: 4rem 0;
      text-align: center;
    }

    .cta-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-text {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.125rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryService);
  private languageService = inject(LanguageService);

  categories = signal<Category[]>([]);
  featuredPosts = signal<BlogPost[]>([]);
  recentPosts = signal<BlogPost[]>([]);

  private translations = {
    ko: {
      'hero.title': '기술로 더 나은 내일을 만듭니다',
      'hero.subtitle': '웹 개발, 클라우드, 보안 - 최신 기술 트렌드와 실전 노하우',
      'categories': '카테고리',
      'featured': '인기 글',
      'recent': '최신 글',
      'viewAll': '모든 글 보기',
      'cta.title': '프로젝트가 있으신가요?',
      'cta.text': 'FitSystem이 함께합니다. 지금 문의하세요.',
      'cta.button': '무료 상담 받기',
    },
    en: {
      'hero.title': 'Building a Better Tomorrow with Technology',
      'hero.subtitle': 'Web Development, Cloud, Security - Latest Tech Trends and Practical Know-how',
      'categories': 'Categories',
      'featured': 'Featured Posts',
      'recent': 'Recent Posts',
      'viewAll': 'View All Posts',
      'cta.title': 'Have a Project?',
      'cta.text': 'Let FitSystem help you. Contact us now.',
      'cta.button': 'Get Free Consultation',
    },
    ja: {
      'hero.title': 'テクノロジーでより良い明日を作る',
      'hero.subtitle': 'Web開発、クラウド、セキュリティ - 最新技術トレンドと実践ノウハウ',
      'categories': 'カテゴリー',
      'featured': '人気記事',
      'recent': '最新記事',
      'viewAll': 'すべての記事を見る',
      'cta.title': 'プロジェクトがありますか？',
      'cta.text': 'FitSystemがお手伝いします。今すぐお問い合わせください。',
      'cta.button': '無料相談を受ける',
    },
  };

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories:', err),
    });

    this.blogPostService.getFeaturedPosts(3).subscribe({
      next: (data) => this.featuredPosts.set(data),
      error: (err) => console.error('Failed to load featured posts:', err),
    });

    this.blogPostService.getPosts(1, 6).subscribe({
      next: (data) => this.recentPosts.set(data.posts),
      error: (err) => console.error('Failed to load recent posts:', err),
    });
  }

  getText(key: string): string {
    const lang = this.languageService.getLanguage();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  getCategoryName(category: Category): string {
    const lang = this.languageService.getLanguage();
    return lang === 'ko' ? category.nameKo : lang === 'en' ? category.nameEn : category.nameJa;
  }

  getCategoryDescription(category: Category): string {
    const lang = this.languageService.getLanguage();
    return lang === 'ko' 
      ? (category.descriptionKo || '') 
      : lang === 'en' 
      ? (category.descriptionEn || '') 
      : (category.descriptionJa || '');
  }
}
