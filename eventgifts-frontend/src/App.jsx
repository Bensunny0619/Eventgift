import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import PublicEvent from './pages/PublicEvent';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();

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
    <div className="min-h-screen bg-exquisite-cream dark:bg-exquisite-midnight transition-colors duration-300">
      {isDashboardRoute && <Sidebar />}

      <div className={`transition-all duration-300 ${isDashboardRoute ? 'lg:pl-72' : ''}`}>
        <Navbar />
        <main className={`pt-24 ${isDashboardRoute ? 'px-10 pb-10' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/registry/:id" element={<PublicEvent />} />
            <Route path="/explore" element={<div className="p-20 text-center font-serif text-3xl">Explore Events Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
