import { Navigate } from 'react-router-dom';
import { useAuth } from './App';

const ProtectedRoute = ({ children }) => {
    const { authToken } = useAuth();

    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;