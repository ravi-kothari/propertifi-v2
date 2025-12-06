export type UserRole = 'property_manager' | 'owner' | 'admin';
export type UserType = 'admin' | 'pm' | 'owner' | 'AccountManager';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: UserRole;
    type?: UserType;
    role_id?: number | null;
    permissions?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: 'Bearer';
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
