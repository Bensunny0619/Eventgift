import { useState, useEffect } from 'react';
import {
    Gift,
    Search,
    Diamond,
    Sparkles,
    Plus,
    ChevronRight,
    Loader2,
    Calendar
} from 'lucide-react';
import api from '../api/api';
import AddItemModal from '../components/AddItemModal';

const GiftSuite = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Collections');
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGiftData, setSelectedGiftData] = useState(null);

    const categories = [
        'All Collections',
        'Home & Kitchen',
        'Fashion & Style',
        'Cash Gifts',
        'Luxury Items'
    ];

    const giftItems = [
        {
            id: 1,
            title: 'Samsung Double Door Fridge',
            price: '850000',
            category: 'Home & Kitchen',
            description: 'Premium cooling technology for a modern home.',
            image_url: ''
        },
        {
            id: 2,
            title: 'Hand-Woven Luxury Aso-Oke',
            price: '125000',
            category: 'Fashion & Style',
            description: 'Custom-made traditional attire for distinguished guests.',
            image_url: ''
        },
        {
            id: 3,
            title: 'Premium Dinnerware Set',
            price: '75000',
            category: 'Home & Kitchen',
            description: 'Elegant porcelain set for refined hosting.',
            image_url: ''
        },
        {
            id: 4,
            title: "Cash Gift (Couple's Support)",
            price: '50000',
            category: 'Cash Gifts',
            description: "Financial support for the couple's new journey.",
            image_url: ''
        },
        {
            id: 5,
            title: 'Designer Italian Leather Bag',
            price: '220000',
            category: 'Luxury Items',
            description: 'Exquisite accessory for the distinguished host.',
            image_url: ''
        },
        {
            id: 6,
            title: 'Gold Jewelry Collection',
            price: '450000',
            category: 'Luxury Items',
            description: 'Authentic 18k gold set including necklace and earrings.',
            image_url: ''
        }
    ];

    useEffect(() => {
        api.get('/events')
            .then(res => {
                setEvents(res.data);
                if (res.data.length > 0) {
                    setSelectedEventId(res.data[0].id);
                }
            })
            .catch(err => console.error('Failed to fetch events', err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredGifts = giftItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All Collections' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddGift = (gift) => {
        if (events.length === 0) {
            alert('Please create an event first to add gifts to your registry.');
            return;
        }
        if (!selectedEventId) {
            alert('Please select an event to add this gift to.');
            return;
        }
        setSelectedGiftData(gift);
        setIsModalOpen(true);
    };

    const activeEvent = events.find(e => e.id === selectedEventId);
    const registryCount = activeEvent?.registry_items?.length || 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white">The Gift Suite</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        Select beautiful gifts for your event from our curated local and international collections.
                    </p>
                </div>
                <div className="flex items-center space-x-6">
                    {/* Event Selector */}
                    {events.length > 0 && (
                        <div className="hidden md:flex flex-col items-end">
                            <label className="text-[10px] font-black uppercase tracking-widest text-exquisite-gold mb-2">Active Registry</label>
                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-3 pl-5 pr-12 font-bold focus:outline-none focus:border-exquisite-gold cursor-pointer shadow-sm"
                                    value={selectedEventId || ''}
                                    onChange={(e) => setSelectedEventId(parseInt(e.target.value))}
                                >
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    )}
                    
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Registry Items</p>
                        <p className="text-2xl font-serif text-slate-900 dark:text-white">{registryCount}</p>
                    </div>
                    <div className="h-16 w-16 gold-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-exquisite-gold/20 flex-shrink-0">
                        <Gift className="h-8 w-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Event Selector (Mobile) */}
            {events.length > 0 && (
                <div className="md:hidden px-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-exquisite-gold mb-2 block">Active Registry</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl py-4 pl-5 pr-12 font-bold focus:outline-none focus:border-exquisite-gold cursor-pointer shadow-sm"
                            value={selectedEventId || ''}
                            onChange={(e) => setSelectedEventId(parseInt(e.target.value))}
                        >
                            {events.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                        <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-grow group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search the archive..."
                        className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex overflow-x-auto pb-4 sm:pb-0 space-x-3 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-8 py-5 rounded-[2rem] font-bold transition-all shadow-sm border ${
                                activeCategory === cat 
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xl' 
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gift Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredGifts.length === 0 ? (
                    <div className="col-span-full exquisite-card p-20 text-center flex flex-col items-center">
                        <Search className="h-16 w-16 text-exquisite-gold/30 mb-6" />
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">No treasures found</h3>
                        <p className="text-slate-500 max-w-sm">Adjust your filters to discover other distinguished selections.</p>
                    </div>
                ) : (
                    filteredGifts.map(item => (
                        <div key={item.id} className="exquisite-card flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-800">
                                {/* Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="px-5 py-2 bg-white/30 backdrop-blur-md rounded-full text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest border border-white/40 shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                                
                                {/* Image Placeholder */}
                                <div className="h-full w-full gold-gradient opacity-10 absolute inset-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="h-full w-full flex items-center justify-center p-12 relative z-10">
                                    <Diamond className="h-24 w-24 sm:h-32 sm:w-32 text-exquisite-gold opacity-30 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 sm:h-48 sm:w-48 text-exquisite-gold opacity-[0.05] animate-pulse" />
                                </div>

                                {/* Add Button Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
                                    <button 
                                        onClick={() => handleAddGift(item)}
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all flex items-center justify-center space-x-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add to Registry</span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                                        <p className="text-lg font-serif text-exquisite-gold shrink-0">₦{parseFloat(item.price).toLocaleString()}</p>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic line-clamp-2">
                                        "{item.description}"
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-white/5">
                                    <span>Curated Collection</span>
                                    <ChevronRight className="h-4 w-4 text-exquisite-gold" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Item Modal Integration */}
            {selectedEventId && (
                <AddItemModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedGiftData(null);
                    }}
                    eventId={selectedEventId}
                    onItemAdded={() => {
                        // Refresh the events to update the registry count
                        api.get('/events').then(res => setEvents(res.data));
                    }}
                    initialData={selectedGiftData}
                />
            )}
        </div>
    );
};

export default GiftSuite;
