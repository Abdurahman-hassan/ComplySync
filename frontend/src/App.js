import './App.css';
import { useState, useEffect, useMemo, createContext, useContext } from'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ActivationPage from './components/ActivationPage';
import EmailUploader from './components/EmailUploader';
import Policies from './components/Policies';
import CreateCampaign from './components/CreateCampaign';

// Create a context for the user's authentication state
export const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  config.headers.Authorization = token ? `Token ${token}` : '';
  return config;
});

const ProtectedRoute = ({ children }) => {
  const { authToken } = useAuth();

  if (!authToken) {
    // User is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, allow access to the route
  return children;
};

function App() {

  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const headers = useMemo(() => ({
    'Authorization': `Token ${authToken}`
  }), [authToken]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!authToken) return; // Exit early if there is no auth token

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', { headers });
        setUsername(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, e.g., log out the user or show an error message
        setAuthToken(null);
        localStorage.removeItem('authToken');
      }
    };

    fetchUsername();
  }, [authToken, headers]);

  // Provide the authentication state via context
  const authContextValue = { authToken, setAuthToken };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
      <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/activate" element={<ActivationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path='/home' element={
            <ProtectedRoute>
              <Layout username={username}>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/emailuploader' element={
            <ProtectedRoute>
              <Layout username={username}>
                <EmailUploader />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/policies' element={
            <ProtectedRoute>
              <Layout username={username}>
                <Policies />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/create-campaign' element={
            <ProtectedRoute>
              <Layout username={username}>
                <CreateCampaign />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
