import React, { useState, useEffect } from 'react';
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
    Filter,
    Loader2,
    Trash2,
    RotateCcw
} from 'lucide-react';
import api from '../api/api';
import InviteGuestModal from '../components/InviteGuestModal';

const Guests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Guests');
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const menuTimeoutRef = React.useRef(null);

    const fetchGuests = () => {
        setIsLoading(true);
        api.get('/guests')
            .then(res => setGuests(res.data))
            .catch(err => console.error('Failed to fetch guests', err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(() => {
            fetchGuests();
        }, 0);
        return () => clearTimeout(t);
    }, []);

    const handleMouseEnter = (id) => {
        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
        setActiveMenuId(id);
    };

    const handleMouseLeave = () => {
        menuTimeoutRef.current = setTimeout(() => {
            setActiveMenuId(null);
        }, 300); // 300ms delay to make it feel smoother
    };



    const handleGuestAdded = () => {
        // Refresh local list or just fetch again
        fetchGuests();
    };

    const handleDeleteGuest = async (guestId, guestType) => {
        if (!window.confirm('Are you sure you want to remove this guest?')) return;
        
        try {
            // Strip the prefix from ID if it's an invited guest
            const realId = guestId.toString().replace('invited-', '');
            
            if (guestType === 'invited') {
                await api.delete(`/guests/${realId}`);
                setGuests(guests.filter(g => g.id !== guestId));
            } else {
                alert('Only explicitly invited guests can be removed from this view. Contributors are automatically tracked.');
            }
        } catch (err) {
            console.error('Failed to delete guest', err);
            alert('Failed to remove guest. Please try again.');
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

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
        const name = guest.name || '';
        const email = guest.email || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Guests' || guest.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalGuests = guests.length;
    const confirmedCount = guests.filter(g => g.status === 'Confirmed').length;
    const pendingCount = guests.filter(g => g.status === 'Pending').length;
    const declinedCount = guests.filter(g => g.status === 'Declined').length;

    const confirmedPct = totalGuests > 0 ? (confirmedCount / totalGuests) * 100 : 0;
    const pendingPct = totalGuests > 0 ? (pendingCount / totalGuests) * 100 : 0;
    const declinedPct = totalGuests > 0 ? (declinedCount / totalGuests) * 100 : 0;

    const stats = [
        { label: 'Total Invitees', value: totalGuests.toLocaleString(), icon: Users, color: 'text-slate-900 dark:text-white' },
        { label: 'Confirmed RSVP', value: confirmedCount.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Awaiting Response', value: pendingCount.toLocaleString(), icon: Clock, color: 'text-amber-500' },
        { label: 'Declined RSVP', value: declinedCount.toLocaleString(), icon: XCircle, color: 'text-rose-500' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white">Guest Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        Manage your guest lists and track RSVPs for all your events.
                    </p>
                </div>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center justify-center space-x-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group shrink-0"
                >
                    <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span>Invite New Guest</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
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

            {/* RSVP Distribution Premium Bar */}
            <div className="exquisite-card p-8 border-none space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">RSVP Distribution</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time attendance breakdown of your guest list</p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {confirmedCount} of {totalGuests} Attending ({totalGuests > 0 ? Math.round(confirmedPct) : 0}%)
                    </span>
                </div>
                
                <div className="h-3.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                    {confirmedCount > 0 && (
                        <div 
                            style={{ width: `${confirmedPct}%` }} 
                            className="h-full bg-emerald-500 transition-all duration-500 ease-out relative"
                            title={`Confirmed: ${confirmedCount} (${Math.round(confirmedPct)}%)`}
                        />
                    )}
                    {pendingCount > 0 && (
                        <div 
                            style={{ width: `${pendingPct}%` }} 
                            className="h-full bg-amber-500 transition-all duration-500 ease-out relative"
                            title={`Pending: ${pendingCount} (${Math.round(pendingPct)}%)`}
                        />
                    )}
                    {declinedCount > 0 && (
                        <div 
                            style={{ width: `${declinedPct}%` }} 
                            className="h-full bg-rose-500 transition-all duration-500 ease-out relative"
                            title={`Declined: ${declinedCount} (${Math.round(declinedPct)}%)`}
                        />
                    )}
                    {totalGuests === 0 && (
                        <div className="h-full w-full bg-slate-200 dark:bg-white/10 transition-all duration-500" />
                    )}
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                    <div className="flex items-center space-x-2.5">
                        <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Confirmed RSVP ({confirmedCount} • {totalGuests > 0 ? Math.round(confirmedPct) : 0}%)
                        </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Awaiting Response ({pendingCount} • {totalGuests > 0 ? Math.round(pendingPct) : 0}%)
                        </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Declined RSVP ({declinedCount} • {totalGuests > 0 ? Math.round(declinedPct) : 0}%)
                        </span>
                    </div>
                </div>
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
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Event</th>
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
                                            <p className="text-slate-500 font-medium italic">No guests matching your criteria were found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center text-white font-serif text-lg shadow-inner">
                                                    {(guest.name || 'G').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-exquisite-gold transition-colors">{guest.name}</p>
                                                    <div className="flex items-center text-xs text-slate-400 mt-0.5">
                                                        {guest.email && (
                                                            <>
                                                                <Mail className="h-3 w-3 mr-1.5" />
                                                                {guest.email}
                                                                <span className="mx-2 opacity-30">|</span>
                                                            </>
                                                        )}
                                                        <span className="text-exquisite-gold font-black uppercase tracking-tighter text-[9px]">{guest.tier} Member</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                                                <ChevronRight className="h-4 w-4 text-exquisite-gold mr-2" />
                                                {guest.event?.title || 'Unknown Event'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(guest.status)}`}>
                                                {getStatusIcon(guest.status)}
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div 
                                                className="relative inline-block"
                                                onMouseEnter={() => handleMouseEnter(guest.id)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <button 
                                                    className={`p-3 rounded-xl transition-all duration-300 border ${
                                                        activeMenuId === guest.id 
                                                        ? 'text-exquisite-gold bg-exquisite-gold/10 border-exquisite-gold/20 scale-110 shadow-lg shadow-exquisite-gold/10' 
                                                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border-transparent hover:border-slate-100 dark:hover:border-white/10'
                                                    }`}
                                                >
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>

                                                <div className={`absolute right-0 top-full mt-1 w-60 origin-top-right z-50 transition-all duration-300 ${
                                                    activeMenuId === guest.id 
                                                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                                                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                                }`}>
                                                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden p-2 space-y-1">
                                                        {guest.type === 'invited' && guest.email && (
                                                            <button 
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const btn = e.currentTarget;
                                                                    const originalContent = btn.innerHTML;
                                                                    try {
                                                                        btn.disabled = true;
                                                                        btn.innerHTML = '<span class="flex items-center space-x-3"><Loader2 class="h-4 w-4 animate-spin text-exquisite-gold" /><span>Sending...</span></span>';
                                                                        
                                                                        const realId = guest.id.toString().replace('invited-', '');
                                                                        await api.post(`/guests/${realId}/resend-invitation`);
                                                                        
                                                                        btn.innerHTML = '<span class="flex items-center space-x-3 text-emerald-500"><CheckCircle2 class="h-4 w-4" /><span>Invitation Sent!</span></span>';
                                                                        
                                                                        setTimeout(() => {
                                                                            btn.disabled = false;
                                                                            btn.innerHTML = originalContent;
                                                                            setActiveMenuId(null);
                                                                        }, 2000);
                                                                    } catch (err) {
                                                                        console.error('Failed to resend invite', err);
                                                                        btn.innerHTML = '<span class="flex items-center space-x-3 text-rose-500"><XCircle class="h-4 w-4" /><span>Failed to send</span></span>';
                                                                        setTimeout(() => {
                                                                            btn.disabled = false;
                                                                            btn.innerHTML = originalContent;
                                                                        }, 2000);
                                                                    }
                                                                }}
                                                                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-exquisite-gold/10 hover:text-exquisite-gold rounded-xl transition-all text-sm font-bold text-left group/item disabled:opacity-100"
                                                            >
                                                                <RotateCcw className="h-4 w-4 text-exquisite-gold group-hover/item:rotate-180 transition-transform duration-500" />
                                                                <span>Resend Invitation</span>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteGuest(guest.id, guest.type);
                                                            }}
                                                            className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all text-sm font-bold text-left group/item"
                                                        >
                                                            <Trash2 className="h-4 w-4 group-hover/item:scale-110 transition-transform" />
                                                            <span>Remove Guest</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <InviteGuestModal 
                isOpen={isInviteModalOpen} 
                onClose={() => setIsInviteModalOpen(false)} 
                onGuestAdded={handleGuestAdded}
            />
        </div>
    );
};

export default Guests;
