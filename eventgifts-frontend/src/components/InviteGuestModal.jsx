import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Loader2, Sparkles } from 'lucide-react';
import api from '../api/api';

const InviteGuestModal = ({ isOpen, onClose, onGuestAdded }) => {
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        event_id: '',
        status: 'Pending',
        tier: 'Standard'
    });

    useEffect(() => {
        if (isOpen) {
            api.get('/events')
                .then(res => {
                    setEvents(res.data);
                    if (res.data.length > 0 && !formData.event_id) {
                        setFormData(prev => ({ ...prev, event_id: res.data[0].id.toString() }));
                    }
                })
                .catch(err => console.error('Failed to fetch events', err))
                .finally(() => setIsLoadingEvents(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/guests', formData);
            onGuestAdded(res.data);
            onClose();
            setFormData({
                name: '',
                email: '',
                event_id: events[0]?.id.toString() || '',
                status: 'Pending',
                tier: 'Standard'
            });
        } catch (err) {
            console.error('Failed to invite guest', err);
            alert('Failed to invite guest. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 h-40 w-40 gold-gradient opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                
                <div className="p-8 sm:p-12">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">Invite New Guest</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Add someone to your event's guest list.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Guest Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Enter guest's full name"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                    <input 
                                        type="email" 
                                        placeholder="guest@example.com"
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Event Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Select Event</label>
                                    <select 
                                        required
                                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium appearance-none"
                                        value={formData.event_id}
                                        onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                                    >
                                        <option value="" disabled>Choose an event</option>
                                        {events.map(event => (
                                            <option key={event.id} value={event.id}>{event.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Guest Tier */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Guest Tier</label>
                                    <select 
                                        className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium appearance-none"
                                        value={formData.tier}
                                        onChange={(e) => setFormData({...formData, tier: e.target.value})}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="VVIP">VVIP</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={isSubmitting || isLoadingEvents}
                                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Sending Invite...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        <span>Confirm Invitation</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InviteGuestModal;
