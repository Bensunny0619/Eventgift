import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import {
    Calendar,
    Search,
    Plus,
    Filter,
    ArrowRight,
    Diamond,
    MapPin,
    Clock,
    Loader2,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/events')
            .then(res => setEvents(res.data))
            .catch(err => console.error('Failed to fetch events', err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white">Elite Events</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        A curated history of your exclusive gatherings and upcoming distinguished celebrations.
                    </p>
                </div>
                <Link to="/events/create" className="inline-flex items-center justify-center space-x-3 px-10 py-5 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-[1.02] transform transition-all group">
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Event</span>
                </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search your exquisite collection..."
                        className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center justify-center space-x-3 px-8 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 gap-8">
                {filteredEvents.length === 0 ? (
                    <div className="exquisite-card p-20 text-center flex flex-col items-center">
                        <Calendar className="h-16 w-16 text-exquisite-gold/30 mb-6" />
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">No events found</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Refine your search or start curating a new masterpiece for your distinguished guests.</p>
                        <Link to="/events/create" className="px-10 py-4 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all">
                            Initiate Event
                        </Link>
                    </div>
                ) : (
                    filteredEvents.map(event => (
                        <div key={event.id} className="exquisite-card overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="md:w-96 h-64 md:h-auto overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 md:hidden"></div>
                                <div className="absolute bottom-6 left-6 z-20 md:hidden">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="h-full w-full bg-slate-200 dark:bg-slate-800 animate-pulse absolute inset-0"></div>
                                <div className="h-full w-full gold-gradient opacity-20 flex items-center justify-center">
                                    <Diamond className="h-24 w-24 text-exquisite-gold opacity-30 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>

                            <div className="p-8 sm:p-12 flex-grow flex flex-col justify-between capitalize">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <span className="h-2 w-2 rounded-full bg-exquisite-gold animate-pulse"></span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-exquisite-gold">
                                                {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="px-4 py-1.5 bg-exquisite-gold/10 rounded-full border border-exquisite-gold/20">
                                            <span className="text-[9px] font-black text-exquisite-gold uppercase tracking-[0.2em]">Active Registry</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-white mb-4 group-hover:text-exquisite-gold transition-colors duration-300">{event.title}</h3>
                                    <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 italic font-medium mb-8 flex items-center">
                                        <MapPin className="h-5 w-5 mr-3 text-exquisite-gold" />
                                        {event.location}
                                    </p>

                                    <div className="grid grid-cols-3 gap-8 py-8 border-t border-slate-100 dark:border-white/5">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Guests</p>
                                            <p className="text-2xl font-serif text-slate-900 dark:text-white">124</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Registry</p>
                                            <p className="text-2xl font-serif text-slate-900 dark:text-white">85%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Days Left</p>
                                            <p className="text-2xl font-serif text-slate-900 dark:text-white">12</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="w-full sm:w-auto px-12 py-5 border border-slate-200 dark:border-white/10 rounded-2xl text-center font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase text-[10px] tracking-[0.2em]"
                                    >
                                        Management Suite
                                    </Link>
                                    <Link
                                        to={`/registry/${event.id}`}
                                        className="w-full sm:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-center font-bold hover:scale-[1.02] transform transition-all uppercase text-[10px] tracking-[0.2em]"
                                    >
                                        Public View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;
