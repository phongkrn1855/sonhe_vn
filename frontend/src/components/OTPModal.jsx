import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const OTPModal = ({ email, isOpen, onClose, onSuccess }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval;
        if (isOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5001/api/auth/verify-otp', 
                { email, otp: code },
                { withCredentials: true }
            );
            onSuccess(response.data.user);
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Xác thực thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setTimer(60);
        try {
            await axios.post('http://localhost:5001/api/auth/send-otp', { email });
        } catch (err) {
            setError('Không thể gửi lại mã');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Xác thực OTP</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Chúng tôi đã gửi mã 6 chữ số đến <br />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent focus:border-blue-500 focus:ring-0 transition-all dark:text-white"
                                maxLength={1}
                                required
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác nhận'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500 dark:text-slate-400">
                        Chưa nhận được mã?{' '}
                        <button 
                            onClick={handleResend}
                            disabled={timer > 0}
                            className={`font-bold ${timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                        >
                            Gửi lại {timer > 0 && `(${timer}s)`}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
