import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ActivationPage from './components/ActivationPage';
import axios from 'axios';
import EmailUploader from './components/EmailUploader';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  config.headers.Authorization = token ? `Token ${token}` : '';
  return config;
});

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
      // User is not logged in, redirect to the login page
      return <Navigate to="/login" replace />;
  }

  // User is logged in, allow access to the route
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/activate" element={<ActivationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/emailuploader' element={
          <ProtectedRoute>
            <EmailUploader />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
