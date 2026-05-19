import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2, Save, Palette, Type, Calendar, MapPin } from 'lucide-react';
import api from '../api/api';

const EventSettingsModal = ({ isOpen, onClose, event, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        welcome_message: '',
        theme_color: 'exquisite-gold'
    });
    
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const themeColors = [
        { id: 'exquisite-gold', name: 'Exquisite Gold', class: 'bg-[#D4AF37]' },
        { id: 'rose-gold', name: 'Rose Gold', class: 'bg-[#B76E79]' },
        { id: 'emerald', name: 'Emerald', class: 'bg-[#50C878]' },
        { id: 'midnight-blue', name: 'Midnight', class: 'bg-[#191970]' },
    ];

    useEffect(() => {
        if (event && isOpen) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
                location: event.location || '',
                welcome_message: event.welcome_message || '',
                theme_color: event.theme_color || 'exquisite-gold'
            });
            setCoverPreview(event.cover_image_url ? `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')}${event.cover_image_url}` : null);
            setCoverImage(null);
            setError('');
        }
    }, [event, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // First, update text settings
            await api.put(`/events/${event.id}`, formData);

            // Then, upload cover image if changed
            if (coverImage) {
                setIsUploading(true);
                const imageForm = new FormData();
                imageForm.append('cover_image', coverImage);
                await api.post(`/events/${event.id}/cover`, imageForm, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update event settings', err);
            setError(err.response?.data?.message || 'Failed to update settings. Please try again.');
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-white/5">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-white/5">
                    <div>
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white">Event Settings</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Customize how your registry appears to guests.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 sm:p-8 flex-1 custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form id="settings-form" onSubmit={handleSave} className="space-y-8">
                        
                        {/* Cover Image Section */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                                <ImageIcon className="h-4 w-4 mr-2 text-exquisite-gold" />
                                Cover Image
                            </label>
                            
                            <div className="relative group rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-exquisite-gold transition-colors duration-300">
                                {coverPreview ? (
                                    <div className="relative h-48 w-full">
                                        <img src={coverPreview} alt="Cover Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-bold px-4 py-2 bg-black/50 rounded-full backdrop-blur-md">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400">
                                        <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                        <span className="font-bold">Click to upload cover image</span>
                                        <span className="text-xs mt-1">16:9 ratio recommended</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Theme Color Section */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                                <Palette className="h-4 w-4 mr-2 text-exquisite-gold" />
                                Color Theme
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {themeColors.map(theme => (
                                    <label key={theme.id} className="relative cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="theme_color" 
                                            value={theme.id} 
                                            checked={formData.theme_color === theme.id}
                                            onChange={(e) => setFormData({...formData, theme_color: e.target.value})}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            h-12 w-12 rounded-full ${theme.class} shadow-lg transition-transform duration-200
                                            ${formData.theme_color === theme.id ? 'ring-4 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110' : 'group-hover:scale-105'}
                                        `}></div>
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                            {theme.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-white/5 pt-8">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Basic Details</h4>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center">
                                        <Type className="h-4 w-4 mr-2" /> Event Title
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-exquisite-gold focus:border-transparent outline-none transition-all dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Welcome Message</label>
                                    <textarea 
                                        value={formData.welcome_message}
                                        onChange={e => setFormData({...formData, welcome_message: e.target.value})}
                                        rows="3"
                                        placeholder="Write a warm welcome message for your guests..."
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-exquisite-gold focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" /> Date
                                        </label>
                                        <input 
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={e => setFormData({...formData, date: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-exquisite-gold focus:border-transparent outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" /> Location
                                        </label>
                                        <input 
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({...formData, location: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-exquisite-gold focus:border-transparent outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="settings-form"
                        disabled={isLoading}
                        className="px-8 py-3 gold-gradient text-white rounded-2xl font-bold shadow-xl shadow-exquisite-gold/20 hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                {isUploading ? 'Uploading...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5 mr-2" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventSettingsModal;
