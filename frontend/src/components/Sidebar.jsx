import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  UserCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useGroupStore } from '../stores/groupStore';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {active && <ChevronRight size={16} />}
  </Link>
);

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { activeGroup, activeRole, viewMode, setViewMode } = useGroupStore();
  const { language } = useSettingsStore();
  const location = useLocation();
  const t = translations[language];

  const isManager = activeRole === 'admin';

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-40 transition-colors duration-300">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-white font-black text-xl leading-none">S</span>
          </div>
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            SoNhe.vn
          </span>
        </Link>
      </div>

      {/* Role Toggle for Managers */}
      {isManager && (
        <div className="px-4 mb-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-100 dark:border-slate-700">
            <button 
                onClick={() => setViewMode('manager')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'manager' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
                <Eye size={14} />
                Quản lý
            </button>
            <button 
                onClick={() => setViewMode('employee')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${viewMode === 'employee' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
                <EyeOff size={14} />
                Nhân viên
            </button>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto no-scrollbar">
        <SidebarLink 
          to="/" 
          icon={LayoutDashboard} 
          label={t.dashboard} 
          active={location.pathname === '/'} 
        />
        
        {/* Always visible for active group context */}
        <SidebarLink 
          to="/attendance" 
          icon={CalendarCheck} 
          label="Điểm danh" 
          active={location.pathname === '/attendance'} 
        />
        
        <SidebarLink 
          to="/tasks" 
          icon={CheckCircle2} 
          label={viewMode === 'manager' ? "Giao việc" : "Việc của tôi"} 
          active={location.pathname === '/tasks'} 
        />
        
        <SidebarLink 
          to="/reports" 
          icon={FileText} 
          label="Báo cáo" 
          active={location.pathname === '/reports'} 
        />

        {/* Manager-only links */}
        {viewMode === 'manager' && (
          <>
            <SidebarLink 
              to="/personnel" 
              icon={Users} 
              label="Nhân sự" 
              active={location.pathname === '/personnel'} 
            />
            <SidebarLink 
              to="/timekeeping" 
              icon={Clock} 
              label="Chấm công" 
              active={location.pathname === '/timekeeping'} 
            />
          </>
        )}

        <SidebarLink 
          to="/groups" 
          icon={Layers} 
          label="Nhóm của tôi" 
          active={location.pathname === '/groups'} 
        />
        
        <SidebarLink 
          to="/settings" 
          icon={Settings} 
          label={t.settings} 
          active={location.pathname === '/settings'} 
        />
      </nav>

      <div className="p-4 border-t border-gray-50 dark:border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 px-2 py-1">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-primary dark:text-primary-foreground font-bold border-2 border-white dark:border-slate-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 truncate">
                {viewMode === 'manager' ? 'Quản lý' : 'Nhân viên'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">{t.sign_out}</span>
        </button>
      </div>
    </aside>
  );
}
