import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../../models/blog.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-blog-card',
  imports: [CommonModule, RouterLink],
  template: `
    <article class="blog-card">
      <a [routerLink]="['/blog', post().slug]" class="card-link">
        @if (post().thumbnailUrl) {
          <div class="card-image">
            <img [src]="post().thumbnailUrl" [alt]="getTitle()" />
          </div>
        }
        <div class="card-content">
          <div class="card-meta">
            <span class="category" [style.background-color]="post().category.color">
              {{ post().category.icon }} {{ getCategoryName() }}
            </span>
            <span class="difficulty">{{ post().difficulty }}</span>
          </div>
          <h3 class="card-title">{{ getTitle() }}</h3>
          <p class="card-excerpt">{{ getExcerpt() }}</p>
          <div class="card-footer">
            <div class="author">
              @if (post().author.avatar) {
                <img [src]="post().author.avatar" [alt]="post().author.name" />
              }
              <span>{{ post().author.name }}</span>
            </div>
            <div class="stats">
              <span>👁️ {{ post().viewCount }}</span>
              <span>❤️ {{ post().likeCount }}</span>
              @if (post().readingTime) {
                <span>📖 {{ post().readingTime }}분</span>
              }
            </div>
          </div>
        </div>
      </a>
    </article>
  `,
  styles: [`
    .blog-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .category {
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      color: white;
    }

    .difficulty {
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      background: #f3f4f6;
      color: #6b7280;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .card-excerpt {
      color: #6b7280;
      margin-bottom: 1rem;
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .author img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .stats {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class BlogCardComponent {
  post = input.required<BlogPost>();

  constructor(private languageService: LanguageService) {}

  getTitle(): string {
    const lang = this.languageService.getLanguage();
    const post = this.post();
    return lang === 'ko' ? post.titleKo : lang === 'en' ? post.titleEn : post.titleJa;
  }

  getExcerpt(): string {
    const lang = this.languageService.getLanguage();
    const post = this.post();
    return lang === 'ko' 
      ? (post.excerptKo || '') 
      : lang === 'en' 
      ? (post.excerptEn || '') 
      : (post.excerptJa || '');
  }

  getCategoryName(): string {
    const lang = this.languageService.getLanguage();
    const category = this.post().category;
    return lang === 'ko' ? category.nameKo : lang === 'en' ? category.nameEn : category.nameJa;
  }
}
