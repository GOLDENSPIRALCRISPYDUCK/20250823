import React from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';

// 调整为两条资讯
export const newsItems = [
  {
    title: "全球眼底疾病报告：当AI成为光明的守护者，千万视力如何被拯救？",
    image: "/pictures/3.jpg", // 新增图片路径
    date: "2025-05-21",
    time: "16:09:20",
    id: "global-eye-report"
  },
  {
    title: "AI眼底疾病诊断领域应用前景“光明”",
    image: "/pictures/4.jpg", // 新增图片路径
    date: "2025-06-05",
    time: "09:30:00",
    id: "ai-ophthalmic-diagnosis"
  }
];

const Introduction = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">关于我们</h2>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 左侧文字内容 */}
          <div className="flex-1">
            <p className="text-gray-700 mb-4">
              睛准视界是一款基于人工智能技术的眼底影像智能诊断系统，致力于通过AI赋能眼健康管理。
            </p>
            <p className="text-gray-700 mb-4">
              依托深度学习算法，精准识别糖尿病视网膜病变、白内障等7种常见眼底疾病，筛查准确率达90%以上。
            </p>
            <p className="text-gray-700">
              旨在为患者、医生及医疗机构提供高效、可靠的数字化解决方案。
            </p>
          </div>

          {/* 右侧图片 */}
          <div className="md:w-1/3 mt-6 md:mt-0">
            <img
              src="/pictures/njucm.jpg"
              alt="南京中医药大学合作场景"
              className="w-full h-48 object-cover rounded-lg shadow-md border border-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">最新资讯</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              image={item.image} // 传递图片路径
              date={item.date}
              time={item.time}
              link={`/news/${item.id}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">技术合作</h2>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">南京中医药大学相关介绍</h3>
          <p className="text-gray-700 mb-4">
            南京中医药大学成立于1954年，是国家"双一流"建设高校和新中国最早的高等中医药院校之一，被誉为"高等中医教育的摇篮"。
          </p>
          <p className="text-gray-700 mb-4">
            学校以中医学、中药学为核心优势学科，拥有多个国家重点学科和ESI全球前1%学科，在中医药人才培养、科研创新及国际化发展方面成果显著。
          </p>
          <p className="text-gray-700">
            作为教育部与江苏省共建高校，学校现有三个校区，15家附属医院，致力于建设具有中国特色的世界一流中医药大学。
          </p>
          <a
            href="https://zs.njucm.edu.cn/4138/list.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            了解更多 →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Introduction;