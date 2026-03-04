import { useState } from 'react';
import { X, Video, Send, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import api from '../api/api';

const ThankYouModal = ({ isOpen, onClose, contributionId, onVideoSent }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post(`/contributions/${contributionId}/thank-you`, {
                video_url: videoUrl
            });
            onVideoSent(contributionId);
            onClose();
            setVideoUrl('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send thank you video. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Send Gratitude</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="h-6 w-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-3xl mb-8 flex items-center space-x-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border border-primary-100 shadow-sm">
                            <Video className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 leading-snug">
                                Share a personalized video message to show your appreciation for this contribution.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Video URL (YouTube or Loom)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://www.youtube.com/watch?..."
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-xs font-bold text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:transform-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-5 w-5 mr-3" /> Send Thank You
                                </>
                            )}
                        </button>
                        <div className="text-center">
                            <span className="inline-flex items-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                <Sparkles className="h-3 w-3 mr-2" /> Powered by Homa. Gratitude
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ThankYouModal;
