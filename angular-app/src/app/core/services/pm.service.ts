import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PropertyResponse, MarketInsight, LeadScore } from '../models/pm.model';

@Injectable({
    providedIn: 'root'
})
export class PmService {
    private apiUrl = `${environment.apiUrl}/pm`;

    constructor(private http: HttpClient) { }

    getProperties(filters?: any): Observable<PropertyResponse> {
        const params: any = {};
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key] !== 'all') {
                    params[key] = filters[key];
                }
            });
        }
        return this.http.get<PropertyResponse>(`${this.apiUrl}/properties`, { params });
    }

    getMarketInsights(): Observable<{ data: MarketInsight[] }> {
        return this.http.get<{ data: MarketInsight[] }>(`${environment.apiUrl}/v1/market-insights`);
    }

    getLeadScores(): Observable<{ data: LeadScore[] }> {
        return this.http.get<{ data: LeadScore[] }>(`${environment.apiUrl}/v1/leads/scores`);
    }
}
