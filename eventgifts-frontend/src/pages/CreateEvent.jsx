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
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Create a New Event</h1>
                <p className="text-slate-600">Fill in the details below to start your registry.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[100%] pointer-events-none"></div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm flex items-center">
                        <Sparkles className="h-5 w-5 mr-3" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Event Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-primary-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., My 30th Birthday Party"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Event Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City, Venue, or Online"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Description (Optional)</label>
                            <div className="relative">
                                <div className="absolute top-4 left-5 flex items-start pointer-events-none">
                                    <AlignLeft className="h-5 w-5 text-primary-500" />
                                </div>
                                <textarea
                                    rows="4"
                                    placeholder="Tell your guests more about the celebration..."
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center disabled:opacity-70 disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-6 w-6 mr-3 animate-spin" /> Creating...
                                </>
                            ) : (
                                <>
                                    Create Event <ArrowRight className="ml-3 h-5 w-5" />
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
