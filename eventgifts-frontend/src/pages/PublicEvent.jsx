import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import {
    Calendar,
    MapPin,
    Gift,
    Loader2,
    Heart,
    ShieldCheck,
    Search,
    Share2,
    ChevronRight,
    Diamond,
    Users
} from 'lucide-react';
import ContributionModal from '../components/ContributionModal';
import VerifyPledgeModal from '../components/VerifyPledgeModal';
import RSVPModal from '../components/RSVPModal';

const PublicEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, pledged, available
    const [searchQuery, setSearchQuery] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [giftLaterToast, setGiftLaterToast] = useState('');
    const [guest, setGuest] = useState(null);
    const [isRsvpOpen, setIsRsvpOpen] = useState(false);
    const [rsvpToast, setRsvpToast] = useState('');

    useEffect(() => {
        const guestId = new URLSearchParams(window.location.search).get('guest_id');
        if (guestId) {
            api.get(`/guests/${guestId}/public`)
                .then(res => setGuest(res.data))
                .catch(err => console.error('Failed to fetch personalized guest details', err));
        }
    }, []);

    const handlePersonalizedRsvp = async (newStatus) => {
        if (!guest) return;
        try {
            const res = await api.post(`/guests/${guest.id}/rsvp`, { status: newStatus });
            setGuest(res.data.guest);
            setRsvpToast(`Thank you! Your RSVP has been updated to ${newStatus === 'Confirmed' ? 'Attending' : 'Declining'}.`);
            setTimeout(() => setRsvpToast(''), 4000);
        } catch (err) {
            console.error(err);
            alert('Failed to update RSVP. Please try again.');
        }
    };

    const fetchEvent = useCallback(() => {
        api.get(`/events/${id}/public`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [id, fetchEvent]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <Diamond className="h-16 w-16 text-exquisite-gold/20 mx-auto mb-8" />
                <h2 className="text-4xl font-serif text-slate-900 dark:text-white mb-4">Event not found</h2>
                <p className="text-slate-500 mb-10">The celebration you are looking for has concluded or is private.</p>
                <Link to="/" className="text-xl font-serif text-exquisite-gold hover:underline">Return Home</Link>
            </div>
        );
    }

    const filteredItems = event.registry_items?.filter(item => {
        const matchesTab = 
            activeTab === 'all' || 
            (activeTab === 'pledged' && (parseFloat(item.amount_raised) / parseFloat(item.price)) >= 1) ||
            (activeTab === 'available' && (parseFloat(item.amount_raised) / parseFloat(item.price)) < 1);
        
        const matchesSearch = 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesTab && matchesSearch;
    }) || [];

    const themeColors = {
        'exquisite-gold': '#D4AF37',
        'rose-gold': '#B76E79',
        'emerald': '#50C878',
        'midnight-blue': '#191970',
    };

    const themeStyle = {
        '--color-exquisite-gold': themeColors[event.theme_color] || themeColors['exquisite-gold']
    };

    return (
        <div style={themeStyle} className="bg-exquisite-cream dark:bg-exquisite-midnight min-h-screen text-slate-900 dark:text-white transition-colors duration-500">

            {/* Optional Cover Image Banner */}
            {event.cover_image_url && (
                <div className="w-full h-[40vh] sm:h-[50vh] relative">
                    <img 
                        src={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}${event.cover_image_url}`} 
                        alt="Event Cover" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-exquisite-cream dark:from-exquisite-midnight to-transparent"></div>
                </div>
            )}

            {/* Gift Later Toast */}
            {giftLaterToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300">
                    <Gift className="h-5 w-5 text-exquisite-gold flex-shrink-0" />
                    <p className="text-sm font-bold">{giftLaterToast}</p>
                </div>
            )}

            {/* RSVP Toast */}
            {rsvpToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300">
                    <Users className="h-5 w-5 text-exquisite-gold flex-shrink-0" />
                    <p className="text-sm font-bold">{rsvpToast}</p>
                </div>
            )}

            <header className="pt-20 pb-16 border-b border-slate-100 dark:border-white/5">
                {/* Personalized Greeting Card */}
                {guest && (
                    <div className="max-w-[1400px] mx-auto px-10 pb-12 animate-in fade-in slide-in-from-top-3 duration-500">
                        <div className="exquisite-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/10 bg-emerald-500/[0.02]">
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-2xl font-serif">Welcome, <span className="text-exquisite-gold">{guest.name}</span>!</h3>
                                <p className="text-xs text-slate-400 font-medium italic">You are cordially invited to celebrate with us. Your RSVP is currently <span className={`font-bold ${guest.status === 'Confirmed' ? 'text-emerald-500' : guest.status === 'Declined' ? 'text-rose-500' : 'text-amber-500'}`}>{guest.status === 'Confirmed' ? 'Attending' : guest.status === 'Declined' ? 'Declined' : 'Pending'}</span>.</p>
                            </div>
                            <div className="flex items-center space-x-3 w-full sm:w-auto">
                                <button
                                    onClick={() => handlePersonalizedRsvp('Confirmed')}
                                    className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-bold uppercase text-[9px] tracking-widest border transition-all ${
                                        guest.status === 'Confirmed'
                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/10'
                                            : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/5 hover:border-emerald-500/30'
                                    }`}
                                >
                                    Attending
                                </button>
                                <button
                                    onClick={() => handlePersonalizedRsvp('Declined')}
                                    className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-bold uppercase text-[9px] tracking-widest border transition-all ${
                                        guest.status === 'Declined'
                                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/10'
                                            : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/5 hover:border-rose-500/30'
                                    }`}
                                >
                                    Declining
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-3 px-5 py-2 bg-exquisite-gold/10 border border-exquisite-gold/20 rounded-full">
                                <Diamond className="h-3.5 w-3.5 text-exquisite-gold" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-exquisite-gold">Eventgift Registry</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif leading-tight">{event.title}</h1>
                            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium italic">
                                {event.welcome_message || 'Support our celebration with a gift from our registry.'}
                            </p>
                        </div>

                        <div className="flex items-center space-x-6">
                            {!guest && (
                                <button 
                                    onClick={() => setIsRsvpOpen(true)}
                                    className="h-14 px-8 border-2 border-exquisite-gold/20 hover:border-exquisite-gold text-exquisite-gold rounded-2xl transition-all flex items-center space-x-3 group font-bold"
                                >
                                    <Users className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        RSVP
                                    </span>
                                </button>
                            )}
                            <button 
                                onClick={handleShare}
                                className="p-4 exquisite-glass rounded-2xl text-slate-500 hover:text-exquisite-gold transition-colors flex items-center space-x-3 group relative"
                            >
                                <Share2 className="h-5 w-5" />
                                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
                                    {isCopied ? 'Copied!' : 'Share'}
                                </span>
                            </button>
                            <Link 
                                to={`/events/${event.id}`}
                                className="px-10 py-5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 flex items-center space-x-3 group hover:scale-105 transition-all"
                            >
                                <Diamond className="h-5 w-5" />
                                <span>Manage</span>
                            </Link>
                        </div>
                    </div>

                    {/* Registry Subheader / Search */}
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {['all', 'pledged', 'available'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 border-b-2 transition-all ${activeTab === tab ? 'text-slate-900 dark:text-white border-exquisite-gold' : 'border-transparent hover:text-slate-600 dark:hover:text-slate-200'}`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full max-w-md group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Find a gift..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Smart Registry Grid */}
            <main className="max-w-[1400px] mx-auto px-10 py-24">
                {filteredItems.length === 0 ? (
                    <div className="exquisite-card p-32 text-center">
                        <Gift className="h-20 w-20 text-exquisite-gold/20 mx-auto mb-10" />
                        <h3 className="text-3xl font-serif mb-4">No items found</h3>
                        <p className="text-slate-500 font-medium">No gifts have been added to this registry yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
                        {filteredItems.map(item => {
                            const progress = Math.min(100, (parseFloat(item.amount_raised || 0) / parseFloat(item.price || 1)) * 100);
                            const isFulfilled = progress >= 100;

                            return (
                                <div key={item.id} className="exquisite-card overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full gold-gradient opacity-10 flex items-center justify-center">
                                                <Diamond className="h-24 w-24 text-exquisite-gold opacity-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-8 right-8 z-20">
                                            <span className={`px-5 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-100 dark:border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest ${isFulfilled ? 'text-emerald-500' : 'text-exquisite-gold'}`}>
                                                {isFulfilled ? 'Reserved' : 'Available'}
                                            </span>
                                        </div>

                                        {/* Status Badge Over Image */}
                                        {!isFulfilled && progress > 50 && (
                                            <div className="absolute top-8 left-8 z-20">
                                                <span className="px-5 py-2 gold-gradient rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                                                    Popular Item
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <h3 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                                                <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${
                                                    item.is_split_allowed 
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                                                }`}>
                                                    {item.is_split_allowed ? 'Split Allowed' : 'Single Buyer'}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-serif text-exquisite-gold">₦{parseFloat(item.price).toLocaleString()}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-2">
                                                {item.description || 'A beautiful gift for our special day.'}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Pledge Progress</span>
                                                <span className="text-exquisite-gold">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full gold-gradient transition-all duration-1000 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                <span>₦{parseFloat(item.amount_raised).toLocaleString()} pledged of ₦{parseFloat(item.price).toLocaleString()}</span>
                                                {isFulfilled && <span className="text-emerald-500 font-bold">Fully funded</span>}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6">
                                            <button
                                                disabled={isFulfilled}
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setIsModalOpen(true);
                                                }}
                                                className={`flex-grow py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl ${isFulfilled
                                                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                                    : 'gold-gradient text-white shadow-exquisite-gold/20 hover:scale-[1.03]'}`}
                                            >
                                                {isFulfilled ? 'Claimed' : 'Pledge'}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setGiftLaterToast(`Reminder saved! We'll remind you to gift "${item.title}" before the event.`);
                                                    setTimeout(() => setGiftLaterToast(''), 3000);
                                                }}
                                                className="px-8 py-5 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-exquisite-gold hover:border-exquisite-gold transition-all"
                                            >
                                                Gift Later
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Assistance Section */}
                <div className="mt-40">
                    <div className="exquisite-card p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 gold-gradient opacity-5 -mr-48 -mt-48 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative z-10 space-y-6 max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-exquisite-gold">Help & Support</span>
                            <h2 className="text-3xl sm:text-5xl font-serif italic">Need assistance choosing the perfect gift?</h2>
                            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium">Our support team is here to help you choose the perfect gift or answer any questions you may have.</p>
                            <button className="px-12 py-5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all text-sm uppercase tracking-[0.2em]">
                                Contact Support
                            </button>
                        </div>
                        <div className="relative z-10 h-64 w-64 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:rotate-12 transition-transform duration-700">
                            <Users className="h-32 w-32 text-exquisite-gold/20" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Verification Trigger Footer */}
            <div className="py-20 border-t border-slate-100 dark:border-white/5 text-center">
                <button
                    onClick={() => setIsVerifyOpen(true)}
                    className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-exquisite-gold transition-colors group"
                >
                    <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Verify My Gift Pledge</span>
                </button>
            </div>

            <ContributionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                onSuccess={fetchEvent}
            />

            <VerifyPledgeModal
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
                onVerified={() => {
                    api.get(`/events/${id}/public`).then(res => setEvent(res.data));
                }}
            />

            <RSVPModal
                isOpen={isRsvpOpen}
                onClose={() => setIsRsvpOpen(false)}
                eventId={event.id}
                onRsvpSubmitted={(newGuest) => {
                    setRsvpToast(`Thank you, ${newGuest.name}! Your RSVP has been submitted successfully.`);
                    setTimeout(() => setRsvpToast(''), 4000);
                }}
            />

            {/* Minimal Footer */}
            <footer className="pb-12 text-center opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">© 2026 EVENTGIFT REGISTRY. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default PublicEvent;
