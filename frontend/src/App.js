import './App.css';
import './styles/UploadDocument.css';
import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ActivationPage from './components/ActivationPage';
import EmailUploader from './components/EmailUploader';
import Policies from './components/Policies';
import Campaigns from './components/Campaigns';
import CampaignDetails from './components/CampaignDetails';
import CreateCampaign from './components/CreateCampaign';
import PolicyDetails from './components/PolicyDetails';
import CreatePolicy from './components/CreatePolicy';
import Groups from './components/Groups';
import CreateGroup from './components/CreateGroup';
import GroupDetails from './components/GroupDetails';
import Documents from './components/Documents';
import DocumentDetails from './components/DocumentDetails';
import UploadDocument from './components/UploadDocument';

// Create a context for the user's authentication state
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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


  const authContextValue = { authToken, setAuthToken, handleLogin, isAdmin, handleLogout };

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
              <Layout username={username} handleLogout={handleLogout}>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/emailuploader' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <EmailUploader />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/policies' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <Policies />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/policies/:id' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <PolicyDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/create-policy' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <CreatePolicy />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/campaigns' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <Campaigns />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/campaigns/:campaignId' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <CampaignDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/create-campaign' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <CreateCampaign />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/groups' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <Groups />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/groups/:groupId' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <GroupDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/create-group' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <CreateGroup />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/documents' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <Documents />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/documents/:id' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <DocumentDetails />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path='/upload-pdf' element={
            <ProtectedRoute>
              <Layout username={username} handleLogout={handleLogout}>
                <UploadDocument />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
