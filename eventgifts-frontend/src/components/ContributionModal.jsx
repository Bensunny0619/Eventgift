import { useState } from 'react';
import { X, Heart, ShieldCheck, Loader2, MessageCircle } from 'lucide-react';
import api from '../api/api';

const ContributionModal = ({ isOpen, onClose, item, onContributionPledged }) => {
    const [amount, setAmount] = useState(item?.price || '');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pledgeSuccess, setPledgeSuccess] = useState(false);
    const [pledgeData, setPledgeData] = useState(null);

    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/contributions', {
                item_id: item.id,
                amount: parseFloat(amount),
                message_text: message
            });
            setPledgeData(response.data.contribution);
            setPledgeSuccess(true);
            if (onContributionPledged) onContributionPledged(response.data.contribution);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process pledge. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (pledgeSuccess) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden p-10 text-center animate-slide-up">
                    <div className="mb-6 inline-flex p-4 bg-green-50 rounded-full">
                        <ShieldCheck className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Pledge Received!</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Thank you for your generous contribution of <span className="font-bold text-slate-900">${parseFloat(amount).toFixed(2)}</span> toward <span className="font-bold text-slate-900">{item.title}</span>.
                    </p>

                    <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Your Payment Code</span>
                        <code className="text-xl font-mono text-primary-600 font-bold tracking-widest break-all">
                            {pledgeData?.transaction_reference || 'REF-8392-XP'}
                        </code>
                        <p className="text-[10px] text-slate-400 mt-3 italic">
                            Use this reference code to verify your offline transfer if needed.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                    >
                        Finish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Contribute</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="h-6 w-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 mb-8 p-4 bg-primary-50 rounded-2xl">
                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center border border-primary-100">
                            <Gift className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-primary-600 font-medium">Goal: ${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Amount to Pledge ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-300"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">A Message for the Host</label>
                            <div className="relative">
                                <div className="absolute top-4 left-4 flex items-start">
                                    <MessageCircle className="h-5 w-5 text-slate-400" />
                                </div>
                                <textarea
                                    rows="3"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none shadow-inner"
                                    placeholder="e.g., Happy Birthday! Sending you so much love."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:transform-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <Heart className="h-5 w-5 mr-3 fill-current" /> Send Gift Pledge
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Pledge System</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContributionModal;
