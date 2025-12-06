import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoiInput, RoiResult, MortgageInput, MortgageResult } from '../models/calculator.model';

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    constructor(private http: HttpClient) { }

    calculateRoi(data: RoiInput): Observable<RoiResult> {
        return this.http.post<RoiResult>('/api/calculators/roi', data);
    }

    calculateMortgage(data: MortgageInput): Observable<MortgageResult> {
        return this.http.post<MortgageResult>('/api/calculators/mortgage', data);
    }
}
