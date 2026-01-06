/**
 * Trust Score Calculation Utility
 * Calculates a "Propertifi Trust Score" for property managers based on multiple factors
 * Similar to PropertyManagement.com's TrueMatch™ scoring system
 */

export interface TrustScoreInput {
    bbb_rating?: string;
    years_in_business?: string | number;
    rentals_managed?: string | number;
    is_verified?: boolean;
    has_reviews?: boolean;
    review_score?: number;
    response_time_hours?: number;
}

export interface TrustScoreResult {
    score: number; // 0-100
    rating: 'Elite' | 'Excellent' | 'Good' | 'Fair' | 'New';
    breakdown: {
        trust: number;      // BBB + verified
        experience: number; // years + rentals
        performance: number; // reviews + response
    };
}

/**
 * Calculate Trust Score from PM data
 */
export function calculateTrustScore(data: TrustScoreInput): TrustScoreResult {
    let trustPoints = 0;
    let experiencePoints = 0;
    let performancePoints = 0;

    // Trust Component (max 35 points) - BBB Rating + Verification
    if (data.bbb_rating) {
        const rating = data.bbb_rating.toUpperCase();
        if (rating.startsWith('A+')) trustPoints += 25;
        else if (rating.startsWith('A')) trustPoints += 22;
        else if (rating.startsWith('B+')) trustPoints += 18;
        else if (rating.startsWith('B')) trustPoints += 15;
        else if (rating.startsWith('C')) trustPoints += 10;
        else trustPoints += 5; // Has rating but lower
    }

    if (data.is_verified) {
        trustPoints += 10;
    }

    // Experience Component (max 35 points) - Years + Properties
    const years = typeof data.years_in_business === 'string'
        ? parseInt(data.years_in_business) || 0
        : data.years_in_business || 0;

    if (years >= 20) experiencePoints += 20;
    else if (years >= 10) experiencePoints += 15;
    else if (years >= 5) experiencePoints += 10;
    else if (years >= 2) experiencePoints += 5;
    else experiencePoints += 2;

    const rentals = typeof data.rentals_managed === 'string'
        ? parseInt(data.rentals_managed) || 0
        : data.rentals_managed || 0;

    if (rentals >= 500) experiencePoints += 15;
    else if (rentals >= 200) experiencePoints += 12;
    else if (rentals >= 100) experiencePoints += 10;
    else if (rentals >= 50) experiencePoints += 7;
    else if (rentals >= 20) experiencePoints += 5;
    else experiencePoints += 2;

    // Performance Component (max 30 points) - Reviews + Response Time
    if (data.has_reviews && data.review_score) {
        if (data.review_score >= 4.5) performancePoints += 20;
        else if (data.review_score >= 4.0) performancePoints += 15;
        else if (data.review_score >= 3.5) performancePoints += 10;
        else performancePoints += 5;
    } else {
        performancePoints += 10; // Neutral if no reviews
    }

    if (data.response_time_hours !== undefined) {
        if (data.response_time_hours <= 1) performancePoints += 10;
        else if (data.response_time_hours <= 4) performancePoints += 8;
        else if (data.response_time_hours <= 24) performancePoints += 5;
        else performancePoints += 2;
    } else {
        performancePoints += 5; // Neutral if no data
    }

    // Calculate total score
    const totalScore = Math.min(100, trustPoints + experiencePoints + performancePoints);

    // Determine rating
    let rating: TrustScoreResult['rating'];
    if (totalScore >= 90) rating = 'Elite';
    else if (totalScore >= 75) rating = 'Excellent';
    else if (totalScore >= 60) rating = 'Good';
    else if (totalScore >= 40) rating = 'Fair';
    else rating = 'New';

    return {
        score: totalScore,
        rating,
        breakdown: {
            trust: trustPoints,
            experience: experiencePoints,
            performance: performancePoints,
        },
    };
}

/**
 * Get color classes for a trust score
 */
export function getTrustScoreColor(score: number): {
    bg: string;
    text: string;
    border: string;
    gradient: string;
} {
    if (score >= 90) {
        return {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            border: 'border-purple-300',
            gradient: 'from-purple-600 to-indigo-600',
        };
    }
    if (score >= 75) {
        return {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-300',
            gradient: 'from-green-600 to-emerald-600',
        };
    }
    if (score >= 60) {
        return {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-300',
            gradient: 'from-blue-600 to-cyan-600',
        };
    }
    if (score >= 40) {
        return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-300',
            gradient: 'from-yellow-600 to-orange-600',
        };
    }
    return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        gradient: 'from-gray-500 to-gray-600',
    };
}

/**
 * Get rating badge text
 */
export function getRatingBadgeText(rating: TrustScoreResult['rating']): string {
    const badges: Record<TrustScoreResult['rating'], string> = {
        'Elite': '🏆 Elite',
        'Excellent': '⭐ Excellent',
        'Good': '✓ Good',
        'Fair': 'Fair',
        'New': 'New',
    };
    return badges[rating];
}
