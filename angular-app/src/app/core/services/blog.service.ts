import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogResponse, BlogPost } from '../models/blog.model';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(private http: HttpClient) { }

    getBlogs(page: number = 1, limit: number = 9): Observable<BlogResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<BlogResponse>('/api/blogs', { params });
    }

    getBlogBySlug(slug: string): Observable<BlogPost> {
        return this.http.get<BlogPost>(`/api/blogs/${slug}`);
    }

    getLatestBlogs(limit: number = 3): Observable<BlogPost[]> {
        let params = new HttpParams().set('limit', limit.toString());
        return this.http.get<BlogPost[]>('/api/blogs/latest', { params });
    }
}
