import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BrowseServices from './pages/BrowseServices';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import BlockchainStats from './pages/BlockchainStats';
import Reviews from './pages/Reviews';
import Disputes from './pages/Disputes';
import DisputeDetail from './pages/DisputeDetail';
import LocalExplorer from './pages/LocalExplorer';
import NetworkAlert from './components/NetworkAlert';
import BlockchainDashboard from './pages/BlockchainDashboard';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <NetworkAlert />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <PrivateRoute>
                  <BrowseServices />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/requests" 
              element={
                <PrivateRoute>
                  <Requests />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/sessions" 
              element={
                <PrivateRoute>
                  <Sessions />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/sessions/:id" 
              element={
                <PrivateRoute>
                  <SessionDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/blockchain-stats" 
              element={
                <PrivateRoute>
                  <BlockchainStats />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reviews" 
              element={
                <PrivateRoute>
                  <Reviews />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/disputes" 
              element={
                <PrivateRoute>
                  <Disputes />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/disputes/:id" 
              element={
                <PrivateRoute>
                  <DisputeDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/local-explorer" 
              element={
                <PrivateRoute>
                  <LocalExplorer />
                </PrivateRoute>
              } 
            />
            <Route path="/blockchain-dashboard" element={
              <PrivateRoute>
                <BlockchainDashboard />
              </PrivateRoute>
            } />
            {/* Catch-all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;