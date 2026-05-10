import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';
import { 
  Users, 
  Search, 
  MoreVertical, 
  Shield, 
  User, 
  Phone, 
  Mail,
  Edit2,
  Trash2,
  UserPlus
} from 'lucide-react';
import axios from 'axios';

export default function Personnel() {
    const { language } = useSettingsStore();
    const t = translations[language];
    const [personnel, setPersonnel] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [editingMember, setEditingMember] = useState(null);
    const [editForm, setEditForm] = useState({ position: '', role: '' });

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) fetchPersonnel();
    }, [selectedGroup]);

    const fetchGroups = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/groups');
            setGroups(res.data.groups);
            if (res.data.groups.length > 0) setSelectedGroup(res.data.groups[0].id);
        } catch (err) { console.error(err); }
    };

    const fetchPersonnel = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/groups/${selectedGroup}/personnel`);
            setPersonnel(res.data.personnel);
        } catch (err) { console.error(err); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/groups/${selectedGroup}/members/${editingMember.id}`, editForm);
            setEditingMember(null);
            fetchPersonnel();
        } catch (err) { console.error(err); }
    };

    const removeMember = async (userId) => {
        if (!confirm('Bạn có chắc muốn xóa thành viên này khỏi nhóm?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/groups/${selectedGroup}/members/${userId}`);
            fetchPersonnel();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Nhân sự</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Quản lý đội ngũ và phân quyền trong nhóm</p>
                </div>
            </div>

            {/* Group Selector & Search */}
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
                
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm nhân viên..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Personnel List */}
            <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-700">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Thành viên</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Chức vụ</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vai trò</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Liên hệ</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày tham gia</th>
                                <th className="px-8 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {personnel.map(member => (
                                <tr key={member.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">
                                                {member.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{member.name}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ID: #{member.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                {member.position || 'Nhân viên'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            member.role === 'admin' 
                                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                            {member.role === 'admin' ? 'Quản lý' : 'Thành viên'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Phone size={12} />
                                                <span className="text-xs font-bold">{member.phone}</span>
                                            </div>
                                            {member.email && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Mail size={12} />
                                                    <span className="text-xs font-bold">{member.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-400">
                                            {new Date(member.joined_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingMember(member);
                                                    setEditForm({ position: member.position || '', role: member.role });
                                                }}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => removeMember(member.id)}
                                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 pb-4">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Cập nhật thông tin</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Thay đổi chức vụ hoặc vai trò của {editingMember.name}</p>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Chức vụ</label>
                                <input 
                                    type="text" 
                                    value={editForm.position}
                                    onChange={e => setEditForm({...editForm, position: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all"
                                    placeholder="Vd: Kế toán, Bán hàng..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Vai trò hệ thống</label>
                                <select 
                                    value={editForm.role}
                                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border border-transparent focus:border-indigo-500 rounded-[24px] font-bold text-slate-900 dark:text-white focus:outline-none transition-all appearance-none"
                                >
                                    <option value="member">Thành viên</option>
                                    <option value="admin">Quản lý (Admin)</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditingMember(null)}
                                    className="flex-1 py-4 text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
