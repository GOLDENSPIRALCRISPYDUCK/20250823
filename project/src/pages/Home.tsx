import React from 'react';
import { ArrowRight, Brain, Microscope, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type HomeProps = {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
};

const Home = ({ showToast }: HomeProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      showToast('请先登录或注册', 'error');
      navigate('/login');
    }
  };

  const handleFeatureClick = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      showToast('请先登录或注册', 'error');
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-7xl font-bold mb-6">睛准视界</h1>
            <p className="text-3xl mb-8">多模态视网膜疾病智能辅助诊断系统</p>
            <Link
              to="/preprocessing"
              onClick={handleStartClick}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              开始使用 <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">系统特点</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => handleFeatureClick(e, '/preprocessing')}
            >
              <Link to="/preprocessing" className="block">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Microscope className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">智能预处理</h3>
                <p className="text-gray-600">自动进行图像增强和优化，提供清晰的诊断基础</p>
              </Link>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => handleFeatureClick(e, '/single-analysis')}
            >
              <Link to="/single-analysis" className="block">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Brain className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI辅助诊断</h3>
                <p className="text-gray-600">运用深度学习算法，快速识别潜在的眼科疾病</p>
              </Link>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => handleFeatureClick(e, '/batch-analysis')}
            >
              <Link to="/batch-analysis" className="block">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Activity className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">批量处理</h3>
                <p className="text-gray-600">支持多张图片同时分析，提高诊断效率</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;