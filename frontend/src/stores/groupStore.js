import { create } from 'zustand';

export const useGroupStore = create((set) => ({
    activeGroup: JSON.parse(localStorage.getItem('activeGroup')) || null,
    activeRole: localStorage.getItem('activeRole') || 'member',
    viewMode: localStorage.getItem('viewMode') || 'manager', // manager or employee
    
    setActiveGroup: (group, role) => {
        localStorage.setItem('activeGroup', JSON.stringify(group));
        localStorage.setItem('activeRole', role);
        set({ activeGroup: group, activeRole: role, viewMode: role === 'admin' ? 'manager' : 'employee' });
    },

    setViewMode: (mode) => {
        localStorage.setItem('viewMode', mode);
        set({ viewMode: mode });
    },
    
    clearActiveGroup: () => {
        localStorage.removeItem('activeGroup');
        localStorage.removeItem('activeRole');
        localStorage.removeItem('viewMode');
        set({ activeGroup: null, activeRole: 'member', viewMode: 'manager' });
    }
}));
