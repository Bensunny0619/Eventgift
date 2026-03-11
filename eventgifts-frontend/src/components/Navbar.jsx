import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Bell,
    MessageSquare,
    Search,
    User,
    Sun,
    Moon,
    Menu,
    X,
    Diamond
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${user ? 'lg:left-72' : ''}`}>
            <div className="bg-white/80 dark:bg-exquisite-midnight/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-6 px-10">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                    {/* Logo / Title Area */}
                    <div className="flex items-center space-x-8">
                        {!user && (
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="h-10 w-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-exquisite-gold/20">
                                    <Diamond className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Homa.</span>
                            </Link>
                        )}

                        {user && (
                            <h1 className="text-3xl font-serif text-slate-900 dark:text-white">
                                Welcome, <span className="text-exquisite-gold">{user.name.split(' ')[0]}</span>
                            </h1>
                        )}
                    </div>

                    {/* Search Bar - only for logged in */}
                    {user && (
                        <div className="hidden md:flex flex-grow max-w-2xl mx-12">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/30 transition-all font-medium"
                                    placeholder="Search events, guests, or gifts..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={toggleTheme}
                            className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-exquisite-gold transition-all"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-8">
                                <div className="flex items-center space-x-4 border-r border-slate-200 dark:border-white/10 pr-8">
                                    <button className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <Bell className="h-6 w-6" />
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-exquisite-gold border-2 border-white dark:border-exquisite-midnight rounded-full"></span>
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <MessageSquare className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4 pl-2 group cursor-pointer relative">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                                        <p className="text-[10px] font-black uppercase text-exquisite-gold tracking-widest">Gold Tier Member</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-exquisite-gold/10 border border-exquisite-gold/20 p-1">
                                        <div className="h-full w-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                                            <User className="h-full w-full p-2 text-slate-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link to="/login" className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">Login</Link>
                                <Link to="/register" className="px-8 py-3.5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all">Join Homa.</Link>
                            </div>
                        )}

                        <button
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-400"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
