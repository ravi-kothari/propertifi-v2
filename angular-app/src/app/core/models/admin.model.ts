export interface AdminAnalytics {
    revenue: {
        total: number;
        growth: number;
        history: { date: string; value: number }[];
    };
    users: {
        total: number;
        growth: number;
        breakdown: { role: string; count: number }[];
    };
    leads: {
        total: number;
        conversion_rate: number;
        recent: number;
    };
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author_name: string;
    published_at?: string;
    status: 'draft' | 'published';
    category_id: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    category: string;
    order: number;
    is_published: boolean;
}

export interface UserAction {
    userId: number;
    action: 'verify' | 'assign_role' | 'impersonate';
    payload?: any;
}
