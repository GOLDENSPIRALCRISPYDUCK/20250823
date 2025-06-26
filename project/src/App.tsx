import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Preprocessing from './pages/Preprocessing';
import SingleAnalysis from './pages/SingleAnalysis';
import BatchAnalysis from './pages/BatchAnalysis';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Toast from './components/Toast';
import ReportManagement from "./pages/ReportManagement";
import StatisticalAnalysis from './pages/StatisticalAnalysis';
import Introduction from "./pages/Introduction";
import NewsDetail from './pages/NewsDetail';
import FeatureImportanceAnalysis from "./pages/FeatureImportanceAnalysis";

const PlaceholderPage = ({ pageName }: { pageName: string }) => (
  <div className="container mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-center mb-6">{pageName}</h1>
    <p className="text-center text-gray-600">This page is under construction.</p>
  </div>
);

const App = () => {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type?: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      showToast('请先登录或注册', 'error');
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar showToast={showToast} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/preprocessing" element={<Preprocessing showToast={showToast} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About showToast={showToast} />} />

              {/* 需要登录才能访问的路由 */}
              <Route path="/single-analysis" element={
                <PrivateRoute>
                  <SingleAnalysis />
                </PrivateRoute>
              } />
              <Route path="/batch-analysis" element={
                <PrivateRoute>
                  <BatchAnalysis />
                </PrivateRoute>
              } />
              <Route path="/ReportManagement" element={
                <PrivateRoute>
                  <ReportManagement />
                </PrivateRoute>
              } />
              <Route path="/StatisticalAnalysis" element={
                <PrivateRoute>
                  <StatisticalAnalysis />
                </PrivateRoute>
              } />
              <Route path="/feature-importance" element={
                <PrivateRoute>
                  <FeatureImportanceAnalysis />
                </PrivateRoute>
              } />
              <Route path="/introduction" element={
                <PrivateRoute>
                  <Introduction />
                </PrivateRoute>
              } />
              {/* 添加新闻详情路由，需要登录才能访问 */}
              <Route path="/news/:id" element={
                <PrivateRoute>
                  <NewsDetail />
                </PrivateRoute>
              } />

              <Route path="/forgot-password" element={<PlaceholderPage pageName="Forgot Password" />} />
              <Route path="*" element={<PlaceholderPage pageName="404 - Page Not Found" />} />
            </Routes>
          </main>
          <Footer />
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;