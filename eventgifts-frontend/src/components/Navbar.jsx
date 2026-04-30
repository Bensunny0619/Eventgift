import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
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
    Diamond,
    CheckCircle2
} from 'lucide-react';

const Navbar = ({ toggleSidebar, isDashboard, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <header className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${isDashboard && isSidebarOpen ? 'lg:left-72' : ''}`}>
            <div className="bg-white/80 dark:bg-exquisite-midnight/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-4 sm:py-6 px-4 sm:px-10">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">

                    {/* Logo / Title Area */}
                    <div className="flex items-center space-x-8">
                        {!user && (
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="h-10 w-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-exquisite-gold/20">
                                    <Diamond className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Eventgift</span>
                            </Link>
                        )}

                        {user && (
                            <h1 className="text-xl sm:text-3xl font-serif text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
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
                                <div className="flex items-center space-x-2 sm:space-x-4 border-r border-slate-200 dark:border-white/10 pr-4 sm:pr-8 relative">
                                    <button 
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 h-3 w-3 bg-rose-500 border-2 border-white dark:border-exquisite-midnight rounded-full"></span>
                                        )}
                                    </button>
                                    
                                    {showNotifications && (
                                        <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                                <h4 className="font-bold text-slate-900 dark:text-white">Notifications</h4>
                                                {unreadCount > 0 && (
                                                    <button onClick={markAllAsRead} className="text-xs text-exquisite-gold hover:underline font-bold">
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif) => (
                                                        <div 
                                                            key={notif.id} 
                                                            className={`p-4 border-b border-slate-50 dark:border-white/5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${!notif.read_at ? 'bg-exquisite-gold/5' : ''}`}
                                                            onClick={() => {
                                                                if (!notif.read_at) markAsRead(notif.id);
                                                            }}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="mt-0.5 mr-3">
                                                                    {notif.read_at ? (
                                                                        <CheckCircle2 className="h-4 w-4 text-slate-300" />
                                                                    ) : (
                                                                        <div className="h-2 w-2 rounded-full bg-exquisite-gold mt-1"></div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm ${!notif.read_at ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                        {notif.data.message || 'You have a new notification.'}
                                                                    </p>
                                                                    <p className="text-xs text-slate-400 mt-1">
                                                                        {new Date(notif.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                        <p>You're all caught up!</p>
                                                        <p className="text-xs mt-1">New guest pledges will appear here.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => alert("The integrated Guest Chat feature is currently in development and will be available in the next update!")}
                                        className="hidden sm:block p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <MessageSquare className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4 pl-2 group cursor-pointer relative">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
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
                                <Link to="/register" className="px-8 py-3.5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all">Join Eventgift</Link>
                            </div>
                        )}

                        {isDashboard && (
                            <button
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-exquisite-gold transition-colors"
                                onClick={toggleSidebar}
                            >
                                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
