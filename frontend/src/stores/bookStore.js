import { create } from 'zustand';
import axios from 'axios';

export const useBookStore = create((set, get) => ({
    books: [],
    stats: { revenue: 0, expenses: 0, profit: 0 },
    loading: false,
    fetchBooks: async () => {
        set({ loading: true });
        const { data } = await axios.get('/api/books');
        set({ books: data, loading: false });
    },
    fetchStats: async () => {
        const { data } = await axios.get('/api/dashboard/stats');
        set({ stats: data });
    },
    createBook: async (name, type) => {
        const { data } = await axios.post('/api/books', { name, type });
        await get().fetchBooks();
        return data;
    }
}));
