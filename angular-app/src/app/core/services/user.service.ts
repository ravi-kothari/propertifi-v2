import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);

    getUsers(): Observable<{ data: User[] }> {
        return this.http.get<{ data: User[] }>(`/api/admin/users`);
    }

    getUser(id: number): Observable<{ data: User }> {
        return this.http.get<{ data: User }>(`/api/admin/users/${id}`);
    }
}
