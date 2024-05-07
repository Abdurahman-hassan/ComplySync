import './App.css';
import './styles/UploadDocument.css';
import { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import axios from 'axios';

// Create a context for the user's authentication state
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {

  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const headers = useMemo(() => ({
    'Authorization': `Token ${authToken}`
  }), [authToken]);

  // This function is called upon user login to update the authToken and fetch the username
  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  // This function is called upon user logout to clear authToken and username
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUsername(''); // Reset username to empty string
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (!authToken) return; // Exit early if there is no auth token

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', { headers });
        setUsername(response.data.email);
        if (response.data.is_superuser === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthToken(null);
        localStorage.removeItem('authToken');
      }
    };

    fetchUsername();
    console.log('Fetching username...');
  }, [authToken, headers]);

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    config.headers.Authorization = token ? `Token ${token}` : '';
    return config;
  });

    return () => {
      axios.interceptors.request.eject(axiosInterceptor);
    };
  }, []);

  const authContextValue = useMemo(() => ({
    authToken, setAuthToken, handleLogin, isAdmin, handleLogout
  }), [authToken, isAdmin]);


  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <AppRoutes username={username} handleLogout={handleLogout} />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
