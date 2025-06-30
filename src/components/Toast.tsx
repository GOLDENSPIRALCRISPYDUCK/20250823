// src/components/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
};

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  }[type];

  const icon = {
    success: <CheckCircle className="h-5 w-5 mr-2" />,
    error: <AlertCircle className="h-5 w-5 mr-2" />,
    info: null,
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 p-4 rounded shadow-md flex items-center ${bgColor}`}>
      {icon}
      <div>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Toast;