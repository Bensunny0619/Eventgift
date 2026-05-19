import { useState } from 'react';
import { X, User, Mail, Check, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../api/api';

const RSVPModal = ({ isOpen, onClose, eventId, onRsvpSubmitted }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('Confirmed'); // Confirmed (Attending) or Declined
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post(`/events/${eventId}/rsvp`, {
                name: formData.name,
                email: formData.email,
                status: status
            });
            
            if (onRsvpSubmitted) {
                onRsvpSubmitted(res.data.guest);
            }
            
            // Clean up state
            setFormData({ name: '', email: '' });
            setStatus('Confirmed');
            onClose();
        } catch (err) {
            console.error('Failed to submit RSVP', err);
            alert('Failed to submit RSVP. Please verify your connection and details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
            
            {/* Modal Body */}
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5">
                {/* Decorative gold gradient blur */}
                <div className="absolute top-0 right-0 h-48 w-48 gold-gradient opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                
                <div className="p-8 sm:p-12">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white mb-2">RSVP to Celebration</h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic">We would love to know if you can make it!</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Gbenga Emmanuel"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                                    <input 
                                        required
                                        type="email" 
                                        placeholder="gbenga@example.com"
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium text-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Status Option Toggles */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your RSVP Status</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStatus('Confirmed')}
                                        className={`flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 transition-all font-bold uppercase text-[10px] tracking-widest ${
                                            status === 'Confirmed'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500'
                                                : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                                        }`}
                                    >
                                        <Check className={`h-4 w-4 ${status === 'Confirmed' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all`} />
                                        <span>Attending</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStatus('Declined')}
                                        className={`flex items-center justify-center space-x-3 p-5 rounded-2xl border-2 transition-all font-bold uppercase text-[10px] tracking-widest ${
                                            status === 'Declined'
                                                ? 'bg-rose-500/10 text-rose-500 border-rose-500'
                                                : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                                        }`}
                                    >
                                        <AlertTriangle className={`h-4 w-4 ${status === 'Declined' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} transition-all`} />
                                        <span>Declining</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-slate-50 dark:border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-4 gold-gradient text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl shadow-exquisite-gold/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Send RSVP</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RSVPModal;
