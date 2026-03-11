import { useEffect, useState } from 'react';
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
    Diamond
} from 'lucide-react';
import ContributionModal from '../components/ContributionModal';
import VerifyPledgeModal from '../components/VerifyPledgeModal';

const PublicEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, pledged, available

    useEffect(() => {
        api.get(`/events/${id}/public`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

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
        if (activeTab === ' pledged') return (parseFloat(item.amount_raised) / parseFloat(item.price)) >= 1;
        if (activeTab === 'available') return (parseFloat(item.amount_raised) / parseFloat(item.price)) < 1;
        return true;
    }) || [];

    return (
        <div className="bg-exquisite-cream dark:bg-exquisite-midnight min-h-screen text-slate-900 dark:text-white transition-colors duration-500">

            {/* Elegant Header */}
            <header className="pt-20 pb-16 border-b border-slate-100 dark:border-white/5">
                <div className="max-w-[1400px] mx-auto px-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-3 px-5 py-2 bg-exquisite-gold/10 border border-exquisite-gold/20 rounded-full">
                                <Diamond className="h-3.5 w-3.5 text-exquisite-gold" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-exquisite-gold">Exquisite Light Registry</span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-serif leading-tight">Exquisite Smart Registry</h1>
                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium italic">Curated luxury gifting for your most precious moments.</p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button className="p-4 exquisite-glass rounded-2xl text-slate-500 hover:text-exquisite-gold transition-colors flex items-center space-x-3 group">
                                <Share2 className="h-5 w-5" />
                                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Share</span>
                            </button>
                            <button className="px-10 py-5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 flex items-center space-x-3 group hover:scale-105 transition-all">
                                <Diamond className="h-5 w-5" />
                                <span>Manage</span>
                            </button>
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
                                placeholder="Find a registry..."
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
                        <h3 className="text-3xl font-serif mb-4">No treasures found</h3>
                        <p className="text-slate-500 font-medium">This registry is currently awaiting curation.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-12">
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
                                                    Highly Coveted
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-10 space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                                            <p className="text-2xl font-serif text-exquisite-gold">${parseFloat(item.price).toLocaleString()}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-2">
                                                {item.description || 'Iconic French craftsmanship with exquisite details for your most precious moments.'}
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
                                                <span>${parseFloat(item.amount_raised).toLocaleString()} pledged of ${parseFloat(item.price).toLocaleString()}</span>
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
                                            <button className="px-8 py-5 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-exquisite-gold hover:border-exquisite-gold transition-all">
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
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-exquisite-gold">Exquisite Service</span>
                            <h2 className="text-5xl font-serif italic">Need assistance choosing the perfect gift?</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Our luxury concierges are available 24/7 to guide you through our most exclusive collections and personalized gift options.</p>
                            <button className="px-12 py-5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all text-sm uppercase tracking-[0.2em]">
                                Contact Concierge
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
                    <span>Verify My Pledge Access</span>
                </button>
            </div>

            <ContributionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />

            <VerifyPledgeModal
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
                onVerified={() => {
                    api.get(`/events/${id}/public`).then(res => setEvent(res.data));
                }}
            />

            {/* Minimal Footer */}
            <footer className="pb-12 text-center opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">© 2026 EXQUISITE LIGHT REGISTRY. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default PublicEvent;
