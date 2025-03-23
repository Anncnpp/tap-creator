import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockDocuments } from '@/lib/mockData';
import { Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ResultsDisplay = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);
  
  // 添加 useEffect 从本地存储加载文档
  useEffect(() => {
    const loadDocumentsFromStorage = () => {
      const storedDocs = localStorage.getItem('documents');
      if (storedDocs) {
        setDocuments(JSON.parse(storedDocs));
      }
    };
    
    // 初始加载
    loadDocumentsFromStorage();
    
    // 添加存储事件监听器，当其他组件更新localStorage时刷新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'documents') {
        loadDocumentsFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // 添加查看详情处理函数
  const handleViewDetails = (doc: typeof documents[0]) => {
    // 如果有原始文件路径，尝试打开文件
    if (doc.filePath) {
      try {
        // 获取当前网站的基础URL
        const baseUrl = window.location.origin;
        // 拼接完整的文件URL路径
        const fullPath = `${baseUrl}${doc.filePath}`;
        
        console.log("尝试打开文件:", fullPath);
        
        // 创建一个链接元素来模拟文件下载或打开
        const link = document.createElement('a');
        link.href = fullPath;
        
        // 对于可在浏览器中预览的文件类型，设置为在新窗口打开
        if (doc.type === 'pdf' || doc.type === 'image') {
          link.target = '_blank';
        } else {
          // 否则设置为下载
          link.setAttribute('download', doc.title);
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("打开文件时出错:", error);
        alert(`打开文件时出错: ${error.message || '未知错误'}`);
      }
    } else {
      // 如果没有文件路径，显示提示
      alert('抱歉，无法找到原始文件路径');
    }
  };
  
  // 添加删除文档处理函数
  const handleDeleteDocument = (docId: string) => {
    try {
      // 找到要删除的文档
      const docToDelete = documents.find(doc => doc.id === docId);
      
      // 过滤掉要删除的文档
      const updatedDocuments = documents.filter(doc => doc.id !== docId);
      
      // 更新状态
      setDocuments(updatedDocuments);
      
      // 更新本地存储
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      // 如果找到了要删除的文档，并且它有标签，则更新标签存储
      if (docToDelete && docToDelete.tags && docToDelete.tags.length > 0) {
        const tagIds = docToDelete.tags.map(tag => tag.id);
        
        // 获取当前所有标签
        const storedTagsJSON = localStorage.getItem('documentTags') || '[]';
        const storedTags = JSON.parse(storedTagsJSON);
        
        // 检查哪些标签只在此文档中使用
        // 首先收集所有其他文档中使用的标签ID
        const tagsInOtherDocs = new Set<string>();
        updatedDocuments.forEach(doc => {
          doc.tags.forEach(tag => {
            tagsInOtherDocs.add(tag.id);
          });
        });
        
        // 过滤掉仅在已删除文档中使用的标签
        const updatedTags = storedTags.filter((tag: any) => tagsInOtherDocs.has(tag.id));
        
        // 更新标签存储
        localStorage.setItem('documentTags', JSON.stringify(updatedTags));
      }
      
      console.log(`文档 ${docId} 已删除`);
    } catch (error) {
      console.error("删除文档时出错:", error);
      alert(`删除文档时出错: ${error.message || '未知错误'}`);
    }
  };
  
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
                        <div className="flex gap-3">
                          <button 
                            className="text-primary hover:underline"
                            onClick={() => handleViewDetails(doc)}
                          >
                            查看详情
                          </button>
                          <button 
                            className="text-red-500 hover:underline"
                            onClick={() => {
                              if (window.confirm(`确定要删除文档 "${doc.title}" 吗？`)) {
                                handleDeleteDocument(doc.id);
                              }
                            }}
                          >
                            删除
                          </button>
                        </div>
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
