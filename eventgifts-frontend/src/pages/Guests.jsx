import React, { useState } from 'react';
import { 
    Users, 
    Search, 
    UserPlus, 
    Mail, 
    CheckCircle2, 
    Clock, 
    XCircle,
    ChevronRight,
    MoreHorizontal,
    Filter
} from 'lucide-react';

const Guests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Guests');

    const guests = [
        { id: 1, name: 'Lord Sebastian Thorne', email: 'sebastian@heritage.co', event: 'The Heritage Gala 2026', status: 'Confirmed', tier: 'VVIP' },
        { id: 2, name: 'Lady Genevieve Rose', email: 'gen@royal.net', event: 'Modern Luxe Soirée', status: 'Pending', tier: 'Gold' },
        { id: 3, name: 'Sir Julian Sterling', email: 'julian@sterling.com', event: 'The Heritage Gala 2026', status: 'Confirmed', tier: 'VVIP' },
        { id: 4, name: 'Elena Vance', email: 'elena@vance.io', event: 'Techno-Cultural Expo', status: 'Declined', tier: 'Standard' },
        { id: 5, name: 'Arthur Penhaligon', email: 'arthur@estates.uk', event: 'Modern Luxe Soirée', status: 'Confirmed', tier: 'Gold' },
        { id: 6, name: 'Clara Montesque', email: 'clara@arts.fr', event: 'Celestial Gathering', status: 'Pending', tier: 'VVIP' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Declined': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return <CheckCircle2 className="h-3 w-3 mr-1.5" />;
            case 'Pending': return <Clock className="h-3 w-3 mr-1.5" />;
            case 'Declined': return <XCircle className="h-3 w-3 mr-1.5" />;
            default: return null;
        }
    };

    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             guest.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Guests' || guest.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white italic">Distinguished Guests</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        Manage your exclusive guest lists and track RSVPs across all your masterpiece events.
                    </p>
                </div>
                <button className="flex items-center justify-center space-x-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] transition-all group shrink-0">
                    <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span>Invite New Guest</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Invitees', value: '1,248', icon: Users, color: 'text-slate-900 dark:text-white' },
                    { label: 'Confirmed RSVP', value: '842', icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Awaiting Response', value: '316', icon: Clock, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="exquisite-card p-8 flex items-center space-x-6 border-none">
                        <div className={`h-14 w-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search guests by name or email..."
                        className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-3">
                    {['All Guests', 'Confirmed', 'Pending', 'Declined'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-5 rounded-[2rem] font-bold text-sm transition-all border ${
                                statusFilter === status 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl' 
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Guests Directory */}
            <div className="exquisite-card border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Distinguished Event</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users className="h-12 w-12 text-slate-200 dark:text-white/10 mb-4" />
                                            <p className="text-slate-500 font-mediumitalic">No guests matching your criteria were found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center text-white font-serif text-lg shadow-inner">
                                                    {guest.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-exquisite-gold transition-colors">{guest.name}</p>
                                                    <div className="flex items-center text-xs text-slate-400 mt-0.5">
                                                        <Mail className="h-3 w-3 mr-1.5" />
                                                        {guest.email}
                                                        <span className="mx-2 opacity-30">|</span>
                                                        <span className="text-exquisite-gold font-black uppercase tracking-tighter text-[9px]">{guest.tier} Member</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                                                <ChevronRight className="h-4 w-4 text-exquisite-gold mr-2" />
                                                {guest.event}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(guest.status)}`}>
                                                {getStatusIcon(guest.status)}
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/10">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Guests;
