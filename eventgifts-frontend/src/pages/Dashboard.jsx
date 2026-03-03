import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Plus, Calendar, MapPin, ExternalLink, Loader2, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Events</h1>
                    <p className="text-slate-600">Welcome back, {user?.name}. Manage your celebrations here.</p>
                </div>
                <Link to="/events/create" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5">
                    <Plus className="h-5 w-5 mr-2" /> Create New Event
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                    <Gift className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No events found</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't created any events yet. Build your first registry and start celebrating!</p>
                    <Link to="/events/create" className="text-primary-600 font-bold hover:underline">Get started now &rarr;</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-primary-200 transition-all">
                            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                    {event.status}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">{event.title}</h3>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                                        {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </div>
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                                        {event.location}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <Link to={`/events/${event.id}`} className="text-primary-600 font-bold flex items-center hover:underline">
                                        View Registry <ExternalLink className="ml-1 h-4 w-4" />
                                    </Link>
                                    <div className="text-xs font-semibold text-slate-400">
                                        {event.registry_items_count || 0} items
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
