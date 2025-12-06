import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminAnalytics, BlogPost, Faq } from '../models/admin.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    // Analytics
    getAnalytics(): Observable<AdminAnalytics> {
        return this.http.get<AdminAnalytics>(`${this.apiUrl}/analytics`);
    }

    // CMS - Blogs
    getBlogs(): Observable<{ data: BlogPost[] }> {
        return this.http.get<{ data: BlogPost[] }>(`${this.apiUrl}/blogs`);
    }

    createBlog(blog: Partial<BlogPost>): Observable<BlogPost> {
        return this.http.post<BlogPost>(`${this.apiUrl}/blogs`, blog);
    }

    updateBlog(id: number, blog: Partial<BlogPost>): Observable<BlogPost> {
        return this.http.put<BlogPost>(`${this.apiUrl}/blogs/${id}`, blog);
    }

    deleteBlog(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/blogs/${id}`);
    }

    // CMS - FAQs
    getFaqs(): Observable<{ data: Faq[] }> {
        return this.http.get<{ data: Faq[] }>(`${this.apiUrl}/faqs`);
    }

    createFaq(faq: Partial<Faq>): Observable<Faq> {
        return this.http.post<Faq>(`${this.apiUrl}/faqs`, faq);
    }

    updateFaq(id: number, faq: Partial<Faq>): Observable<Faq> {
        return this.http.put<Faq>(`${this.apiUrl}/faqs/${id}`, faq);
    }

    deleteFaq(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/faqs/${id}`);
    }

    // User Management
    verifyUser(userId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/users/${userId}/verify`, {});
    }

    assignRole(userId: number, role: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/users/${userId}/assign-role`, { role });
    }
}
