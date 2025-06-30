import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">关于我们</h3>
              <p className="text-gray-400 indent-8">
                我们是来自南京中医药大学的跨学科团队，依托学校深厚的中医药学术底蕴和现代信息技术优势，致力于中医药信息化与智能应用研究。
              </p>
            </div>
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">联系我们</h3>
                <ul className="space-y-2 text-gray-400">
                    <li>地址：江苏省南京市栖霞区仙林大道138号</li>
                    <li>邮编：210023</li>
                </ul>
            </div>
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">官方网站</h3>
              <a
                href="https://www.njucm.edu.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors block mb-1" // 强制换行并添加底部边距
              >
                南京中医药大学官网
              </a>
              <a
                href="https://xxjs.njucm.edu.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors block mb-1"
              >
                人工智能与信息技术学院官网
              </a>
              <a
                href="https://jmzx.njucm.edu.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors block"
              >
                卫生经济管理学院官网
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>© 2025 南京中医药大学 Yǔ众不瞳. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;