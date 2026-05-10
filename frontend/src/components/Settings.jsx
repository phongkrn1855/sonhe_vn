import { useSettingsStore } from '../stores/settingsStore';
import { Sun, Moon, Globe, Check } from 'lucide-react';
import { translations } from '../translations';

export default function Settings() {
  const { theme, language, setTheme, setLanguage, toggleTheme } = useSettingsStore();
  const t = translations[language];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{t.settings}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Tùy chỉnh trải nghiệm ứng dụng của bạn</p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <Sun size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.theme}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                theme === 'light' 
                  ? 'border-primary bg-indigo-50/50 text-primary' 
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sun size={18} />
                <span className="font-bold">{t.light}</span>
              </div>
              {theme === 'light' && <Check size={18} />}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                theme === 'dark' 
                  ? 'border-primary bg-indigo-50/50 text-primary' 
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Moon size={18} />
                <span className="font-bold">{t.dark}</span>
              </div>
              {theme === 'dark' && <Check size={18} />}
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.language}</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setLanguage('vi')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                language === 'vi' 
                  ? 'border-primary bg-indigo-50/50 text-primary' 
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">🇻🇳</span>
                <span className="font-bold">{t.vietnamese}</span>
              </div>
              {language === 'vi' && <Check size={18} />}
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                language === 'en' 
                  ? 'border-primary bg-indigo-50/50 text-primary' 
                  : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">🇺🇸</span>
                <span className="font-bold">{t.english}</span>
              </div>
              {language === 'en' && <Check size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
