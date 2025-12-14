import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost, BlogPostDetail, BlogPostsResponse } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/blog-posts';

  getPosts(page = 1, limit = 10, published = true): Observable<BlogPostsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('published', published.toString());

    return this.http.get<BlogPostsResponse>(this.apiUrl, { params });
  }

  getPostBySlug(slug: string): Observable<BlogPostDetail> {
    return this.http.get<BlogPostDetail>(`${this.apiUrl}/${slug}`);
  }

  getFeaturedPosts(limit = 3): Observable<BlogPost[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<BlogPost[]>(`${this.apiUrl}/featured`, { params });
  }

  incrementLike(slug: string): Observable<{ slug: string; likeCount: number }> {
    return this.http.post<{ slug: string; likeCount: number }>(
      `${this.apiUrl}/${slug}/like`,
      {}
    );
  }
}
