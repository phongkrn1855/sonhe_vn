import { useSettingsStore } from '../stores/settingsStore';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { theme } = useSettingsStore();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}


