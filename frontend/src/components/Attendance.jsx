import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle2, LogOut as LogOutIcon, Calendar, Filter } from 'lucide-react';
import axios from 'axios';

const Attendance = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [history, setHistory] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchGroups();
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchHistory();
        }
    }, [selectedGroup]);

    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/groups');
            setGroups(data.groups);
            if (data.groups.length > 0) setSelectedGroup(data.groups[0].id);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/attendance/${selectedGroup}/me`);
            setHistory(data.history);
            // Check if today is already checked in
            const today = new Date().toISOString().split('T')[0];
            const checkedInToday = data.history.find(h => h.check_in.startsWith(today) && !h.check_out);
            setIsCheckedIn(!!checkedInToday);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async () => {
        setLoading(true);
        try {
            if (!isCheckedIn) {
                await axios.post('http://localhost:5001/api/attendance/check-in', { groupId: selectedGroup });
            } else {
                await axios.post('http://localhost:5001/api/attendance/check-out', { groupId: selectedGroup });
            }
            fetchHistory();
        } catch (err) {
            alert(err.response?.data?.error || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Điểm danh</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Ghi lại thời gian làm việc của bạn hôm nay.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <Filter size={18} className="ml-2 text-slate-400" />
                    <select 
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value)}
                        className="bg-transparent border-none font-bold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer pr-8"
                    >
                        {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <div className="text-6xl font-black mb-2 tracking-tight">
                        {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-indigo-100 font-bold uppercase tracking-widest text-sm mb-12">
                        {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>

                    <button
                        onClick={handleAction}
                        disabled={loading || !selectedGroup}
                        className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
                            isCheckedIn 
                                ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-500/40 rotate-12 scale-105' 
                                : 'bg-white hover:scale-105 text-indigo-600 shadow-white/20'
                        } disabled:opacity-50 active:scale-95 group`}
                    >
                        {isCheckedIn ? <LogOutIcon size={40} /> : <CheckCircle2 size={40} />}
                        <span className="text-xs font-black uppercase mt-2">
                            {isCheckedIn ? 'Check-out' : 'Check-in'}
                        </span>
                    </button>

                    <div className="mt-12 flex items-center gap-2 text-indigo-100 bg-black/10 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md">
                        <MapPin size={14} />
                        <span>Work Location Verified</span>
                    </div>
                </div>

                {/* History List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar size={20} className="text-indigo-500" />
                            Lịch sử điểm danh
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left bg-slate-50 dark:bg-slate-900/50">
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Giờ vào</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Giờ ra</th>
                                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                {history.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-200">
                                            {new Date(row.check_in).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-8 py-5 font-black text-indigo-600 dark:text-indigo-400">
                                            {new Date(row.check_in).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-8 py-5 font-black text-slate-500 dark:text-slate-400">
                                            {row.check_out ? new Date(row.check_out).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '---'}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                row.check_out ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                                            }`}>
                                                {row.check_out ? 'Hoàn thành' : 'Đang làm'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold">
                                            Chưa có dữ liệu điểm danh.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
