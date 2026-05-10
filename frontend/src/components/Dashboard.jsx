import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useGroupStore } from '../stores/groupStore';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Zap,
  ClipboardList
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
    const { user } = useAuthStore();
    const { activeGroup, viewMode } = useGroupStore();
    const { language } = useSettingsStore();
    const navigate = useNavigate();
    const [latestReports, setLatestReports] = useState([]);
    const [stats, setStats] = useState({ present: 0, total: 0 });
    const [myTasks, setMyTasks] = useState([]);

    const t = translations[language];

    useEffect(() => {
        if (activeGroup) {
            fetchDashboardData();
        }
    }, [activeGroup, viewMode]);

    const fetchDashboardData = async () => {
        try {
            const reportRes = await axios.get(`http://localhost:5001/api/reports/${activeGroup.id}`);
            setLatestReports(reportRes.data.reports.slice(0, 5));

            if (viewMode === 'manager') {
                const memberRes = await axios.get(`http://localhost:5001/api/groups/${activeGroup.id}/members`);
                const attendanceRes = await axios.get(`http://localhost:5001/api/attendance/${activeGroup.id}/all`);
                
                setStats({
                    present: attendanceRes.data.records.length,
                    total: memberRes.data.members.length
                });
            } else {
                const taskRes = await axios.get(`http://localhost:5001/api/tasks/my`);
                setMyTasks(taskRes.data.tasks.filter(t => t.group_id === activeGroup.id && t.status !== 'done'));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!activeGroup) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-[32px] flex items-center justify-center animate-bounce">
                    <Users size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Chào mừng bạn!</h2>
                <p className="text-slate-500 max-w-md mx-auto">Vui lòng chọn một nhóm để bắt đầu quản lý hoặc thực hiện báo cáo công việc.</p>
                <button 
                    onClick={() => navigate('/groups')}
                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
                >
                    Chọn nhóm ngay
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t.welcome} {user?.name}! 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        {viewMode === 'manager' ? 'Hôm nay nhóm của bạn thế nào?' : 'Sẵn sàng hoàn thành công việc hôm nay chứ?'}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                        <Calendar size={18} className="text-indigo-500" />
                        <span className="font-bold">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </div>

            {/* Content Based on ViewMode */}
            {viewMode === 'manager' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <UserCheck size={100} className="text-indigo-600" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 w-fit mb-6">
                                <Users size={28} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Thành viên đi làm</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1">
                                {stats.present} <span className="text-xl text-slate-400 font-bold">/ {stats.total}</span>
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
                                <TrendingUp size={14} />
                                <span>Hoạt động tích cực</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <MessageSquare size={100} className="text-emerald-600" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400 w-fit mb-6">
                                <CheckCircle2 size={28} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Báo cáo mới</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1">
                                {latestReports.length} <span className="text-xl text-slate-400 font-bold">hôm nay</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => navigate('/attendance')}>
                        <div>
                            <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6 backdrop-blur-md">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-2xl font-black mb-1">Thời gian</h3>
                            <p className="text-indigo-100 font-medium text-sm">Xem chi tiết chấm công đội ngũ</p>
                        </div>
                        <div className="flex items-center justify-between mt-8">
                            <span className="font-bold text-sm">Đi đến trang chấm công</span>
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>
            ) : (
                /* Employee View */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Quick Attendance */}
                    <div 
                        onClick={() => navigate('/attendance')}
                        className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-500/20 group hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-1">Điểm danh nhanh</h3>
                        <p className="text-indigo-100 text-sm font-medium">Bắt đầu ngày làm việc của bạn</p>
                        <div className="mt-8 flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-widest">Nhấn để check-in</span>
                            <ArrowRight size={18} />
                        </div>
                    </div>

                    {/* Pending Tasks Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ClipboardList size={100} className="text-slate-900 dark:text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400 w-fit mb-6">
                                <ClipboardList size={28} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Công việc chờ xử lý</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white mt-1">
                                {myTasks.length} <span className="text-xl text-slate-400 font-bold">nhiệm vụ</span>
                            </p>
                        </div>
                    </div>

                    {/* Submit Report Card */}
                    <div 
                        onClick={() => navigate('/reports')}
                        className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-500/20 group hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <div className="p-4 bg-white/20 rounded-2xl w-fit mb-6">
                            <MessageSquare size={28} />
                        </div>
                        <h3 className="text-2xl font-black mb-1">Gửi báo cáo</h3>
                        <p className="text-emerald-100 text-sm font-medium">Cập nhật tiến độ công việc hôm nay</p>
                        <div className="mt-8 flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-widest">Gửi ngay</span>
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Báo cáo gần đây</h3>
                        <button onClick={() => navigate('/reports')} className="text-sm font-bold text-indigo-600 hover:underline">Tất cả</button>
                    </div>
                    <div className="space-y-4">
                        {latestReports.map(report => (
                            <div key={report.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 flex items-start gap-4 transition-all hover:border-slate-200 dark:hover:border-slate-600">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 shrink-0 uppercase">
                                    {report.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between">
                                        <p className="font-black text-slate-900 dark:text-white text-sm">{report.name}</p>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(report.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2">{report.content}</p>
                                </div>
                            </div>
                        ))}
                        {latestReports.length === 0 && (
                            <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                                Chưa có báo cáo nào
                            </div>
                        )}
                    </div>
                </div>

                {/* Second Column Based on Role */}
                <div className="space-y-6">
                    {viewMode === 'manager' ? (
                        <>
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nhóm của tôi</h3>
                                <button onClick={() => navigate('/groups')} className="text-sm font-bold text-indigo-600 hover:underline">Chi tiết</button>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center font-black text-3xl shadow-xl shadow-indigo-500/20">
                                        {activeGroup.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">{activeGroup.name}</h4>
                                        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">{activeGroup.invite_code}</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                    {activeGroup.description || 'Không có mô tả cho nhóm này.'}
                                </p>
                                <button 
                                    onClick={() => navigate('/personnel')}
                                    className="w-full py-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                                >
                                    Quản lý thành viên <ArrowRight size={14} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Việc cần làm</h3>
                                <button onClick={() => navigate('/tasks')} className="text-sm font-bold text-indigo-600 hover:underline">Xem tất cả</button>
                            </div>
                            <div className="space-y-4">
                                {myTasks.slice(0, 3).map(task => (
                                    <div key={task.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-amber-500 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                                                <Zap size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">{task.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hạn: {new Date(task.due_date).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-200 group-hover:text-amber-500 transition-all" />
                                    </div>
                                ))}
                                {myTasks.length === 0 && (
                                    <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                                        Không có công việc nào đang chờ
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
