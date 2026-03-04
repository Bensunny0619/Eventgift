import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import PublicEvent from './pages/PublicEvent';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/registry/:id" element={<PublicEvent />} />
          <Route path="/explore" element={<div className="p-20 text-center">Explore Events Placeholder</div>} />
        </Routes>
      </main>
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2026 Homa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
