import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Calendar as CalendarIcon, MapPin, Type, AlignLeft, ArrowLeft, Loader2, Sparkles, Save } from 'lucide-react';
import CalendarModal from '../components/CalendarModal';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    };

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => {
                setFormData({
                    title: res.data.title || '',
                    date: res.data.date || '',
                    location: res.data.location || '',
                    description: res.data.description || ''
                });
            })
            .catch(() => setError('Failed to load event details.'))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            await api.put(`/events/${id}`, formData);
            navigate(`/events/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
            <div className="mb-16 text-center">
                <Link to={`/events/${id}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-exquisite-gold transition-colors group mb-8">
                    <ArrowLeft className="h-3 w-3 mr-2 group-hover:-translate-x-1 transition-transform" /> 
                    Back to management
                </Link>
                <h1 className="text-4xl sm:text-6xl font-serif text-slate-900 dark:text-white mb-4">Edit Event</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Update your celebration details.</p>
            </div>

            <div className="exquisite-card p-8 md:p-16 relative overflow-hidden">
                {error && (
                    <div className="mb-10 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center">
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
                                className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold"
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
                                <div 
                                    className="absolute inset-y-0 left-0 pl-6 flex items-center cursor-pointer"
                                    onClick={() => setIsCalendarOpen(true)}
                                >
                                    <CalendarIcon className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    required
                                    onClick={() => setIsCalendarOpen(true)}
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold cursor-pointer"
                                    value={formatDate(formData.date)}
                                />
                            </div>

                            {/* Location */}
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Event Location
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                Event Description
                            </label>
                            <div className="absolute top-6 left-6 flex items-start pointer-events-none">
                                <AlignLeft className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                            </div>
                            <textarea
                                rows="5"
                                className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-6 gold-gradient text-white font-black rounded-2xl shadow-2xl shadow-exquisite-gold/30 disabled:opacity-50 hover:scale-[1.01] transition-all uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
                        >
                            {isSaving ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={formData.date}
                onDateSelect={(date) => setFormData({ ...formData, date })}
            />
        </div>
    );
};

export default EditEvent;
