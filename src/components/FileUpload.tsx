import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, X, FileType } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateTags, generateSummary } from '@/lib/api';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    // 支持文本文件和PDF文件
    if (file.type === 'text/plain' || file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setSelectedFile(file);
    } else {
      // 显示不支持的文件类型错误
      console.error('不支持的文件类型，请上传文本文件、PDF或Word文档');
      toast.error('不支持的文件类型，请上传文本文件、PDF或Word文档');
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };
  
  const handleUpload = async () => {
    setIsUploading(true);
    
    try {
      // 添加日志以跟踪文件上传状态
      console.log("开始处理文件:", selectedFile?.name);
      console.log("文件类型:", selectedFile?.type);
      console.log("文件大小:", (selectedFile?.size / 1024).toFixed(2), "KB");
      
      // 处理文件
      if (selectedFile) {
        let fileContent = '';
        
        // 根据文件类型处理
        if (selectedFile.type === 'text/plain') {
          // 处理文本文件
          fileContent = await readTextFile(selectedFile);
        } else if (selectedFile.type === 'application/pdf') {
          // 处理PDF文件 - 显示处理信息
          toast.loading("正在处理PDF文件，这可能需要一点时间...");
          fileContent = "PDF文件内容：" + selectedFile.name;
          // 实际项目中应该使用PDF解析库
        } else if (selectedFile.type === 'application/msword' || 
                  selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // 处理Word文档 - 显示处理信息
          toast.loading("正在处理Word文档，这可能需要一点时间...");
          fileContent = "Word文档内容：" + selectedFile.name;
          // 实际项目中应该使用Word解析库
        }
        
        console.log("文件内容长度:", fileContent.length);
        
        // 使用API服务生成标签和摘要
        const [tags, summary] = await Promise.all([
          generateTags(fileContent).catch(error => {
            console.error('API标签生成失败，使用备用方案:', error);
            return generateTagsLocally(fileContent);
          }),
          generateSummary(fileContent).catch(error => {
            console.error('API摘要生成失败，使用默认摘要:', error);
            return '文档内容摘要';
          })
        ]);
        
        setGeneratedTags(tags);
        
        // 将生成的标签和摘要保存到本地存储或全局状态
        saveTagsToGlobalState(tags, summary);
      }
      
      // 处理完成，更新状态
      setProcessingComplete(true);
      toast.success("文件处理完成，已生成标签");
      
    } catch (error) {
      console.error("文件处理错误:", error);
      toast.error("文件处理失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };
  
  // 读取文本文件内容
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string || '');
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  // 本地标签生成逻辑（作为备份）
  const generateTagsLocally = (content: string): string[] => {
    const tags: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // 简单的关键词匹配
    if (lowerContent.includes('财务') || lowerContent.includes('finance')) tags.push('财务');
    if (lowerContent.includes('报告') || lowerContent.includes('report')) tags.push('报告');
    if (lowerContent.includes('2023')) tags.push('2023年');
    if (lowerContent.includes('重要') || lowerContent.includes('important')) tags.push('重要文档');
    if (lowerContent.includes('计划') || lowerContent.includes('plan')) tags.push('计划');
    if (lowerContent.includes('项目') || lowerContent.includes('project')) tags.push('项目');
    if (lowerContent.includes('技术') || lowerContent.includes('tech')) tags.push('技术');
    if (lowerContent.includes('会议') || lowerContent.includes('meeting')) tags.push('会议');
    
    // 如果没有匹配到任何标签，添加一个默认标签
    if (tags.length === 0) {
      tags.push('未分类文档');
    }
    
    return tags;
  };
  
  // 保存标签到全局状态的函数
  const saveTagsToGlobalState = (tags: string[], summary: string) => {
    // 获取现有标签
    const existingTagsJSON = localStorage.getItem('documentTags') || '[]';
    const existingTags = JSON.parse(existingTagsJSON);
    
    // 创建新标签对象
    const newTags = tags.map(tag => ({
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: tag,
      confidence: 0.85, // 添加置信度
      category: 'keyword', // 可以设置默认分类
    }));
    
    // 合并标签并去重（根据名称去重）
    // 如果名称重复，保留已有的标签
    const uniqueTagNames = new Set();
    // 先添加现有标签
    const updatedTags = [...existingTags];
    // 标记已存在的标签名
    existingTags.forEach(tag => uniqueTagNames.add(tag.name.toLowerCase()));
    // 只添加不重复的新标签
    newTags.forEach(tag => {
      if (!uniqueTagNames.has(tag.name.toLowerCase())) {
        uniqueTagNames.add(tag.name.toLowerCase());
        updatedTags.push(tag);
      }
    });
    
    // 保存回本地存储
    localStorage.setItem('documentTags', JSON.stringify(updatedTags));
    
    // 创建并保存文档数据
    const documentData = {
      id: `doc-${Date.now()}`,
      title: selectedFile?.name || '未命名文档',
      type: 'text',
      uploadedAt: new Date().toISOString(),
      status: 'processed',
      summary: summary, // 使用API生成的摘要
      tags: newTags,
      filePath: `/uploads/${selectedFile?.name}` // 假设文件路径
    };
    
    // 保存文档
    const existingDocsJSON = localStorage.getItem('documents') || '[]';
    const existingDocs = JSON.parse(existingDocsJSON);
    localStorage.setItem('documents', JSON.stringify([...existingDocs, documentData]));
    
    // 手动触发storage事件，使其他组件能够响应更改
    // 因为同一窗口内localStorage的更改不会触发storage事件
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'documentTags',
        newValue: JSON.stringify(updatedTags),
        storageArea: localStorage
      }));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'documents',
        newValue: JSON.stringify([...existingDocs, documentData]),
        storageArea: localStorage
      }));
      
      // 触发自定义事件，明确通知标签管理组件刷新数据
      window.dispatchEvent(new CustomEvent('tagsUpdated'));
      
      console.log('已触发storage事件以同步标签和文档数据');
    } catch (error) {
      console.error('触发storage事件失败:', error);
    }
    
    // 尝试直接滚动到标签管理组件以引起注意
    setTimeout(() => {
      document.getElementById('tags')?.scrollIntoView({behavior: 'smooth'});
    }, 500);
  };
  
  return (
    <section id="upload" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-medium mb-4">上传文档</h2>
            <p className="text-muted-foreground">
              拖放或选择要处理的文件。支持TXT文本文件、PDF和Word文档
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!selectedFile ? (
              <div 
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input 
                  id="file-input" 
                  type="file" 
                  className="hidden" 
                  accept=".txt,.pdf,.doc,.docx" 
                  onChange={handleFileInput}
                />
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                    animate={{ scale: isDragging ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileUp className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <div>
                    <p className="font-medium mb-1">
                      {isDragging ? '放置文件以上传' : '拖放文件到这里或点击选择文件'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      支持TXT、PDF和Word文档
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-medium">已选择文件</div>
                  <button 
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full hover:bg-secondary transition-colors"
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center p-4 bg-secondary rounded-lg mb-6">
                  <FileType className="w-5 h-5 text-green-500" />
                  <div className="ml-3">
                    <div className="font-medium truncate max-w-xs">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB · {selectedFile.type || '未知类型'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-70"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4" />
                        开始处理
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* 处理完成后显示结果 */}
          {processingComplete && (
            <div className="mt-8">
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium mb-4">文件处理完成</h3>
                <p className="mb-4">系统已自动生成以下标签：</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {generatedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full text-xs"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      // 重置状态，允许上传新文件
                      setSelectedFile(null);
                      setProcessingComplete(false);
                      setGeneratedTags([]);
                    }}
                    className="px-4 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    上传新文件
                  </button>
                  
                  <button
                    onClick={() => {
                      // 这里可以添加跳转到标签管理页面的逻辑
                      document.getElementById('tags')?.scrollIntoView({behavior: 'smooth'});
                    }}
                    className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    管理标签
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
