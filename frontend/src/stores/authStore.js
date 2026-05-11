import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: async (phone, password) => {
        const { data } = await axios.post('/api/auth/login', { phone, password });
        set({ user: data.user, isAuthenticated: true });
    },
    register: async (phone, password, name, shop_name) => {
        await axios.post('/api/auth/register', { phone, password, name, shop_name });
    },
    logout: async () => {
        await axios.post('/api/auth/logout');
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        try {
            const { data } = await axios.get('/api/auth/me');
            set({ user: data.user, isAuthenticated: true, loading: false });
        } catch {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },
    setUser: (user) => set({ user, isAuthenticated: !!user })
}));
