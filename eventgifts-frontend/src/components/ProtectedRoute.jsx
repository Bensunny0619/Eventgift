import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-exquisite-cream dark:bg-exquisite-midnight">
                <Loader2 className="h-10 w-10 text-exquisite-gold animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login if user is not authenticated, saving the intended location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
