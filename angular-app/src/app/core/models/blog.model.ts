export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    published_at: string;
    author_name: string;
    category_name?: string;
}

export interface BlogResponse {
    data: BlogPost[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
