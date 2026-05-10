import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { translations } from '../translations';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, User, ShoppingBag, ArrowRight, Mail } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import OTPModal from './OTPModal';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginMode, setLoginMode] = useState('phone'); // 'phone' or 'email'
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [shopName, setShopName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    
    const { login, register, setUser } = useAuthStore();
    const { language } = useSettingsStore();
    const navigate = useNavigate();
    const t = translations[language];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(phone, password);
                navigate('/');
            } else {
                await register(phone, password, name, shopName);
                setIsLogin(true);
                setError(t.register_success);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const { data } = await axios.post('http://localhost:5001/api/auth/google-login', {
                    token: tokenResponse.access_token
                }, { withCredentials: true });
                setUser(data.user);
                navigate('/');
            } catch (err) {
                setError('Google login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google login failed')
    });

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/auth/send-otp', { email });
            setIsOTPModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Không thể gửi mã OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-300">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse duration-5000"></div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl shadow-indigo-500/10 w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-slate-100 dark:border-slate-700 z-10 animate-in zoom-in-95 duration-500">
                
                {/* Brand Side */}
                <div className="md:w-1/2 bg-gradient-to-br from-primary to-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img 
                          src="/C:/Users/hi/.gemini/antigravity/brain/3f73b587-4ffe-4bd1-b94e-795cd8bf263b/login_bg_pattern_1778001012284.png" 
                          alt="bg" 
                          className="w-full h-full object-cover mix-blend-overlay"
                        />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-12">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-primary font-black text-2xl">S</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight">SoNhe.vn</span>
                        </div>
                        <h1 className="text-5xl font-black leading-tight mb-6">
                            {isLogin ? t.login_title : t.register_title}
                        </h1>
                        <p className="text-indigo-100 text-lg font-medium max-w-md">
                            Giải pháp quản lý dữ liệu bán hàng tinh gọn, hiện đại và bảo mật cho doanh nghiệp của bạn.
                        </p>
                    </div>

                    <div className="relative z-10 pt-12">
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-indigo-200 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-indigo-100">+2,000 shop owners joined</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-12 lg:p-16 bg-white dark:bg-slate-800">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                                {isLogin ? t.sign_in : t.sign_up}
                            </h2>
                            <p className="text-slate-400 font-medium">
                                {isLogin ? t.no_account : t.have_account}{' '}
                                <button 
                                    onClick={() => setIsLogin(!isLogin)} 
                                    className="text-primary font-black hover:underline underline-offset-4"
                                >
                                    {isLogin ? t.sign_up : t.sign_in}
                                </button>
                            </p>
                        </div>
                        
                        {error && (
                            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${error.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={loginMode === 'phone' || !isLogin ? handleSubmit : handleSendOTP} className="space-y-5">
                            {!isLogin && (
                                <>
                                    {/* Name and Shop Name fields remain the same */}
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors">{t.name}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={name} 
                                                onChange={e => setName(e.target.value)} 
                                                required 
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all" 
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors">{t.shop_name}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={shopName} 
                                                onChange={e => setShopName(e.target.value)} 
                                                required 
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all" 
                                                placeholder="Tên cửa hàng của bạn"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {loginMode === 'phone' || !isLogin ? (
                                <>
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors">{t.phone}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Phone size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={phone} 
                                                onChange={e => setPhone(e.target.value)} 
                                                required 
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all" 
                                                placeholder="09xx xxx xxx"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors">{t.password}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input 
                                                type="password" 
                                                value={password} 
                                                onChange={e => setPassword(e.target.value)} 
                                                required 
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all" 
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="group">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors">{t.email}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                            required 
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white outline-none transition-all" 
                                            placeholder="example@gmail.com"
                                        />
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex items-center justify-center py-4 px-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>{isLogin ? (loginMode === 'phone' ? t.sign_in : t.send_otp) : t.sign_up} <ArrowRight size={20} className="ml-2" /></>
                                )}
                            </button>
                        </form>

                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={() => setLoginMode(loginMode === 'phone' ? 'email' : 'phone')}
                                className="text-sm font-bold text-primary hover:underline"
                            >
                                {loginMode === 'phone' ? t.login_otp : t.use_phone}
                            </button>
                        </div>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                                <span className="bg-white dark:bg-slate-800 px-4 text-slate-400">Hoặc</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            className="w-full flex items-center justify-center py-4 px-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group"
                        >
                            <div className="mr-3 group-hover:scale-110 transition-transform">
                                <GoogleIcon />
                            </div>
                            {t.login_google}
                        </button>
                    </div>
                </div>

                <OTPModal 
                    email={email}
                    isOpen={isOTPModalOpen}
                    onClose={() => setIsOTPModalOpen(false)}
                    onSuccess={(user) => {
                        setUser(user);
                        navigate('/');
                    }}
                />
            </div>
        </div>
    );
}
