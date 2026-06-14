import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import DashboardPage from './pages/DashboardPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />

            {/* Protected Routes — require valid JWT */}
            <Route path="/dashboard" element={
              <PrivateRoute><DashboardPage /></PrivateRoute>
            } />
            <Route path="/create-property" element={
              <PrivateRoute><CreatePropertyPage /></PrivateRoute>
            } />
            <Route path="/edit-property/:id" element={
              <PrivateRoute><EditPropertyPage /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />

            {/* 404 Fallback */}
            <Route path="*" element={
              <div className="page-centered">
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h2 className="empty-title">404 — Page Not Found</h2>
                  <p className="empty-message">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
