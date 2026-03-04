import { useState } from 'react';
import { X, ShieldCheck, Search, Loader2, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import api from '../api/api';

const VerifyPledgeModal = ({ isOpen, onClose, onVerified }) => {
    const [reference, setReference] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    if (!isOpen) return null;

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // First we need to find the contribution ID by reference? 
            // Actually our backend verify endpoint takes the contribution ID.
            // For this demo, we'll assume the user has the contribution ID or we fetch it.
            // Let's assume we have a search endpoint or we just use the reference directly if we had a dedicated endpoint.
            // Since we don't have a 'find by reference' endpoint, I'll mock find it for now or 
            // I should have added one. Let's add a public find-by-reference endpoint.

            const response = await api.post('/contributions/search', { transaction_reference: reference });
            const contribution = response.data;

            const verifyRes = await api.post(`/contributions/${contribution.id}/verify`, {
                transaction_reference: reference
            });

            setVerificationResult(verifyRes.data.contribution);
            if (onVerified) onVerified(verifyRes.data.contribution);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid reference or verification failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Verify Contribution</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="h-6 w-6 text-slate-400" />
                        </button>
                    </div>

                    {!verificationResult ? (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <p className="text-slate-500 text-sm mb-6">
                                Enter your transaction reference code to confirm your contribution and see if the host has sent a message!
                            </p>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Reference Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="REF-XXXX-XXXX"
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono font-bold uppercase tracking-wider"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs flex items-center border border-red-100">
                                    <AlertCircle className="h-4 w-4 mr-2" /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:transform-none"
                            >
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Verify Now'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="mb-6 inline-flex p-4 bg-green-50 rounded-full">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Verification Successful!</h3>
                            <p className="text-slate-600 mb-8 font-medium">
                                Your contribution of <span className="text-slate-900">${parseFloat(verificationResult.amount).toFixed(2)}</span> has been confirmed.
                            </p>

                            {verificationResult.thank_you_video ? (
                                <div className="bg-primary-50 p-6 rounded-[2rem] border border-primary-100 mb-8">
                                    <p className="text-primary-700 font-bold mb-4 flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 mr-2" /> The host sent you a thank you!
                                    </p>
                                    <a
                                        href={verificationResult.thank_you_video.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
                                    >
                                        <Play className="h-4 w-4 mr-2 fill-current" /> Watch Video
                                    </a>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm italic mb-8">The host hasn't uploaded a thank-you video yet. Check back soon!</p>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyPledgeModal;
