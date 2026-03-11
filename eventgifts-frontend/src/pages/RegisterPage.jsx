import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Loader2, ArrowRight, Diamond, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please verify your details.');
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
                        <h1 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-white mb-4 italic">Private Membership</h1>
                        <p className="text-sm sm:base text-slate-500 font-medium">Join the most prestigious event ecosystem.</p>
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
                                    Distinguished Full Name
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    autoComplete="name"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    placeholder="Enter full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

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
                                    placeholder="email@example.com"
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
                                    autoComplete="new-password"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 gold-gradient text-white font-black rounded-2xl shadow-2xl shadow-exquisite-gold/30 disabled:opacity-50 hover:scale-[1.02] transform transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3 mt-8"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-bold">
                            Already a member? {' '}
                            <Link to="/login" className="text-exquisite-gold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
