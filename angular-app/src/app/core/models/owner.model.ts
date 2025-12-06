import { Lead } from './lead.model';
import { RoiInput, RoiResult, MortgageInput, MortgageResult } from './calculator.model';

export interface Bookmark {
    id: number;
    user_id: number;
    lead_id: number;
    created_at: string;
    updated_at: string;
    lead?: Lead;
}

export interface SavedCalculation {
    id: number;
    user_id: number;
    name: string;
    type: 'roi' | 'mortgage';
    inputs: RoiInput | MortgageInput;
    results: RoiResult | MortgageResult;
    created_at: string;
    updated_at: string;
}

export interface BookmarksResponse {
    data: Bookmark[];
}

export interface SavedCalculationsResponse {
    data: SavedCalculation[];
}
