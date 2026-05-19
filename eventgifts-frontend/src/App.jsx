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
import EditEvent from './pages/EditEvent';
import ProtectedRoute from './components/ProtectedRoute';
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
      const t = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 0);
      return () => clearTimeout(t);
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
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/gifts" element={<ProtectedRoute><GiftSuite /></ProtectedRoute>} />
            <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/events/:id/edit" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            <Route path="/registry/:id" element={<PublicEvent />} />
            <Route path="/explore" element={<div className="p-20 text-center font-serif text-3xl">Explore Events Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
