import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Download,
  Filter,
  UserCheck
} from 'lucide-react';
import axios from 'axios';

export default function Timekeeping() {
    const { language } = useSettingsStore();
    const t = translations[language];
    const [summary, setSummary] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) fetchSummary();
    }, [selectedGroup, month, year]);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/groups');
            setGroups(res.data.groups);
            if (res.data.groups.length > 0) setSelectedGroup(res.data.groups[0].id);
        } catch (err) { console.error(err); }
    };

    const fetchSummary = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/attendance/${selectedGroup}/summary?month=${month}&year=${year}`);
            setSummary(res.data.summary);
        } catch (err) { console.error(err); }
    };

    const changeMonth = (delta) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        setMonth(newMonth);
        setYear(newYear);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Chấm công</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Báo cáo chuyên cần và tổng hợp giờ làm tháng {month}/{year}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                        <Download size={20} />
                    </button>
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-400">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-4 font-black text-slate-900 dark:text-white border-x border-slate-50 dark:border-slate-700">
                            Tháng {month}, {year}
                        </div>
                        <button onClick={() => changeMonth(1)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-400">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Group Selector */}
            <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-[24px] border border-slate-100 dark:border-slate-700 w-full md:w-fit overflow-x-auto no-scrollbar">
                {groups.map(group => (
                    <button
                        key={group.id}
                        onClick={() => setSelectedGroup(group.id)}
                        className={`px-6 py-3 rounded-[20px] text-sm font-black transition-all whitespace-nowrap ${
                            selectedGroup === group.id 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {group.name}
                    </button>
                ))}
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summary.map(item => (
                    <div key={item.user_id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-2xl">
                                {item.name[0]}
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white">{item.name}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nhân viên</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[32px] space-y-1">
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                                    <UserCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ngày công</span>
                                </div>
                                <p className="text-3xl font-black text-slate-900 dark:text-white">{item.total_days}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Buổi làm</p>
                            </div>
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] space-y-1">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                                    <Clock size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Số giờ</span>
                                </div>
                                <p className="text-3xl font-black text-slate-900 dark:text-white">{item.total_hours || 0}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tổng giờ tích lũy</p>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black transition-all">
                            Xem chi tiết lịch sử
                        </button>
                    </div>
                ))}

                {summary.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm mb-4">
                            <Calendar size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black">Chưa có dữ liệu chấm công tháng này</p>
                    </div>
                )}
            </div>
        </div>
    );
}
