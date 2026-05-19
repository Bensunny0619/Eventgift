import { useState, useEffect } from 'react';
import { X, Gift, Type, AlignLeft, Loader2, Image as ImageIcon, Sparkles, Diamond } from 'lucide-react';
import api from '../api/api';

const AddItemModal = ({ isOpen, onClose, eventId, onItemAdded, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image_url: '',
        is_split_allowed: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price || '',
                image_url: initialData.image_url || '',
                is_split_allowed: initialData.is_split_allowed !== undefined ? !!initialData.is_split_allowed : true
            });
        } else if (isOpen) {
            setFormData({ title: '', description: '', price: '', image_url: '', is_split_allowed: true });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let response;
            if (initialData?.id) {
                response = await api.put(`/registry-items/${initialData.id}`, formData);
                onItemAdded(response.data, true); // true indicates update
            } else {
                response = await api.post(`/events/${eventId}/items`, formData);
                onItemAdded(response.data, false); // false indicates create
            }
            onClose();
            setFormData({ title: '', description: '', price: '', image_url: '', is_split_allowed: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 animate-in zoom-in-95 duration-300">
                <div className="p-8 sm:p-12">
                    <div className="flex justify-between items-center mb-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-serif text-slate-900 dark:text-white flex items-center">
                                <Sparkles className="h-5 w-5 text-exquisite-gold mr-3" />
                                {initialData ? 'Edit Registry Item' : 'Add Registry Item'}
                            </h2>
                            <p className="text-xs font-medium text-slate-400 italic px-8">Curate your perfect wishlist.</p>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Item Title
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Luxury Dinner Set"
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                        Price (₦)
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <Diamond className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="50,000"
                                        className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                        Image URL
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <ImageIcon className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 absolute -top-2.5 left-5 px-2 bg-white dark:bg-slate-900 transition-colors group-focus-within:text-exquisite-gold">
                                    Description
                                </label>
                                <div className="absolute top-6 left-6 pointer-events-none">
                                    <AlignLeft className="h-5 w-5 text-slate-300 group-focus-within:text-exquisite-gold transition-colors" />
                                </div>
                                <textarea
                                    rows="3"
                                    placeholder="Brief details about the item..."
                                    className="block w-full pl-16 pr-6 py-5 bg-transparent border-2 border-slate-50 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-exquisite-gold/30 transition-all font-bold placeholder-slate-300 dark:placeholder-slate-700 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Allow Split Payments / Crowdfunding</h4>
                                    <p className="text-[11px] text-slate-400 font-medium">Allow guests to pledge custom amounts toward this item.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={formData.is_split_allowed}
                                        onChange={(e) => setFormData({ ...formData, is_split_allowed: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-exquisite-gold"></div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:flex-[2] py-6 gold-gradient text-white font-black rounded-2xl shadow-xl shadow-exquisite-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-[0.2em] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Gift className="h-5 w-5 mr-3" /> 
                                        <span>{initialData ? 'Update Item' : 'Add to Registry'}</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:flex-1 py-6 bg-slate-50 dark:bg-white/5 text-slate-400 font-black rounded-2xl hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-[0.2em]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;
