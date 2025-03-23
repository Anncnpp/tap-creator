
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                  ST
                </div>
                <span className="text-xl font-medium">Smart Tag</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                智能文档标签处理系统，结合AI技术，自动提取文档关键信息，生成标签，让文档管理和搜索变得简单高效。
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">文档处理</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#upload" className="hover:text-foreground transition-colors">文档上传</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">批量处理</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">文件格式</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">处理历史</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">技术方案</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">隐私政策</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">使用条款</a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">联系我们</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} Smart Tag. 保留所有权利。</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">隐私</a>
              <a href="#" className="hover:text-foreground transition-colors">条款</a>
              <a href="#" className="hover:text-foreground transition-colors">帮助</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
