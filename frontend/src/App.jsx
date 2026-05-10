import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useSettingsStore } from './stores/settingsStore';
import './api/client';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import ReportFeed from './components/ReportFeed';
import GroupManager from './components/GroupManager';
import Settings from './components/Settings';
import Tasks from './components/Tasks';
import Personnel from './components/Personnel';
import Timekeeping from './components/Timekeeping';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();
    if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Loading...</div>;
    return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
    const { checkAuth } = useAuthStore();
    const { theme } = useSettingsStore();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportFeed /></ProtectedRoute>} />
                <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
                <Route path="/timekeeping" element={<ProtectedRoute><Timekeeping /></ProtectedRoute>} />
                <Route path="/groups" element={<ProtectedRoute><GroupManager /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
