import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import EventRegisterPage from './pages/eventRegisterPage';
import MembershipNetworkPage from './pages/MembershipNetworkPage';
import MembershipBenefitsPage from './pages/MembershipBenefitsPage';
import WorkshopsPage from './pages/WorkshopsPage';
import SeminarsPage from './pages/SeminarsPage';
import PreviousConferencesPage from './pages/PreviousConferencesPage';
import ConferencePlaceholderPage from './pages/ConferencePlaceholderPage';
import AuthPage from './pages/AuthPage';
import PortalPage from './pages/PortalPage';
import AdminPortalPage from './pages/AdminPortalPage';
import ReviewerPortalPage from './pages/ReviewerPortalPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/join" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
      <Route path="/register" element={<ProtectedRoute><EventRegisterPage /></ProtectedRoute>} />
      <Route path="/eventRegisterPage" element={<EventRegisterPage />} />
      <Route path="/portal" element={<ProtectedRoute><PortalPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute admin><AdminPortalPage /></ProtectedRoute>} />
      <Route path="/reviewer" element={<ProtectedRoute reviewer><ReviewerPortalPage /></ProtectedRoute>} />
      <Route path="/membership/network" element={<MembershipNetworkPage />} />
      <Route path="/membership/benefits" element={<MembershipBenefitsPage />} />
      <Route path="/training/workshops" element={<WorkshopsPage />} />
      <Route path="/training/seminars" element={<SeminarsPage />} />
      <Route path="/conferences/previous" element={<PreviousConferencesPage />} />
      <Route path="/conferences/upcoming" element={<ConferencePlaceholderPage kind="upcoming" />} />
      <Route path="/conferences/proceedings" element={<ConferencePlaceholderPage kind="proceedings" />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
