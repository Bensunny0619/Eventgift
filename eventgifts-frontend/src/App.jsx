import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Events from './pages/Events';
import GiftSuite from './pages/GiftSuite';
import Guests from './pages/Guests';
import PublicEvent from './pages/PublicEvent';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on small screens only when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Dashboard routes should show the sidebar
  const isDashboardRoute = user && (
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/events') ||
    location.pathname.startsWith('/gifts') ||
    location.pathname.startsWith('/guests') ||
    location.pathname.startsWith('/analytics') ||
    location.pathname.startsWith('/settings')
  );

  return (
    <div className="min-h-screen bg-exquisite-cream dark:bg-exquisite-midnight transition-colors duration-300 overflow-x-hidden">
      {user && isDashboardRoute && (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}

      <div className={`transition-all duration-300 ${isDashboardRoute && isSidebarOpen ? 'lg:pl-72' : ''}`}>
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isDashboard={isDashboardRoute} 
          isSidebarOpen={isSidebarOpen} 
        />
        <main className={`pt-24 ${isDashboardRoute ? 'px-4 sm:px-10 pb-10' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gifts" element={<GiftSuite />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/registry/:id" element={<PublicEvent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/explore" element={<div className="p-20 text-center font-serif text-3xl">Explore Events Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
