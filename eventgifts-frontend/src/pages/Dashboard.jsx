import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import {
    Plus,
    Loader2,
    Sparkles,
    Users,
    Gift,
    Trophy,
    ArrowRight,
    ChevronRight,
    Clock,
    MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/events')
            .then(res => setEvents(res.data))
            .catch(err => console.error('Failed to fetch events', err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <StatCard
                    label="Active Soirées"
                    value={events.length < 10 ? `0${events.length}` : events.length}
                    trend="+12.5%"
                    icon={Sparkles}
                />
                <StatCard
                    label="Confirmed RSVPs"
                    value="1,248"
                    trend="+4.2%"
                    icon={Users}
                    color="dark"
                />
                <StatCard
                    label="Gift Valuations"
                    value="$245.2k"
                    badge="New Milestone"
                    icon={Gift}
                />
                <StatCard
                    label="Elite Hosts Rank"
                    value="#04"
                    badge="Steady"
                    icon={Trophy}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">

                {/* Main Content: Active Invitations */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-end justify-between px-2">
                        <div>
                            <h2 className="text-4xl font-serif text-slate-900 dark:text-white">Active Invitations</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your upcoming exclusive gatherings</p>
                        </div>
                        <Link to="/events" className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-exquisite-gold hover:text-exquisite-midnight dark:hover:text-white transition-colors">
                            <span>View All Events</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {events.length === 0 ? (
                            <div className="exquisite-card p-20 text-center flex flex-col items-center">
                                <Sparkles className="h-16 w-16 text-exquisite-gold/30 mb-6" />
                                <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">No active soirées</h3>
                                <p className="text-slate-500 max-w-sm mb-8">It's time to curate your next masterpiece. Start by creating a new event registry.</p>
                                <Link to="/events/create" className="px-10 py-4 gold-gradient text-white font-bold rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all">
                                    Initiate Event
                                </Link>
                            </div>
                        ) : (
                            events.map(event => (
                                <div key={event.id} className="exquisite-card overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="md:w-80 h-64 md:h-auto overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 md:hidden"></div>
                                        <div className="absolute bottom-6 left-6 z-20 md:hidden">
                                            <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">
                                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="h-full w-full bg-slate-200 dark:bg-slate-800 animate-pulse absolute inset-0"></div>
                                        {/* Real image would go here, using a placeholder gradient/diamond for now if no image provided */}
                                        <div className="h-full w-full gold-gradient opacity-20 flex items-center justify-center">
                                            <Diamond className="h-20 w-20 text-exquisite-gold opacity-30" />
                                        </div>
                                    </div>

                                    <div className="p-10 flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-exquisite-gold">
                                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-300"></div>
                                                    ))}
                                                    <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-exquisite-cream flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        +42
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-4xl font-serif text-slate-900 dark:text-white mb-2 group-hover:text-exquisite-gold transition-colors">{event.title}</h3>
                                            <p className="text-slate-500 italic font-medium mb-6 flex items-center">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                {event.location}
                                            </p>

                                            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 justify-between">
                                                <span>Guest Attendance</span>
                                                <span className="text-slate-900 dark:text-white">85% Capacity</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-8">
                                                <div className="h-full exquisite-gold transition-all duration-1000" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Link
                                                to={`/events/${event.id}`}
                                                className="flex-grow py-4 border border-slate-200 dark:border-white/10 rounded-2xl text-center font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase text-[10px] tracking-[0.2em]"
                                            >
                                                Guest List
                                            </Link>
                                            <Link
                                                to={`/events/${event.id}/edit`}
                                                className="flex-grow py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-center font-bold hover:scale-105 transition-all uppercase text-[10px] tracking-[0.2em]"
                                            >
                                                Edit Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar: The Gift Concierge */}
                <div className="space-y-8">
                    <div className="px-2">
                        <h2 className="text-3xl font-serif text-slate-900 dark:text-white">The Gift Concierge</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Curated selections for your guests</p>
                    </div>

                    <div className="exquisite-card p-10 space-y-8">
                        {/* Featured Curated Gift Item */}
                        <div className="space-y-6">
                            <div className="aspect-square rounded-[2rem] bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center relative">
                                <Sparkles className="h-20 w-20 text-exquisite-gold/20" />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                                    Limited Edition
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-serif text-slate-900 dark:text-white leading-tight">Royal Heritage Chronograph</h4>
                                <p className="text-slate-500 mt-1 font-medium italic">$18,500 / Unit</p>
                            </div>
                            <button className="w-full py-4 bg-exquisite-gold/10 text-exquisite-gold hover:bg-exquisite-gold hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center space-x-2">
                                <Plus className="h-5 w-5" />
                                <span>Add to Suite</span>
                            </button>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-white/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h5 className="font-bold text-slate-900 dark:text-white">Curated Collections</h5>
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-square rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-exquisite-gold transition-colors p-4 flex items-center justify-center">
                                        <Diamond className="h-8 w-8 text-exquisite-gold/20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
