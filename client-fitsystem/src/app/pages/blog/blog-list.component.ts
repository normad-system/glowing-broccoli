import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../services/blog-post.service';
import { CategoryService } from '../../services/category.service';
import { LanguageService } from '../../services/language.service';
import { BlogPost, Category } from '../../models/blog.model';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-blog-list',
  imports: [CommonModule, RouterLink, BlogCardComponent],
  template: `
    <div class="blog-list">
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">{{ getText('title') }}</h1>
          <p class="hero-subtitle">{{ getText('subtitle') }}</p>
        </div>
      </section>

      <!-- Category Filter -->
      <section class="filter-section">
        <div class="container">
          <div class="category-filter">
            <button
              (click)="filterByCategory(null)"
              [class.active]="selectedCategory() === null"
              class="filter-btn">
              {{ getText('all') }}
            </button>
            @for (category of categories(); track category.id) {
              <button
                (click)="filterByCategory(category.slug)"
                [class.active]="selectedCategory() === category.slug"
                class="filter-btn">
                {{ category.icon }} {{ getCategoryName(category) }}
              </button>
            }
          </div>
        </div>
      </section>

      <!-- Posts Grid -->
      <section class="posts-section">
        <div class="container">
          @if (loading()) {
            <div class="loading">Loading...</div>
          } @else if (posts().length === 0) {
            <div class="empty-state">
              <p>{{ getText('noPosts') }}</p>
            </div>
          } @else {
            <div class="posts-grid">
              @for (post of posts(); track post.id) {
                <app-blog-card [post]="post" />
              }
            </div>
          }

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="pagination">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="page-btn">
                ← {{ getText('prev') }}
              </button>
              
              <div class="page-numbers">
                @for (page of getPageNumbers(); track page) {
                  <button
                    (click)="goToPage(page)"
                    [class.active]="currentPage() === page"
                    class="page-number">
                    {{ page }}
                  </button>
                }
              </div>

              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="page-btn">
                {{ getText('next') }} →
              </button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .blog-list {
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
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .filter-section {
      background: white;
      padding: 2rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .category-filter {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filter-btn {
      padding: 0.5rem 1.5rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 24px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }

    .filter-btn.active {
      background: #3B82F6;
      border-color: #3B82F6;
      color: white;
    }

    .posts-section {
      padding: 4rem 0;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 4rem 0;
      font-size: 1.125rem;
      color: #6b7280;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 3rem;
    }

    .page-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #3B82F6;
      color: #3B82F6;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 0.5rem;
    }

    .page-number {
      width: 40px;
      height: 40px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .page-number:hover {
      background: #f9fafb;
      border-color: #3B82F6;
    }

    .page-number.active {
      background: #3B82F6;
      border-color: #3B82F6;
      color: white;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .category-filter {
        justify-content: flex-start;
      }
    }
  `]
})
export class BlogListComponent implements OnInit {
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryService);
  private languageService = inject(LanguageService);

  categories = signal<Category[]>([]);
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  selectedCategory = signal<string | null>(null);

  private translations = {
    ko: {
      title: '기술 블로그',
      subtitle: '최신 기술 트렌드와 개발 노하우를 공유합니다',
      all: '전체',
      noPosts: '게시글이 없습니다',
      prev: '이전',
      next: '다음',
    },
    en: {
      title: 'Tech Blog',
      subtitle: 'Sharing latest tech trends and development know-how',
      all: 'All',
      noPosts: 'No posts found',
      prev: 'Previous',
      next: 'Next',
    },
    ja: {
      title: '技術ブログ',
      subtitle: '最新技術トレンドと開発ノウハウを共有します',
      all: '全体',
      noPosts: '投稿がありません',
      prev: '前へ',
      next: '次へ',
    },
  };

  ngOnInit() {
    this.loadCategories();
    this.loadPosts();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Failed to load categories:', err),
    });
  }

  private loadPosts() {
    this.loading.set(true);
    const page = this.currentPage();
    const category = this.selectedCategory();

    if (category) {
      this.categoryService.getCategoryWithPosts(category, page, 12).subscribe({
        next: (data) => {
          this.posts.set(data.posts);
          this.totalPages.set(data.pagination.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load posts:', err);
          this.loading.set(false);
        },
      });
    } else {
      this.blogPostService.getPosts(page, 12).subscribe({
        next: (data) => {
          this.posts.set(data.posts);
          this.totalPages.set(data.pagination.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load posts:', err);
          this.loading.set(false);
        },
      });
    }
  }

  filterByCategory(slug: string | null) {
    this.selectedCategory.set(slug);
    this.currentPage.set(1);
    this.loadPosts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1, -1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-1, total);
      }
    }

    return pages;
  }

  getText(key: string): string {
    const lang = this.languageService.getLanguage();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  getCategoryName(category: Category): string {
    const lang = this.languageService.getLanguage();
    return lang === 'ko' ? category.nameKo : lang === 'en' ? category.nameEn : category.nameJa;
  }
}
