import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
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
import LandingPage from './components/LandingPage';
import NotFound from './components/NotFound';
import UpdateCampaign from './components/UpdateCampaign';
import UpdatePolicy from './components/UpdatePolicy';
import UpdateGroup from './components/UpdateGroup';

const AppRoutes = ({ username, handleLogout }) => (
    <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/activate" element={<ActivationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Home /></Layout></ProtectedRoute>} />
        <Route path="/emailuploader" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><EmailUploader /></Layout></ProtectedRoute>} />
        <Route path="/policies" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Policies /></Layout></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Campaigns /></Layout></ProtectedRoute>} />
        <Route path="/campaigns/create" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><CreateCampaign /></Layout></ProtectedRoute>} />
        <Route path="/campaigns/:campaignId" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><CampaignDetails /></Layout></ProtectedRoute>} />
        <Route path="/campaigns/:campaignId/update" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UpdateCampaign /></Layout></ProtectedRoute>} />
        <Route path="/policies/create" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><CreatePolicy /></Layout></ProtectedRoute>} />
        <Route path="/policies/:id" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><PolicyDetails /></Layout></ProtectedRoute>} />
        <Route path="/policies/:id/update" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UpdatePolicy /></Layout></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Groups /></Layout></ProtectedRoute>} />
        <Route path="/groups/create" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><CreateGroup /></Layout></ProtectedRoute>} />
        <Route path="/groups/:groupId" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><GroupDetails /></Layout></ProtectedRoute>} />
        <Route path="/groups/:groupId/update" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UpdateGroup /></Layout></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Documents /></Layout></ProtectedRoute>} />
        <Route path="/documents/:id" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><DocumentDetails /></Layout></ProtectedRoute>} />
        <Route path="/upload-pdf" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UploadDocument /></Layout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;