import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GeocodingService {
    private http = inject(HttpClient);
    private apiKey = environment.googleMapsApiKey;

    geocode(address: string): Observable<{ lat: number, lng: number } | null> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
        return this.http.get<any>(url).pipe(
            map(response => {
                if (response.status === 'OK' && response.results && response.results.length > 0) {
                    return response.results[0].geometry.location;
                }
                return null;
            })
        );
    }
}
