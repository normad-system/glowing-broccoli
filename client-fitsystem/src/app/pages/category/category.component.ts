import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { LanguageService } from '../../services/language.service';
import { Category, BlogPost } from '../../models/blog.model';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, RouterLink, BlogCardComponent],
  template: `
    <div class="category-page">
      @if (loading()) {
        <div class="loading-container">
          <div class="loading">Loading...</div>
        </div>
      } @else if (category()) {
        <div>
          <!-- Header -->
          <section class="category-header">
            <div class="container">
              <div class="breadcrumb">
                <a routerLink="/">Home</a>
                <span>/</span>
                <a routerLink="/blog">Blog</a>
                <span>/</span>
                <span>{{ getCategoryName() }}</span>
              </div>

              <div class="header-content">
                <div class="category-icon">{{ category()!.icon }}</div>
                <h1 class="category-title">{{ getCategoryName() }}</h1>
                <p class="category-description">{{ getCategoryDescription() }}</p>
                <div class="category-stats">
                  <span>{{ getText('totalPosts') }}: {{ totalPosts() }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Posts -->
          <section class="posts-section">
            <div class="container">
              @if (posts().length === 0) {
                <div class="empty-state">
                  <p>{{ getText('noPosts') }}</p>
                  <a routerLink="/blog" class="btn-secondary">
                    {{ getText('viewAllPosts') }}
                  </a>
                </div>
              } @else {
                <div class="posts-grid">
                  @for (post of posts(); track post.id) {
                    <app-blog-card [post]="post" />
                  }
                </div>

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
                        @if (page === -1) {
                          <span class="ellipsis">...</span>
                        } @else {
                          <button
                            (click)="goToPage(page)"
                            [class.active]="currentPage() === page"
                            class="page-number">
                            {{ page }}
                          </button>
                        }
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
              }
            </div>
          </section>

          <!-- Related Categories -->
          <section class="related-categories">
            <div class="container">
              <h2 class="section-title">{{ getText('otherCategories') }}</h2>
              <div class="categories-grid">
                @for (cat of relatedCategories(); track cat.id) {
                  <a [routerLink]="['/category', cat.slug]" class="category-card">
                    <span class="card-icon">{{ cat.icon }}</span>
                    <h3 class="card-title">{{ getOtherCategoryName(cat) }}</h3>
                    <p class="card-count">{{ cat._count?.posts || 0 }} {{ getText('posts') }}</p>
                  </a>
                }
              </div>
            </div>
          </section>
        </div>
      } @else {
        <div class="error-container">
          <div class="error">Category not found</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .category-page {
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .loading-container, .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 50vh;
    }

    .loading, .error {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .category-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
    }

    .breadcrumb {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .breadcrumb a {
      color: white;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .header-content {
      text-align: center;
    }

    .category-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .category-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .category-description {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 1rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .category-stats {
      font-size: 0.875rem;
      opacity: 0.8;
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

    .empty-state {
      text-align: center;
      padding: 4rem 0;
    }

    .empty-state p {
      font-size: 1.125rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .btn-secondary {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: white;
      color: #3B82F6;
      border: 2px solid #3B82F6;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #3B82F6;
      color: white;
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
      align-items: center;
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

    .ellipsis {
      padding: 0 0.5rem;
      color: #9ca3af;
    }

    .related-categories {
      background: #f9fafb;
      padding: 4rem 0;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
      text-align: center;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .card-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .category-title {
        font-size: 2rem;
      }

      .category-icon {
        font-size: 3.5rem;
      }
    }
  `]
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private languageService = inject(LanguageService);

  category = signal<Category | null>(null);
  posts = signal<BlogPost[]>([]);
  relatedCategories = signal<Category[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  totalPosts = signal(0);

  private translations = {
    ko: {
      totalPosts: '총 게시글',
      noPosts: '게시글이 없습니다',
      viewAllPosts: '전체 글 보기',
      prev: '이전',
      next: '다음',
      otherCategories: '다른 카테고리',
      posts: '개',
    },
    en: {
      totalPosts: 'Total Posts',
      noPosts: 'No posts found',
      viewAllPosts: 'View All Posts',
      prev: 'Previous',
      next: 'Next',
      otherCategories: 'Other Categories',
      posts: 'posts',
    },
    ja: {
      totalPosts: '総投稿数',
      noPosts: '投稿がありません',
      viewAllPosts: 'すべての記事を見る',
      prev: '前へ',
      next: '次へ',
      otherCategories: '他のカテゴリー',
      posts: '件',
    },
  };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadCategory(slug);
        this.loadRelatedCategories(slug);
      }
    });
  }

  private loadCategory(slug: string) {
    this.loading.set(true);
    const page = this.currentPage();

    this.categoryService.getCategoryWithPosts(slug, page, 12).subscribe({
      next: (data) => {
        this.category.set(data.category);
        this.posts.set(data.posts);
        this.totalPages.set(data.pagination.totalPages);
        this.totalPosts.set(data.pagination.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load category:', err);
        this.loading.set(false);
      },
    });
  }

  private loadRelatedCategories(excludeSlug: string) {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        const filtered = data.filter(cat => cat.slug !== excludeSlug).slice(0, 6);
        this.relatedCategories.set(filtered);
      },
      error: (err) => console.error('Failed to load related categories:', err),
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      const slug = this.route.snapshot.params['slug'];
      if (slug) {
        this.loadCategory(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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

  getCategoryName(): string {
    const lang = this.languageService.getLanguage();
    const cat = this.category();
    if (!cat) return '';
    return lang === 'ko' ? cat.nameKo : lang === 'en' ? cat.nameEn : cat.nameJa;
  }

  getCategoryDescription(): string {
    const lang = this.languageService.getLanguage();
    const cat = this.category();
    if (!cat) return '';
    return lang === 'ko' 
      ? (cat.descriptionKo || '') 
      : lang === 'en' 
      ? (cat.descriptionEn || '') 
      : (cat.descriptionJa || '');
  }

  getOtherCategoryName(category: Category): string {
    const lang = this.languageService.getLanguage();
    return lang === 'ko' ? category.nameKo : lang === 'en' ? category.nameEn : category.nameJa;
  }
}
