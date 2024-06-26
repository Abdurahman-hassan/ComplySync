import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import ActivationPage from './components/ActivationPage';
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
import Users from './components/Users';
import AddUsers from './components/AddUsers';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import ResetAdminPassword from './components/ResetAdminPassword';
import UpdateGroupUsers from './components/UpdateGroupUsers';
import DeleteGroupUsers from './components/DeleteGroupUsers';

const AppRoutes = ({ username, handleLogout }) => (
    <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/activate" element={<ActivationPage />} />
        <Route path="/auth/reset-password/" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile/reset-password" element={<ProtectedRoute><ResetAdminPassword /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Profile /></Layout></ProtectedRoute>} />
        <Route path="/users/add" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><AddUsers /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Users /></Layout></ProtectedRoute>} />
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
        <Route path="/groups/:groupId/update/update-users" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UpdateGroupUsers /></Layout></ProtectedRoute>} />
        <Route path="/groups/:groupId/update/delete-users" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><DeleteGroupUsers /></Layout></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><Documents /></Layout></ProtectedRoute>} />
        <Route path="/documents/:id" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><DocumentDetails /></Layout></ProtectedRoute>} />
        <Route path="/upload-pdf" element={<ProtectedRoute><Layout username={username} handleLogout={handleLogout}><UploadDocument /></Layout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;