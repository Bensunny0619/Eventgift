import React, { useState } from 'react';
import { 
    User, 
    Shield, 
    Bell, 
    Palette, 
    Camera, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    Check,
    Smartphone,
    Globe,
    Moon,
    Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('Profile');

    const tabs = [
        { name: 'Profile', icon: User },
        { name: 'Security', icon: Shield },
        { name: 'Experience', icon: Palette },
        { name: 'Notifications', icon: Bell },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="px-2">
                <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white italic">Account Sanctuary</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">
                    Personalize your hosting experience and manage your distinguished identity village.
                </p>
            </div>

            {/* Profile Brief Card */}
            <div className="exquisite-card p-10 flex flex-col md:flex-row items-center gap-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 overflow-hidden relative border-none">
                <div className="absolute top-0 right-0 h-64 w-64 gold-gradient opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                <div className="relative group">
                    <div className="h-32 w-32 rounded-[2.5rem] gold-gradient flex items-center justify-center text-white text-4xl font-serif shadow-2xl relative z-10 overflow-hidden">
                        {user?.name?.charAt(0) || 'U'}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="flex-grow text-center md:text-left relative z-10">
                    <h2 className="text-3xl font-serif mb-2">{user?.name || 'Distinguished Host'}</h2>
                    <p className="text-exquisite-gold font-black uppercase tracking-[0.2em] text-xs mb-4">Gold Tier Member village</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <span className="px-5 py-2 rounded-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-900/10 text-xs font-bold tracking-tight backdrop-blur-md">Member since Feb 2026</span>
                        <span className="px-5 py-2 rounded-xl bg-exquisite-gold/20 border border-exquisite-gold/30 text-xs font-bold tracking-tight text-exquisite-gold backdrop-blur-md">Identity Verified village</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Side Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center space-x-4 w-full px-8 py-5 rounded-[1.5rem] font-bold text-sm transition-all duration-300 ${
                                activeTab === tab.name 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl shadow-slate-200 dark:shadow-none' 
                                    : 'text-slate-500 hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span className="tracking-tight">{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Panels */}
                <div className="lg:col-span-3">
                    {activeTab === 'Profile' && (
                        <div className="exquisite-card p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Profile Identity village</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Host Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                        <input 
                                            type="text" 
                                            defaultValue={user?.name}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Legacy</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                        <input 
                                            type="email" 
                                            defaultValue={user?.email}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] transition-all">Save Essence village</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="exquisite-card p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Security Vault village</h3>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Current Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            placeholder="••••••••••••"
                                            className="w-full pl-14 pr-16 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        />
                                        <button 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-exquisite-gold transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">New Password village</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••••••"
                                            className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirm New Password village</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••••••"
                                            className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] transition-all">Update Security village</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Experience' && (
                        <div className="exquisite-card p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Experience Preferences village</h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Midnight Luxe Aesthetic village', desc: 'Enable deep dark modes for low-light management village.', icon: Moon, active: true },
                                    { label: 'Exquisite Animations village', desc: 'Savour sub-pixel fluid transitions throughout the platform village.', icon: Globe, active: true },
                                    { label: 'Haptic Sophistication village', desc: 'Subtle feedback during distinguished interactions village.', icon: Smartphone, active: false },
                                ].map((pref, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:border-exquisite-gold/30 transition-all">
                                        <div className="flex items-center space-x-6">
                                            <div className="h-12 w-12 rounded-xl gold-gradient flex items-center justify-center text-white shadow-lg">
                                                <pref.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-exquisite-gold transition-colors">{pref.label}</h4>
                                                <p className="text-xs text-slate-400 font-medium italic mt-1">{pref.desc}</p>
                                            </div>
                                        </div>
                                        <button className={`h-8 w-14 rounded-full transition-all relative flex items-center ${pref.active ? 'bg-slate-900 dark:bg-exquisite-gold shadow-inner' : 'bg-slate-200 dark:bg-white/10'}`}>
                                            <div className={`h-6 w-6 rounded-full bg-white shadow-md transition-all absolute ${pref.active ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
