import React from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Gift, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight,
    Star,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';

const Analytics = () => {
    const kpis = [
        { label: 'Total Revenue', value: '$124,500', change: '+12.5%', trend: 'up', icon: DollarSign },
        { label: 'Guest Engagement', value: '84%', change: '+5.2%', trend: 'up', icon: Users },
        { label: 'Gift Suite Value', value: '$42,800', change: '-2.1%', trend: 'down', icon: Gift },
        { label: 'Active Events', value: '18', change: '+3', trend: 'up', icon: Calendar },
    ];

    const popularGifts = [
        { name: 'Royal Heritage Chronograph', category: 'Royal Heritage', sales: 42, growth: '+15%' },
        { name: 'Midnight Velvet Suite', category: 'Modern Luxe', sales: 38, growth: '+8%' },
        { name: 'Aurelia Crystal Decanter', category: 'Modern Luxe', sales: 31, growth: '+12%' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white italic">Event Insights</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        A sophisticated overview of your event performance, guest interactions, and gift suite metrics.
                    </p>
                </div>
                <div className="flex items-center space-x-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                    <button className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg tracking-tight">Last 30 Days</button>
                    <button className="px-6 py-3 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all tracking-tight">Quarterly</button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="exquisite-card p-8 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-6">
                            <div className="h-14 w-14 gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-exquisite-gold/20 transform group-hover:rotate-6 transition-transform">
                                <kpi.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className={`flex items-center text-xs font-black uppercase tracking-widest ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpi.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                                {kpi.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1">{kpi.label}</p>
                        <p className="text-3xl font-serif text-slate-900 dark:text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart Simulation */}
                <div className="lg:col-span-2 exquisite-card p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Revenue Trajectory</h3>
                        <div className="flex items-center space-x-2">
                             <div className="h-2 w-2 rounded-full bg-exquisite-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projected Growth</span>
                        </div>
                    </div>
                    
                    <div className="flex-grow flex items-end justify-between h-64 px-4 relative">
                        {/* Simulated Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-slate-900 dark:bg-white"></div>)}
                        </div>

                        {/* Chart Bars */}
                        {[45, 62, 58, 75, 90, 82, 95].map((height, i) => (
                            <div key={i} className="w-12 group relative flex flex-col justify-end">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black py-1 px-3 rounded-full shadow-xl z-20">
                                    ${height}k
                                </div>
                                <div 
                                    className="w-full bg-slate-900/5 dark:bg-white/5 rounded-t-xl overflow-hidden relative group-hover:bg-slate-900/10 dark:group-hover:bg-white/10 transition-all duration-500"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="absolute bottom-0 w-full h-1 bg-exquisite-gold shadow-[0_-4px_12px_rgba(212,175,55,0.4)] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                </div>
                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Gifts Sidebar */}
                <div className="exquisite-card p-8 flex flex-col">
                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-8">Gift Excellence</h3>
                    <div className="space-y-6 flex-grow">
                        {popularGifts.map((gift, i) => (
                            <div key={i} className="group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-exquisite-gold transition-colors">{gift.name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{gift.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-serif text-slate-900 dark:text-white">{gift.sales} Sales</p>
                                        <p className="text-[10px] font-black text-emerald-500">{gift.growth} ↑</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-4 border-2 border-slate-100 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-exquisite-gold transition-all">
                        View Complete Catalog
                    </button>
                </div>
            </div>

            {/* Engagement Heatmap simulation or similar */}
            <div className="exquisite-card p-10 flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 h-64 w-64 gold-gradient opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center space-x-3 mb-6">
                        <TrendingUp className="h-6 w-6 text-exquisite-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Analytics</span>
                    </div>
                    <h2 className="text-4xl font-serif mb-6 leading-tight italic">Distinguished events often see a <span className="text-exquisite-gold">22% higher</span> engagement rate than standard gatherings.</h2>
                    <p className="text-sm font-medium opacity-60 leading-relaxed">Our predictive algorithms suggest that continuing your current curation strategy will lead to significant growth in your host prestige score.</p>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-12 exquisite-card border-none bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Host Prestige Rating</div>
                    <div className="text-7xl font-serif text-exquisite-gold mb-4 italic">Diamond</div>
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-exquisite-gold text-exquisite-gold shadow-lg" />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
