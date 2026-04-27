import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const CalendarModal = ({ isOpen, onClose, onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
    
    if (!isOpen) return null;

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${d}`;
        onDateSelect(formattedDate);
        onClose();
    };

    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        // Padding for the first week
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`pad-${i}`} className="aspect-square"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            
            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => handleDateClick(d)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-110' 
                            : 'hover:bg-exquisite-gold/10 hover:text-exquisite-gold text-slate-600 dark:text-slate-400'}
                        ${isToday && !isSelected ? 'border-2 border-exquisite-gold/30' : ''}
                    `}
                >
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-serif text-slate-900 dark:text-white flex items-center">
                                <Sparkles className="h-4 w-4 text-exquisite-gold mr-2" />
                                Select Date
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full text-slate-400">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <ChevronLeft className="h-5 w-5 text-slate-400" />
                        </button>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} className="aspect-square flex items-center justify-center text-[10px] font-black text-slate-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex justify-end">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
