import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Calendar as CalendarIcon,
  User as UserIcon,
  Trash2
} from 'lucide-react';
import axios from 'axios';

export default function Tasks() {
    const { language } = useSettingsStore();
    const [tasks, setTasks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '', due_date: '' });
    const [members, setMembers] = useState([]);

    const fetchGroups = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/groups');
            setGroups(res.data.groups);
            if (res.data.groups.length > 0) setSelectedGroup(res.data.groups[0].id);
        } catch (err) { console.error(err); }
    }, []);

    const fetchTasks = useCallback(async () => {
        if (!selectedGroup) return;
        try {
            const res = await axios.get(`http://localhost:5001/api/tasks/group/${selectedGroup}`);
            setTasks(res.data.tasks);
        } catch (err) { console.error(err); }
    }, [selectedGroup]);

    const fetchMembers = useCallback(async () => {
        if (!selectedGroup) return;
        try {
            const res = await axios.get(`http://localhost:5001/api/groups/${selectedGroup}/members`);
            setMembers(res.data.members);
        } catch (err) { console.error(err); }
    }, [selectedGroup]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        if (selectedGroup) {
            fetchTasks();
            fetchMembers();
        }
    }, [selectedGroup, fetchTasks, fetchMembers]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/tasks', { ...newTask, group_id: selectedGroup });
            setShowModal(false);
            setNewTask({ title: '', description: '', assigned_to: '', due_date: '' });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (taskId, status) => {
        try {
            await axios.patch(`http://localhost:5001/api/tasks/${taskId}/status`, { status });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const deleteTask = async (taskId) => {
        if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'todo': return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400';
            case 'in_progress': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
            case 'done': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Giao việc</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Quản lý và theo dõi tiến độ công việc của nhóm</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-[24px] font-black shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} strokeWidth={3} />
                    Tạo việc mới
                </button>
            </div>

            {/* Filters & Tabs */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                
                <div className="flex items-center gap-2 w-full md:w-fit">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm công việc..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(task.status)}`}>
                                {task.status === 'todo' ? 'Chưa làm' : task.status === 'in_progress' ? 'Đang làm' : 'Hoàn thành'}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => deleteTask(task.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2">{task.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-6">{task.description}</p>

                        <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <UserIcon size={16} />
                                    <span className="text-xs font-bold">{task.assigned_name || 'Chưa giao'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <CalendarIcon size={16} />
                                    <span className="text-xs font-bold">{task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : 'Không thời hạn'}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {task.status !== 'todo' && (
                                    <button 
                                        onClick={() => updateStatus(task.id, 'todo')}
                                        className="flex-1 py-2 bg-slate-50 dark:bg-slate-700/50 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-100 transition-all"
                                    >
                                        Chưa làm
                                    </button>
                                )}
                                {task.status !== 'in_progress' && (
                                    <button 
                                        onClick={() => updateStatus(task.id, 'in_progress')}
                                        className="flex-1 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl text-xs font-black hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
                                    >
                                        Đang làm
                                    </button>
                                )}
                                {task.status !== 'done' && (
                                    <button 
                                        onClick={() => updateStatus(task.id, 'done')}
                                        className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                                    >
                                        Hoàn thành
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm mb-4">
                            <AlertCircle size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black">Chưa có công việc nào trong nhóm này</p>
                        <button onClick={() => setShowModal(true)} className="mt-4 text-indigo-600 font-bold hover:underline">Tạo công việc đầu tiên</button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 pb-4">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Tạo việc mới</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Điền thông tin để bắt đầu giao việc</p>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Tiêu đề</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all"
                                    placeholder="Vd: Soạn báo cáo tháng 5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Mô tả</label>
                                <textarea 
                                    rows="3"
                                    value={newTask.description}
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all resize-none"
                                    placeholder="Chi tiết công việc..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Giao cho</label>
                                    <select 
                                        value={newTask.assigned_to}
                                        onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all appearance-none"
                                    >
                                        <option value="">Để trống</option>
                                        {members.map(m => (
                                            <option key={m.user_id} value={m.user_id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Hạn chót</label>
                                    <input 
                                        type="date" 
                                        value={newTask.due_date}
                                        onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
