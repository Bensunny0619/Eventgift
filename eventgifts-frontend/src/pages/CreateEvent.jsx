import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Calendar, MapPin, Type, AlignLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/events', formData);
            navigate(`/events/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-16 text-center">
                <div className="inline-flex h-16 w-16 gold-gradient rounded-2xl items-center justify-center shadow-xl shadow-exquisite-gold/20 mb-8 transform hover:rotate-12 transition-transform cursor-pointer">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-serif text-slate-900 dark:text-white mb-4 italic">Initiate Event</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Curate your next masterpiece gathering.</p>
            </div>

            <div className="exquisite-card p-8 md:p-16 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 gold-gradient opacity-[0.03] dark:opacity-[0.05] rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                {error && (
                    <div className="mb-10 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                    <div className="space-y-10">
                        {/* Event Title */}
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                Event Title
                            </label>
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Type className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="e.g., The Heritage Gala 2026"
                                className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Event Date */}
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Event Date
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Location */}
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Distinguished Location
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="City, Venue, or Estate"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                Curated Details
                            </label>
                            <div className="absolute top-6 left-6 flex items-start pointer-events-none">
                                <AlignLeft className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                            </div>
                            <textarea
                                rows="5"
                                placeholder="Whisper the essence of your celebration to your guests..."
                                className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 gold-gradient text-white font-black rounded-2xl shadow-2xl shadow-exquisite-gold/30 disabled:opacity-50 hover:scale-[1.01] transform transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Curate Event</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
