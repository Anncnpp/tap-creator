import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockDocuments } from '@/lib/mockData';
import { Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ResultsDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);
  
  // 添加 useEffect 从本地存储加载文档
  useEffect(() => {
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  }, []);
  
  const filteredDocuments = searchQuery
    ? documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : documents;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processed': return '处理完成';
      case 'processing': return '处理中';
      case 'error': return '处理失败';
      default: return status;
    }
  };
  
  useEffect(() => {
    // 定期检查文档处理状态
    const checkProcessingStatus = () => {
      // 这里应该是调用后端API检查状态的逻辑
      console.log("检查文档处理状态...");
    };
    
    const interval = setInterval(checkProcessingStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="results" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-medium mb-4">文档搜索</h2>
            <p className="text-muted-foreground">
              搜索并查看已处理的文档及其对应的标签和摘要信息
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索文档标题、内容或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary dark:bg-secondary/50 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </motion.div>
          
          <div className="space-y-6">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无匹配的文档</p>
              </div>
            ) : (
              filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  className="glass-card overflow-hidden"
                >
                  <div className="sm:flex">
                    {doc.thumbnail && (
                      <div className="sm:w-1/3 overflow-hidden">
                        <div 
                          className="h-48 sm:h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${doc.thumbnail})` }}
                        />
                      </div>
                    )}
                    
                    <div className={`p-6 ${doc.thumbnail ? 'sm:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-primary mr-2" />
                          <h3 className="font-medium">{doc.title}</h3>
                        </div>
                        <div className="flex items-center text-xs">
                          {getStatusIcon(doc.status)}
                          <span className="ml-1">{getStatusText(doc.status)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {doc.summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.map(tag => (
                          <div
                            key={`${doc.id}-${tag.id}`}
                            className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full text-xs"
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>上传时间: {new Date(doc.uploadedAt).toLocaleString('zh-CN')}</span>
                        <button className="text-primary hover:underline">查看详情</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
