import { useState } from 'react';
import { X, Gift, DollarSign, Type, AlignLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../api/api';

const AddItemModal = ({ isOpen, onClose, eventId, onItemAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post(`/events/${eventId}/items`, formData);
            onItemAdded(response.data);
            onClose();
            setFormData({ title: '', description: '', price: '', image_url: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Add Registry Item</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="h-6 w-6 text-slate-400" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-primary-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Ceramic Dinner Set"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="250.00"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ImageIcon className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <div className="relative">
                                <div className="absolute top-3.5 left-4 flex items-start pointer-events-none">
                                    <AlignLeft className="h-5 w-5 text-primary-500" />
                                </div>
                                <textarea
                                    rows="3"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                                    placeholder="Briefly describe the item..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:transform-none"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Gift className="h-5 w-5 mr-3" /> Add to Registry
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

export default AddItemModal;
