import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Calendar, MapPin, Gift, Loader2, ArrowLeft, Heart, MessageSquare, ShieldCheck } from 'lucide-react';
import ContributionModal from '../components/ContributionModal';
import VerifyPledgeModal from '../components/VerifyPledgeModal';

const PublicEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);

    useEffect(() => {
        // Note: Calling our new public endpoint
        api.get(`/events/${id}/public`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Event not found</h2>
                <Link to="/" className="text-primary-600 font-bold hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Header */}
            <div className="bg-white border-b border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50/50 skew-x-12 transform translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                Guest View
                            </div>
                            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{event.title}</h1>
                            <div className="flex flex-wrap gap-8 text-slate-600 font-medium">
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-3 text-primary-500" />
                                    {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-3 text-primary-500" />
                                    {event.location || 'Location not specified'}
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 animate-fade-in">
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
                                    Welcome! Your presence is the best gift, but if you'd like to contribute, see the registry below.
                                </p>
                                <button
                                    onClick={() => setIsVerifyOpen(true)}
                                    className="mt-4 flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
                                >
                                    <ShieldCheck className="h-4 w-4 mr-2" /> Verify My Pledge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registry Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 underline decoration-primary-300 underline-offset-8">Gifting Registry</h2>
                    <p className="text-slate-600">Select an item to contribute toward the host's wishlist.</p>
                </div>

                {!event.registry_items || event.registry_items.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-xl shadow-slate-200/40 border border-slate-100">
                        <Gift className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                        <p className="text-slate-500 text-lg italic">The host hasn't added any items to the registry yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {event.registry_items.map(item => {
                            const progress = Math.min(100, (parseFloat(item.amount_raised || 0) / parseFloat(item.price || 1)) * 100);
                            const isFulfilled = progress >= 100;

                            return (
                                <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary-100 transition-all group relative overflow-hidden">
                                    {isFulfilled && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white px-6 py-2 rounded-bl-3xl text-xs font-black uppercase tracking-widest z-20">
                                            Fully Funded
                                        </div>
                                    )}
                                    <div className="aspect-square bg-slate-50 rounded-[2rem] mb-8 relative overflow-hidden flex items-center justify-center border border-slate-50 group-hover:scale-[1.02] transition-transform">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="object-cover w-full h-full" />
                                        ) : (
                                            <Gift className="h-16 w-16 text-slate-200" />
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{item.title}</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Collected</span>
                                            <span className="text-slate-900 font-black">${parseFloat(item.amount_raised).toFixed(2)}</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${isFulfilled ? 'bg-green-500' : 'bg-primary-600'} transition-all duration-1000`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-400 font-medium">{progress.toFixed(0)}% of goal</span>
                                            <span className="font-bold text-slate-700">Goal: ${parseFloat(item.price).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={isFulfilled}
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setIsModalOpen(true);
                                        }}
                                        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg shadow-primary-50 ${isFulfilled
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                            : 'bg-primary-600 hover:bg-primary-700 text-white hover:-translate-y-1'}`}
                                    >
                                        {isFulfilled ? 'Gift Fulfilled' : <><Heart className="h-5 w-5 mr-3 fill-current" /> Give a Gift</>}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
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
        </div>
    );
};

export default PublicEvent;
