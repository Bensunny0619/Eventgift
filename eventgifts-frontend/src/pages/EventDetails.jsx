import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { 
    Calendar, 
    MapPin, 
    Gift, 
    Plus, 
    Loader2, 
    ArrowLeft, 
    Share2, 
    Archive, 
    ShieldCheck, 
    Diamond,
    Users,
    TrendingUp,
    Sparkles,
    Trash2
} from 'lucide-react';
import AddItemModal from '../components/AddItemModal';
import ThankYouModal from '../components/ThankYouModal';
import StatCard from '../components/StatCard';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const [activeContribution, setActiveContribution] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleItemAdded = (newItem, isUpdate = false) => {
        if (isUpdate) {
            setEvent(prev => ({
                ...prev,
                registry_items: prev.registry_items.map(item => 
                    item.id === newItem.id ? newItem : item
                )
            }));
        } else {
            setEvent(prev => ({
                ...prev,
                registry_items: [...(prev.registry_items || []), newItem]
            }));
        }
        setEditingItem(null);
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        
        try {
            await api.delete(`/registry-items/${itemId}`);
            setEvent(prev => ({
                ...prev,
                registry_items: prev.registry_items.filter(item => item.id !== itemId)
            }));
        } catch (err) {
            console.error('Failed to delete item', err);
            alert('Failed to delete item.');
        }
    };

    const handleDeleteEvent = async () => {
        if (!window.confirm('Are you sure you want to delete this entire event? This cannot be undone.')) return;
        
        try {
            await api.delete(`/events/${id}`);
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Failed to delete event', err);
            alert('Failed to delete event.');
        }
    };

    const handleVideoSent = (cid) => {
        setEvent(prev => ({
            ...prev,
            registry_items: prev.registry_items.map(i => ({
                ...i,
                contributions: i.contributions?.map(c =>
                    c.id === cid ? { ...c, thank_you_video: true } : c
                )
            }))
        }));
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
            <div className="max-w-7xl mx-auto px-10 py-32 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Diamond className="h-20 w-20 text-exquisite-gold/20 mb-8" />
                <h2 className="text-4xl font-serif text-slate-900 dark:text-white mb-6">Event Details Not Found</h2>
                <Link to="/dashboard" className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center space-x-3 shadow-2xl">
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
        );
    }

    const totalGoal = event.registry_items?.reduce((acc, curr) => acc + parseFloat(curr.price), 0) || 0;
    const totalRaised = event.registry_items?.reduce((acc, curr) => acc + parseFloat(curr.amount_raised), 0) || 0;
    const progress = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;
    const contributions = event.registry_items?.flatMap(i => (i.contributions || []).map(c => ({...c, itemTitle: i.title}))) || [];

    const handleShare = async () => {
        const url = `${window.location.origin}/registry/${event.id}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: `Support our celebration by picking a gift from our registry!`,
                    url: url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to copy to clipboard
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
                <div className="space-y-4">
                    <Link to="/dashboard" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-exquisite-gold transition-colors group">
                        <ArrowLeft className="h-3 w-3 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                        Back to dashboard
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white leading-tight">{event.title}</h1>
                    <div className="flex flex-wrap gap-6 mt-6">
                        <div className="flex items-center px-5 py-2.5 exquisite-glass rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                            <Calendar className="h-4 w-4 mr-3 text-exquisite-gold" />
                            {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                        </div>
                        <div className="flex items-center px-5 py-2.5 exquisite-glass rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4 mr-3 text-exquisite-gold" />
                            {event.location || 'Location not specified'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleShare}
                        className="h-14 w-14 flex items-center justify-center exquisite-glass rounded-2xl text-slate-500 hover:text-exquisite-gold hover:border-exquisite-gold/30 transition-all shadow-lg group"
                    >
                        <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button 
                        onClick={handleDeleteEvent}
                        className="h-14 w-14 flex items-center justify-center exquisite-glass rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-lg group"
                    >
                        <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <Link 
                        to={`/registry/${event.id}`}
                        target="_blank"
                        className="px-10 h-14 flex items-center justify-center gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-[1.03] active:scale-[0.98] transition-all space-x-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Public View</span>
                    </Link>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    label="Total Progress" 
                    value={`${progress.toFixed(0)}%`} 
                    trend={progress > 50 ? "Excellent" : "Growing"}
                    icon={TrendingUp}
                />
                <StatCard 
                    label="Amount Raised" 
                    value={`₦${(totalRaised / 1000).toFixed(1)}k`} 
                    badge="Verifying..."
                    icon={Diamond}
                />
                <StatCard 
                    label="Active Registry" 
                    value={event.registry_items?.length || 0} 
                    icon={Gift}
                />
                <StatCard 
                    label="Total Contributors" 
                    value={contributions.length} 
                    icon={Users}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Registry Management */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-white">Gift Registry</h2>
                            <p className="text-xs font-medium text-slate-400 mt-1 italic">Manage your wishlist and track fulfillment.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all space-x-3"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Item</span>
                        </button>
                    </div>

                    {!event.registry_items || event.registry_items.length === 0 ? (
                        <div className="exquisite-card p-24 text-center flex flex-col items-center">
                            <Gift className="h-20 w-20 text-exquisite-gold/20 mb-8" />
                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-4">Your Wishlist is Empty</h3>
                            <p className="text-slate-500 mb-10 max-w-sm">Curate your perfect celebration by adding gifts you'd love to receive.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-10 py-5 gold-gradient text-white rounded-2xl font-bold shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all"
                            >
                                Build Your Registry
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-8">
                            {event.registry_items.map(item => {
                                const itemProgress = Math.min(100, (parseFloat(item.amount_raised || 0) / parseFloat(item.price || 1)) * 100);
                                return (
                                    <div key={item.id} className="exquisite-card overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                        <div className="aspect-[16/10] bg-slate-50 dark:bg-white/5 relative overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-white/5">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <Diamond className="h-16 w-16 text-exquisite-gold/20" />
                                            )}
                                            <div className="absolute top-4 right-4 flex space-x-2">
                                                <button 
                                                    onClick={() => {
                                                        setEditingItem(item);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-white hover:text-slate-900 transition-all border border-white/30"
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white shadow-lg hover:bg-rose-500 transition-all border border-white/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <h4 className="text-2xl font-serif text-slate-900 dark:text-white mb-1 group-hover:text-exquisite-gold transition-colors">{item.title}</h4>
                                                <p className="text-sm font-bold text-exquisite-gold italic">₦{parseFloat(item.price).toLocaleString()}</p>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>Raised: ₦{parseFloat(item.amount_raised).toLocaleString()}</span>
                                                    <span>{itemProgress.toFixed(0)}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full gold-gradient transition-all duration-1000"
                                                        style={{ width: `${itemProgress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Contribution Feed */}
                <div className="space-y-10">
                    <div className="px-2">
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-white">Activity</h2>
                        <p className="text-xs font-medium text-slate-400 mt-1 italic">Real-time contribution ledger.</p>
                    </div>

                    <div className="exquisite-card p-10 space-y-8">
                        {contributions.length === 0 ? (
                            <div className="py-20 text-center flex flex-col items-center">
                                <TrendingUp className="h-12 w-12 text-slate-200 dark:text-white/5 mb-4" />
                                <p className="text-sm font-bold text-slate-400">Awaiting first gift...</p>
                            </div>
                        ) : (
                            <div className="space-y-8 max-h-[800px] overflow-y-auto custom-sidebar-scroll pr-4">
                                {contributions.map((c, idx) => (
                                    <div key={c.id} className={`pb-8 ${idx !== contributions.length - 1 ? 'border-b border-slate-50 dark:border-white/5' : ''} space-y-4`}>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">₦{parseFloat(c.amount).toLocaleString()}</span>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-exquisite-gold">Toward {c.itemTitle}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm ${
                                                c.status === 'verified' || c.status === 'paid' 
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        
                                        {c.message_text && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                                                "{c.message_text}"
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </span>
                                            {(c.status === 'verified' || c.status === 'paid') && !c.thank_you_video ? (
                                                <button
                                                    onClick={() => {
                                                        setActiveContribution(c.id);
                                                        setIsThankYouOpen(true);
                                                    }}
                                                    className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black rounded-xl hover:scale-105 transition-all uppercase tracking-widest shadow-xl"
                                                >
                                                    Send Note
                                                </button>
                                            ) : c.thank_you_video ? (
                                                <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center">
                                                    <ShieldCheck className="h-3 w-3 mr-1" /> Gratitude Sent
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Shared Invitation Link */}
                    <div className="exquisite-card p-10 bg-exquisite-gold/5 border border-exquisite-gold/10 space-y-6">
                        <div className="h-12 w-12 gold-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">Invitation Link</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Share this link with your guests so they can access your registry.</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <input 
                                readOnly 
                                value={`${window.location.origin}/registry/${event.id}`}
                                className="flex-grow bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-400 select-all"
                            />
                            <button 
                                onClick={() => copyToClipboard(`${window.location.origin}/registry/${event.id}`)}
                                className="p-3 exquisite-glass rounded-xl text-exquisite-gold hover:bg-exquisite-gold hover:text-white transition-all shadow-sm relative group"
                            >
                                <Share2 className="h-4 w-4" />
                                {isCopied && (
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg animate-in fade-in slide-in-from-bottom-2">
                                        Copied!
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                }}
                eventId={event.id}
                onItemAdded={handleItemAdded}
                initialData={editingItem}
            />

            <ThankYouModal
                isOpen={isThankYouOpen}
                onClose={() => setIsThankYouOpen(false)}
                contributionId={activeContribution}
                onVideoSent={handleVideoSent}
            />
        </div>
    );
};

export default EventDetails;
