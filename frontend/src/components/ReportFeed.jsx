import React, { useState, useEffect } from 'react';
import { Send, Image, Link2, Filter, MessageSquare, History, User } from 'lucide-react';
import axios from 'axios';

const ReportFeed = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [reports, setReports] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchReports();
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

    const fetchReports = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5001/api/reports/${selectedGroup}`);
            setReports(data.reports);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/reports', {
                groupId: selectedGroup,
                content
            });
            setContent('');
            fetchReports();
        } catch (err) {
            alert('Không thể đăng báo cáo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Báo cáo công việc</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Cập nhật tiến độ hàng ngày cho nhóm của bạn.</p>
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

            {/* Post Box */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-700">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea 
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Hôm nay bạn đã làm được gì? Chia sẻ ngay..."
                        className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-medium outline-none transition-all resize-none dark:text-white"
                        required
                    />
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <button type="button" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                                <Image size={20} />
                            </button>
                            <button type="button" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                                <Link2 size={20} />
                            </button>
                        </div>
                        <button 
                            disabled={loading || !content.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng...' : (
                                <>
                                    <span>Đăng báo cáo</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed List */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 ml-2">
                    <History size={20} className="text-indigo-500" />
                    Báo cáo gần đây
                </h2>

                {reports.map(report => (
                    <div key={report.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 group hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-black text-slate-900 dark:text-white text-lg">{report.name}</h3>
                                    <span className="text-xs font-bold text-slate-400">
                                        {new Date(report.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(report.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                                    {report.content}
                                </div>
                                
                                <div className="mt-6 flex items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors">
                                        <MessageSquare size={16} />
                                        <span>Thảo luận</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {reports.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-bold bg-slate-50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        Chưa có báo cáo nào trong nhóm này.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportFeed;
