import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPostService } from '../../services/blog-post.service';
import { LanguageService } from '../../services/language.service';
import { BlogPostDetail } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="blog-detail">
      @if (loading()) {
        <div class="loading-container">
          <div class="loading">Loading...</div>
        </div>
      } @else if (post()) {
        <article class="article">
          <!-- Header -->
          <header class="article-header">
            <div class="container">
              <div class="breadcrumb">
                <a routerLink="/">Home</a>
                <span>/</span>
                <a routerLink="/blog">Blog</a>
                <span>/</span>
                <a [routerLink]="['/category', post()!.category.slug]">
                  {{ getCategoryName() }}
                </a>
              </div>

              <div class="category-badge" [style.background-color]="post()!.category.color">
                {{ post()!.category.icon }} {{ getCategoryName() }}
              </div>

              <h1 class="article-title">{{ getTitle() }}</h1>

              <div class="article-meta">
                <div class="author-info">
                  @if (post()!.author.avatar) {
                    <img [src]="post()!.author.avatar" [alt]="post()!.author.name" class="avatar" />
                  }
                  <div>
                    <div class="author-name">{{ post()!.author.name }}</div>
                    <div class="publish-date">{{ formatDate(post()!.publishedAt) }}</div>
                  </div>
                </div>

                <div class="article-stats">
                  <span class="stat">
                    <span class="difficulty-badge">{{ post()!.difficulty }}</span>
                  </span>
                  @if (post()!.readingTime) {
                    <span class="stat">📖 {{ post()!.readingTime }}{{ getText('min') }}</span>
                  }
                  <span class="stat">👁️ {{ post()!.viewCount }}</span>
                  <span class="stat">
                    <button (click)="likePost()" class="like-btn" [class.liked]="hasLiked()">
                      ❤️ {{ post()!.likeCount }}
                    </button>
                  </span>
                </div>
              </div>

              @if (post()!.thumbnailUrl) {
                <div class="thumbnail">
                  <img [src]="post()!.thumbnailUrl" [alt]="getTitle()" />
                </div>
              }
            </div>
          </header>

          <!-- Content -->
          <section class="article-content">
            <div class="container">
              <div class="content-wrapper">
                <div class="markdown-content" [innerHTML]="getContent()"></div>
              </div>

              <!-- Tags -->
              @if (post()!.metaKeywords.length > 0) {
                <div class="tags">
                  <h3>{{ getText('tags') }}</h3>
                  <div class="tag-list">
                    @for (keyword of post()!.metaKeywords; track keyword) {
                      <span class="tag">{{ keyword }}</span>
                    }
                  </div>
                </div>
              }

              <!-- Author Bio -->
              @if (post()!.author.bio) {
                <div class="author-bio">
                  <h3>{{ getText('aboutAuthor') }}</h3>
                  <div class="bio-content">
                    @if (post()!.author.avatar) {
                      <img [src]="post()!.author.avatar" [alt]="post()!.author.name" class="bio-avatar" />
                    }
                    <div>
                      <div class="bio-name">{{ post()!.author.name }}</div>
                      <p class="bio-text">{{ post()!.author.bio }}</p>
                    </div>
                  </div>
                </div>
              }

              <!-- CTA Section -->
              <div class="cta-section">
                <div class="cta-content">
                  <h3>{{ getText('cta.title') }}</h3>
                  <p>{{ getText('cta.text') }}</p>
                  <a routerLink="/contact" class="btn-primary">{{ getText('cta.button') }}</a>
                </div>
              </div>
            </div>
          </section>
        </article>
      } @else {
        <div class="error-container">
          <div class="error">Post not found</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .blog-detail {
      min-height: 100vh;
      background: #f9fafb;
    }

    .container {
      max-width: 900px;
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

    .article {
      background: white;
    }

    .article-header {
      padding: 2rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .breadcrumb {
      display: flex;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .breadcrumb a {
      color: #3B82F6;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .category-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .article-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar, .bio-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .author-name {
      font-weight: 600;
      color: #1f2937;
    }

    .publish-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .article-stats {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      font-size: 0.875rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
    }

    .difficulty-badge {
      padding: 0.25rem 0.75rem;
      background: #f3f4f6;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .like-btn {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .like-btn:hover {
      background: #fee2e2;
    }

    .like-btn.liked {
      background: #fecaca;
    }

    .thumbnail {
      width: 100%;
      max-height: 500px;
      overflow: hidden;
      border-radius: 12px;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .article-content {
      padding: 3rem 0;
    }

    .content-wrapper {
      background: white;
      padding: 2rem 0;
    }

    .markdown-content {
      line-height: 1.8;
      color: #374151;
      font-size: 1.125rem;
    }

    .markdown-content :deep(h2) {
      font-size: 2rem;
      font-weight: 700;
      margin: 2rem 0 1rem;
      color: #1f2937;
    }

    .markdown-content :deep(h3) {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 1.5rem 0 1rem;
      color: #1f2937;
    }

    .markdown-content :deep(p) {
      margin-bottom: 1.5rem;
    }

    .markdown-content :deep(code) {
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }

    .markdown-content :deep(pre) {
      background: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1.5rem;
    }

    .markdown-content :deep(pre code) {
      background: none;
      padding: 0;
      color: inherit;
    }

    .tags {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .tags h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tag {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border-radius: 20px;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .author-bio {
      margin-top: 3rem;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 12px;
    }

    .author-bio h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .bio-content {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .bio-avatar {
      width: 80px;
      height: 80px;
    }

    .bio-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .bio-text {
      color: #6b7280;
      line-height: 1.6;
    }

    .cta-section {
      margin-top: 3rem;
      padding: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      text-align: center;
      color: white;
    }

    .cta-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-content p {
      font-size: 1.125rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .btn-primary {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: white;
      color: #667eea;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .article-title {
        font-size: 1.75rem;
      }

      .article-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .bio-content {
        flex-direction: column;
      }

      .cta-section {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogPostService = inject(BlogPostService);
  private languageService = inject(LanguageService);

  post = signal<BlogPostDetail | null>(null);
  loading = signal(true);
  hasLiked = signal(false);

  private translations = {
    ko: {
      min: '분',
      tags: '태그',
      aboutAuthor: '작성자 소개',
      'cta.title': '프로젝트 문의하기',
      'cta.text': 'FitSystem과 함께 프로젝트를 시작하세요',
      'cta.button': '무료 상담 받기',
    },
    en: {
      min: ' min',
      tags: 'Tags',
      aboutAuthor: 'About the Author',
      'cta.title': 'Start Your Project',
      'cta.text': 'Begin your journey with FitSystem',
      'cta.button': 'Get Free Consultation',
    },
    ja: {
      min: '分',
      tags: 'タグ',
      aboutAuthor: '著者について',
      'cta.title': 'プロジェクトのお問い合わせ',
      'cta.text': 'FitSystemと一緒にプロジェクトを始めましょう',
      'cta.button': '無料相談を受ける',
    },
  };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadPost(slug);
      }
    });

    // Check if user has liked from localStorage
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      const liked = localStorage.getItem(`liked_${slug}`);
      this.hasLiked.set(liked === 'true');
    }
  }

  private loadPost(slug: string) {
    this.loading.set(true);
    this.blogPostService.getPostBySlug(slug).subscribe({
      next: (data) => {
        this.post.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.loading.set(false);
      },
    });
  }

  likePost() {
    const currentPost = this.post();
    if (!currentPost || this.hasLiked()) return;

    this.blogPostService.incrementLike(currentPost.slug).subscribe({
      next: (data) => {
        this.post.set({ ...currentPost, likeCount: data.likeCount });
        this.hasLiked.set(true);
        localStorage.setItem(`liked_${currentPost.slug}`, 'true');
      },
      error: (err) => console.error('Failed to like post:', err),
    });
  }

  getText(key: string): string {
    const lang = this.languageService.getLanguage();
    return this.translations[lang][key as keyof typeof this.translations.ko] || key;
  }

  getTitle(): string {
    const lang = this.languageService.getLanguage();
    const post = this.post();
    if (!post) return '';
    return lang === 'ko' ? post.titleKo : lang === 'en' ? post.titleEn : post.titleJa;
  }

  getContent(): string {
    const lang = this.languageService.getLanguage();
    const post = this.post();
    if (!post) return '';
    const content = lang === 'ko' ? post.contentKo : lang === 'en' ? post.contentEn : post.contentJa;
    // Simple markdown to HTML conversion (you might want to use a proper library like marked.js)
    return content.replace(/\n/g, '<br>');
  }

  getCategoryName(): string {
    const lang = this.languageService.getLanguage();
    const post = this.post();
    if (!post) return '';
    const category = post.category;
    return lang === 'ko' ? category.nameKo : lang === 'en' ? category.nameEn : category.nameJa;
  }

  formatDate(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.languageService.getLanguage());
  }
}
