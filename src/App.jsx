import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

import LoginPage from './pages/LoginPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import { useAppContext } from './context/AppContext';

function DashboardLayout() {
  const { role, setRole } = useAppContext();

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header role={role} setRole={setRole} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/transactions" element={<TransactionsPage role={role} />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<DashboardLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
