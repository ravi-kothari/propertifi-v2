
import { create } from 'zustand';

// Create a simple state store for user and token
// Include login, logout, register functions

interface AuthState {
    user: any;
    isLoading: boolean;
    login: (userData: any) => void;
    logout: () => void;
    register: (userData: any) => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: {id: '123', role: 'property_manager'}, // mock user
    isLoading: false,
    login: (userData) => set({ user: userData, isLoading: false }),
    logout: () => set({ user: null, isLoading: false }),
    register: (userData) => set({ user: userData, isLoading: false }),
}));
