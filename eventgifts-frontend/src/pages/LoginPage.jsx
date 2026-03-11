import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowRight, Diamond, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid credentials. Please attempt again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-exquisite-cream dark:bg-exquisite-midnight flex items-center justify-center px-4 sm:px-10 py-10 sm:py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] gold-gradient opacity-[0.03] dark:opacity-[0.05] rounded-full blur-[120px] -mr-[300px] -mt-[300px]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] gold-gradient opacity-[0.02] dark:opacity-[0.04] rounded-full blur-[100px] -ml-[200px] -mb-[200px]"></div>

            <div className="w-full max-w-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="exquisite-card p-8 sm:p-12 md:p-16">
                    <div className="text-center mb-10 sm:mb-12">
                        <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 gold-gradient rounded-2xl items-center justify-center shadow-xl shadow-exquisite-gold/20 mb-6 sm:mb-8 transform hover:rotate-12 transition-transform cursor-pointer">
                            <Diamond className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-white mb-4 italic">Welcome back</h1>
                        <p className="text-sm sm:base text-slate-500 font-medium">Continue your journey with Homa.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Email Address
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Secure Password
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="remember" className="h-5 w-5 rounded-lg border-2 border-slate-200 dark:border-white/10" />
                                <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Remember access</label>
                            </div>
                            <Link to="#" className="text-sm font-bold text-exquisite-gold hover:underline">Forgot secrets?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 gold-gradient text-white font-black rounded-2xl shadow-2xl shadow-exquisite-gold/30 disabled:opacity-50 hover:scale-[1.02] transform transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Initiate Session</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-bold">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-exquisite-gold hover:underline">Apply for Membership</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
