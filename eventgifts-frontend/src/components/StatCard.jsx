import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color = "gold", badge }) => {
    const isPositive = trend?.startsWith('+');

    return (
        <div className="exquisite-card p-10 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110"></div>

            <div className="flex justify-between items-start relative z-10">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${color === 'gold' ? 'bg-exquisite-gold/10 text-exquisite-gold' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'} shadow-sm`}>
                    <Icon className="h-8 w-8" />
                </div>

                {badge && (
                    <span className="px-5 py-2 bg-exquisite-cream dark:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-exquisite-gold border border-slate-100 dark:border-white/5">
                        {badge}
                    </span>
                )}

                {trend && (
                    <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-black ${isPositive ? 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' : 'text-rose-500 bg-rose-50/50 dark:bg-rose-500/10'}`}>
                        {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        <span>{trend}</span>
                    </div>
                )}
            </div>

            <div className="mt-8 relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-2">{label}</p>
                <h3 className="text-5xl font-serif text-slate-900 dark:text-white transition-transform duration-300 group-hover:translate-x-1">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
