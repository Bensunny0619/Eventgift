import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gift, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <Gift className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                                Homa.
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
                        <Link to="/explore" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Explore</Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Dashboard</Link>
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                                    {user.name.charAt(0)}
                                </div>
                                <button
                                    onClick={logout}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Login</Link>
                                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2">
                    <Link to="/" className="block px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">Home</Link>
                    <Link to="/explore" className="block px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">Explore</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">Dashboard</Link>
                            <button onClick={logout} className="w-full text-left px-3 py-2 rounded-md text-red-600 font-medium hover:bg-red-50 transition-colors">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors">Login</Link>
                            <Link to="/register" className="block px-3 py-2 rounded-md bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-center">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
