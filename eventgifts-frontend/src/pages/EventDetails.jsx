import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Calendar, MapPin, Gift, Plus, Loader2, ArrowLeft, Share2, Archive, ShieldCheck } from 'lucide-react';
import AddItemModal from '../components/AddItemModal';
import ThankYouModal from '../components/ThankYouModal';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const [activeContribution, setActiveContribution] = useState(null);

    useEffect(() => {
        // We need to load deep relationships
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleItemAdded = (newItem) => {
        setEvent(prev => ({
            ...prev,
            registry_items: [...(prev.registry_items || []), newItem]
        }));
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
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Event not found</h2>
                <Link to="/dashboard" className="text-primary-600 font-bold hover:underline italic">&larr; Back to dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-primary-600 transition-colors font-medium mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{event.title}</h1>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center text-slate-600">
                                <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                                {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </div>
                            <div className="flex items-center text-slate-600">
                                <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                                {event.location || 'Location not specified'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all shadow-sm">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:border-red-300 hover:text-red-600 transition-all shadow-sm">
                            <Archive className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mt-12">
                {/* Main Content: Registry */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Gift Registry</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add Item
                        </button>
                    </div>

                    {!event.registry_items || event.registry_items.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-[2.5rem] p-16 text-center">
                            <Gift className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Build your wishlist</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Add the gifts you'd love to receive. Guests can contribute toward them easily.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-primary-600 font-bold hover:underline italic"
                            >
                                Add your first item now
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-6">
                            {event.registry_items.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-primary-200 transition-all group">
                                    <div className="aspect-square bg-slate-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="object-cover w-full h-full" />
                                        ) : (
                                            <Gift className="h-12 w-12 text-slate-200" />
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-slate-500 text-sm font-medium">Progress</span>
                                        <span className="text-primary-600 font-bold text-sm">
                                            ${parseFloat(item.amount_raised).toFixed(2)} / ${parseFloat(item.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (parseFloat(item.amount_raised || 0) / parseFloat(item.price || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Activity & Summary */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Event Stats</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Total Goal</span>
                                <span className="font-bold text-slate-900">
                                    ${event.registry_items?.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Raised so far</span>
                                <span className="font-bold text-primary-600 text-lg">
                                    ${event.registry_items?.reduce((acc, curr) => acc + parseFloat(curr.amount_raised), 0).toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-50">
                                <div className="text-sm font-semibold text-slate-400 mb-4 tracking-wider uppercase">Recent Contributions</div>
                                {(!event.registry_items?.some(i => i.contributions?.length > 0)) ? (
                                    <p className="text-slate-400 text-xs italic">No contributions yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {event.registry_items.flatMap(i => i.contributions || []).map(c => (
                                            <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-slate-900">${parseFloat(c.amount).toFixed(2)}</span>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${c.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 line-clamp-2 italic mb-3">"{c.message_text}"</p>
                                                {c.status === 'verified' && !c.thank_you_video && (
                                                    <button
                                                        onClick={() => {
                                                            setActiveContribution(c.id);
                                                            setIsThankYouOpen(true);
                                                        }}
                                                        className="w-full py-2 bg-primary-600 text-white text-[10px] font-bold rounded-lg hover:bg-primary-700 transition-colors uppercase tracking-widest"
                                                    >
                                                        Send Thank You
                                                    </button>
                                                )}
                                                {c.thank_you_video && (
                                                    <div className="text-[10px] text-green-600 font-bold flex items-center">
                                                        <ShieldCheck className="h-3 w-3 mr-1" /> Thank you sent
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventId={event.id}
                onItemAdded={handleItemAdded}
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
