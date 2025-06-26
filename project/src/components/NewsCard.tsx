// src/components/NewsCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  title: string;
  image?: string; // 可选图片路径
  date: string;
  time: string;
  link: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, image, date, time, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        {image && ( // 如果有图片路径则显示图片
          <div className="mb-4">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{date} {time}</span>
          <Link
            to={link}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;