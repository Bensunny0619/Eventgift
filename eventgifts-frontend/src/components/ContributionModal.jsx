import { useState, useEffect } from 'react';
import { X, Heart, ShieldCheck, Loader2, MessageCircle, Gift } from 'lucide-react';
import api from '../api/api';

const ContributionModal = ({ isOpen, onClose, item, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pledgeSuccess, setPledgeSuccess] = useState(false);
    const [pledgeData, setPledgeData] = useState(null);

    useEffect(() => {
        if (isOpen && item) {
            const remaining = item.price - (item.amount_raised || 0);
            setAmount(item.is_split_allowed ? remaining : item.price);
        }
    }, [isOpen, item]);

    const handleClose = () => {
        onClose();
        setPledgeSuccess(false);
        setPledgeData(null);
        setAmount('');
        setMessage('');
    };

    if (!isOpen || !item) return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const remaining = item.price - (item.amount_raised || 0);
        const floatAmount = parseFloat(amount);

        if (item.is_split_allowed) {
            if (floatAmount > remaining) {
                setError(`Your contribution cannot exceed the remaining balance of ₦${remaining.toLocaleString()}.`);
                setIsLoading(false);
                return;
            }
        } else {
            if (floatAmount !== parseFloat(item.price)) {
                setError(`This item does not allow split payments. You must contribute the full price of ₦${parseFloat(item.price).toLocaleString()}.`);
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await api.post(`/registry-items/${item.id}/contribute`, {
                amount: parseFloat(amount),
                message_text: message
            });
            setPledgeData(response.data.contribution);
            setPledgeSuccess(true);
            // Refresh the registry immediately in the background
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process pledge. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (pledgeSuccess) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 text-center animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5">
                    <div className="mb-6 inline-flex p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                        <ShieldCheck className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">Pledge Received!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed italic font-medium">
                        Thank you for your generous contribution of <span className="font-bold text-exquisite-gold">₦{parseFloat(amount).toLocaleString()}</span> toward <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>.
                    </p>

                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl mb-8 text-left border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Your Payment Code</span>
                        <code className="text-xl font-mono text-exquisite-gold font-bold tracking-widest break-all">
                            {pledgeData?.transaction_reference || 'REF-8392-XP'}
                        </code>
                        <p className="text-[10px] text-slate-400 mt-4 italic font-medium leading-relaxed">
                            Please use this reference code when making your transfer. Your pledge will be verified by the host shortly.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-5 gold-gradient text-white font-black rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                    >
                        Return to Registry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-white">Contribute</h2>
                            <p className="text-xs font-medium text-slate-400 italic">Select an amount to pledge toward this gift.</p>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-5 mb-10 p-5 bg-exquisite-gold/5 border border-exquisite-gold/10 rounded-2xl">
                        <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center border border-exquisite-gold/20 shadow-sm">
                            <Gift className="h-7 w-7 text-exquisite-gold" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[11px] text-exquisite-gold font-black uppercase tracking-widest">Target: ₦{parseFloat(item.price).toLocaleString()}</p>
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${
                                    item.is_split_allowed 
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                                }`}>
                                    {item.is_split_allowed ? 'Crowdfunded' : 'Single Buyer'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Amount to Pledge (₦)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                disabled={!item.is_split_allowed}
                                className={`block w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-exquisite-gold/20 rounded-2xl text-3xl font-serif text-slate-900 dark:text-white focus:outline-none transition-all placeholder-slate-300 dark:placeholder-slate-700 ${
                                    !item.is_split_allowed ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-400 font-bold' : ''
                                }`}
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {!item.is_split_allowed && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-bold tracking-tight px-2">
                                    * This item does not support split payments. You must contribute the full amount.
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">A Message for the Host</label>
                            <div className="relative group">
                                <div className="absolute top-5 left-6 flex items-start">
                                    <MessageCircle className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <textarea
                                    rows="3"
                                    className="block w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-exquisite-gold/20 rounded-2xl text-slate-900 dark:text-white focus:outline-none transition-all font-medium resize-none placeholder-slate-300 dark:placeholder-slate-700"
                                    placeholder="e.g., Happy Birthday! Sending you so much love."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 gold-gradient text-white font-black rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 uppercase tracking-widest text-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <Heart className="h-5 w-5 mr-3 fill-current" /> Send Gift Pledge
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContributionModal;
