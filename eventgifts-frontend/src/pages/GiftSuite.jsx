import { useState } from 'react';
import {
    Gift,
    Search,
    Filter,
    Diamond,
    Sparkles,
    Plus,
    ChevronRight,
    Loader2,
    Check
} from 'lucide-react';

const GiftSuite = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Collections');
    const [addedItems, setAddedItems] = useState(new Set());

    const categories = [
        'All Collections',
        'Royal Heritage',
        'Modern Luxe',
        'Technological Marvels',
        'Exquisite Experiences'
    ];

    const giftItems = [
        {
            id: 1,
            name: 'Royal Heritage Chronograph',
            price: '$18,500',
            category: 'Royal Heritage',
            description: 'A masterpiece of Swiss engineering, featuring 18k rose gold.',
            image: null
        },
        {
            id: 2,
            name: 'Midnight Velvet Suite',
            price: '$4,200',
            category: 'Modern Luxe',
            description: 'Hand-woven Italian silk bedding set in deep obsidian.',
            image: null
        },
        {
            id: 3,
            name: 'Aurelia Crystal Decanter',
            price: '$2,850',
            category: 'Modern Luxe',
            description: 'Hand-blown lead crystal with 24k gold leaf inlay.',
            image: null
        },
        {
            id: 4,
            name: 'Neural Sound Horizon',
            price: '$3,100',
            category: 'Technological Marvels',
            description: 'Adaptive audio sculpture with ceramic acoustics.',
            image: null
        },
        {
            id: 5,
            name: 'Safari Estate Weekend',
            price: '$25,000',
            category: 'Exquisite Experiences',
            description: 'Private 3-day retreat in a curated conservatory.',
            image: null
        },
        {
            id: 6,
            name: 'Celestial Compass',
            price: '$1,200',
            category: 'Royal Heritage',
            description: 'Antiqued brass navigation tool with diamond-encrusted dial.',
            image: null
        }
    ];

    const filteredGifts = giftItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All Collections' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleAddItem = (id) => {
        const newSet = new Set(addedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setAddedItems(newSet);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white italic">The Gift Suite</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl">
                        Curate your event's legacy with our hand-picked selection of distinguished gifts.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-exquisite-gold">Suite Capacity</p>
                        <p className="text-xl font-serif text-slate-900 dark:text-white">{addedItems.size} / 25 Items</p>
                    </div>
                    <div className="h-16 w-16 gold-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-exquisite-gold/20">
                        <Gift className="h-8 w-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-exquisite-gold transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search the archive..."
                        className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-exquisite-gold/20 transition-all font-medium shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex overflow-x-auto pb-2 sm:pb-0 scrollbar-hide space-x-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredGifts.length === 0 ? (
                    <div className="col-span-full exquisite-card p-20 text-center flex flex-col items-center">
                        <Search className="h-16 w-16 text-exquisite-gold/30 mb-6" />
                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">No treasures found</h3>
                        <p className="text-slate-500 max-w-sm">Adjust your filters to discover other distinguished selections.</p>
                    </div>
                ) : (
                    filteredGifts.map(item => (
                        <div key={item.id} className="exquisite-card flex flex-col group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                {/* Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/30">
                                        {item.category}
                                    </span>
                                </div>
                                
                                {/* Image Placeholder */}
                                <div className="h-full w-full gold-gradient opacity-10 absolute inset-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="h-full w-full flex items-center justify-center p-12 relative z-10">
                                    <Diamond className="h-32 w-32 text-exquisite-gold opacity-20 transform -rotate-12 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 text-exquisite-gold opacity-[0.05] animate-pulse" />
                                </div>

                                {/* Add Button Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
                                    <button 
                                        onClick={() => toggleAddItem(item.id)}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all flex items-center justify-center space-x-2 ${
                                            addedItems.has(item.id)
                                            ? 'bg-exquisite-gold text-white'
                                            : 'bg-white text-slate-900 hover:scale-105'
                                        }`}
                                    >
                                        {addedItems.has(item.id) ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                <span>In Your Suite</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                <span>Add to Suite</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-4">
                                <div className="flex items-end justify-between">
                                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white leading-tight pr-4">{item.name}</h3>
                                    <p className="text-xl font-serif text-exquisite-gold shrink-0">{item.price}</p>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic line-clamp-2">
                                    "{item.description}"
                                </p>
                                <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-white/5">
                                    <span>Limited Collection</span>
                                    <ChevronRight className="h-4 w-4 text-exquisite-gold" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GiftSuite;
