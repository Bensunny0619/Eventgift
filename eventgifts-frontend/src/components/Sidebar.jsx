import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Gift,
    Users,
    BarChart3,
    Settings,
    PlusCircle,
    Diamond
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user } = useAuth();

    if (!user) return null;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Elite Events', path: '/events' },
        { icon: Gift, label: 'The Gift Suite', path: '/gifts' },
        { icon: Users, label: 'Distinguished Guests', path: '/guests' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed left-0 top-0 h-screen w-72 bg-white dark:bg-exquisite-midnight border-r border-slate-100 dark:border-white/5 z-[60] flex flex-col pt-32 pb-8 px-6 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto custom-sidebar-scroll`}>
                {/* Brand in Sidebar */}
                <div className="absolute top-8 left-8 flex items-center space-x-3 group">
                    <div className="h-12 w-12 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-exquisite-gold/20 transform group-hover:rotate-12 transition-transform duration-500">
                        <Diamond className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Exquisite Host</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-exquisite-gold">Management Dashboard</p>
                    </div>
                </div>

                <nav className="flex-grow space-y-2 mt-8">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
              flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group
              ${isActive
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
            `}
                        >
                            <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110`} />
                            <span className="font-bold tracking-tight">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-8 space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-4 px-6">
                        Preferences
                    </div>
                    <NavLink
                        to="/settings"
                        className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                    >
                        <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                        <span className="font-bold tracking-tight">Account Settings</span>
                    </NavLink>

                    <NavLink
                        to="/events/create"
                        className="flex items-center justify-center space-x-2 w-full py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-all"
                    >
                        <PlusCircle className="h-5 w-5" />
                        <span>Create New Event</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
