// src/components/Navbar.tsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false); // 添加统计分析下拉菜单状态
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statisticsDropdownRef = useRef<HTMLDivElement>(null); // 添加统计分析下拉菜单引用
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDiagnosisOpen(false);
    }
    if (statisticsDropdownRef.current && !statisticsDropdownRef.current.contains(event.target as Node)) {
      setIsStatisticsOpen(false);
    }
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
      setIsProfileOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // 处理需要登录的导航项点击
  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('请先登录或注册');
      navigate('/login');
    }
  };

  // 添加按钮样式的基础类 - 更微妙的阴影效果
  const navItemStyle = "px-3 py-1.5 rounded-md transition-all text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 border-b-2 border-transparent hover:border-blue-500 shadow-sm";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">睛准视界</span>
            </Link>
          </div>

          <div className="flex items-center justify-end flex-grow ml-8">
            <div className="flex items-center space-x-3">
              <Link to="/" className={navItemStyle}>首页</Link>
              <Link to="/preprocessing" className={navItemStyle}>图像质控</Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      handleProtectedClick(e, '');
                      return;
                    }
                    setIsDiagnosisOpen(!isDiagnosisOpen);
                  }}
                  className={navItemStyle}
                >
                  智能诊断
                </button>

                {isDiagnosisOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link
                      to="/single-analysis"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          handleProtectedClick(e, '/single-analysis');
                          return;
                        }
                        setIsDiagnosisOpen(false);
                      }}
                    >
                      单片分析
                    </Link>
                    <Link
                      to="/batch-analysis"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          handleProtectedClick(e, '/batch-analysis');
                          return;
                        }
                        setIsDiagnosisOpen(false);
                      }}
                    >
                      批量分析
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/ReportManagement"
                className={navItemStyle}
                onClick={(e) => handleProtectedClick(e, '/report-management')}
              >
                报告管理
              </Link>

              {/* 修改统计分析为下拉菜单 */}
              <div className="relative" ref={statisticsDropdownRef}>
                <button
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      handleProtectedClick(e, '');
                      return;
                    }
                    setIsStatisticsOpen(!isStatisticsOpen);
                  }}
                  className={navItemStyle}
                >
                  统计分析
                </button>

                {isStatisticsOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link
                      to="/StatisticalAnalysis"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          handleProtectedClick(e, '/StatisticalAnalysis');
                          return;
                        }
                        setIsStatisticsOpen(false);
                      }}
                    >
                      数据统计
                    </Link>
                    <Link
                      to="/feature-importance"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          handleProtectedClick(e, '/feature-importance');
                          return;
                        }
                        setIsStatisticsOpen(false);
                      }}
                    >
                      特征分析
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/about" className={navItemStyle}>AI助手</Link>
              <Link
                to="/Introduction"
                className={navItemStyle}
                onClick={(e) => handleProtectedClick(e, '/introduction')}
              >
                明眸问源
              </Link>
            </div>
          </div>

          <div className="flex items-center ml-6 space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md hover:bg-blue-50/60 transition-colors"
                >
                  <img
                    src="/pictures/toux.png"
                    alt="用户头像"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user?.email}
                      <div className="text-xs text-gray-400">已登录</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;