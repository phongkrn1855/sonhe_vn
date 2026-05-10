import React, { useState, useEffect } from 'react';
import { Users, Plus, Hash, ArrowRight, Shield, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useGroupStore } from '../stores/groupStore';

const GroupManager = () => {
    const { setActiveGroup } = useGroupStore();
    const [groups, setGroups] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/groups');
            setGroups(data.groups);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/groups', { name: newName, description: newDesc });
            setNewName('');
            setNewDesc('');
            fetchGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Không thể tạo nhóm');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/groups/join', { invite_code: inviteCode });
            setInviteCode('');
            fetchGroups();
        } catch (err) {
            setError(err.response?.data?.error || 'Mã mời không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Quản lý Nhóm</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Tạo hoặc tham gia nhóm để bắt đầu điểm danh và báo cáo.</p>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Join Group */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Tham gia nhóm</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Nhập mã mời từ quản trị viên nhóm của bạn.</p>
                    
                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input 
                            type="text"
                            value={inviteCode}
                            onChange={e => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="MÃ MỜI (VD: ABCXYZ)"
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-xl font-bold outline-none transition-all dark:text-white"
                            maxLength={10}
                        />
                        <button 
                            disabled={loading || !inviteCode}
                            className="px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                {/* Create Group */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                        <Plus size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Tạo nhóm mới</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Bắt đầu một không gian làm việc mới cho đội ngũ của bạn.</p>
                    
                    <form onSubmit={handleCreate} className="space-y-3">
                        <input 
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Tên nhóm"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl font-bold outline-none transition-all dark:text-white"
                            required
                        />
                        <input 
                            type="text"
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            placeholder="Mô tả (không bắt buộc)"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-xl font-bold outline-none transition-all dark:text-white"
                        />
                        <button 
                            disabled={loading || !newName}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo nhóm ngay'}
                        </button>
                    </form>
                </div>
            </div>

            {/* My Groups List */}
            <section className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={20} className="text-indigo-500" />
                    Nhóm của bạn ({groups.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <div key={group.id} className="bg-white dark:bg-slate-800 p-6 rounded-[28px] border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                    {group.name[0].toUpperCase()}
                                </div>
                                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${group.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {group.role}
                                </span>
                            </div>
                            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-1">{group.name}</h3>
                            <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">{group.description || 'Không có mô tả'}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                    <Hash size={14} />
                                    <span>{group.invite_code}</span>
                                </div>
                                {group.role === 'admin' && (
                                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                        <Shield size={16} />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => {
                                    setActiveGroup(group, group.role);
                                    window.location.href = '/';
                                }}
                                className="w-full mt-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/10 dark:shadow-white/10"
                            >
                                Vào nhóm
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GroupManager;
