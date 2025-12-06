import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bookmark, BookmarksResponse, SavedCalculation, SavedCalculationsResponse } from '../models/owner.model';

@Injectable({
    providedIn: 'root'
})
export class OwnerService {
    constructor(private http: HttpClient) { }

    getBookmarks(): Observable<BookmarksResponse> {
        return this.http.get<BookmarksResponse>('/api/owner/bookmarks');
    }

    toggleBookmark(leadId: number): Observable<any> {
        return this.http.post('/api/owner/bookmarks', { lead_id: leadId });
    }

    removeBookmark(bookmarkId: number): Observable<any> {
        return this.http.delete(`/api/owner/bookmarks/${bookmarkId}`);
    }

    getSavedCalculations(): Observable<SavedCalculationsResponse> {
        return this.http.get<SavedCalculationsResponse>('/api/owner/saved-calculations');
    }

    deleteCalculation(id: number): Observable<any> {
        return this.http.delete(`/api/owner/saved-calculations/${id}`);
    }
}
