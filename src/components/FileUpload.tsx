import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, X, FileType } from 'lucide-react';
import toast from 'react-hot-toast';

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
    // 只接受文本文件
    if (file.type === 'text/plain') {
      setSelectedFile(file);
    } else {
      // 显示不支持的文件类型错误
      console.error('不支持的文件类型，请仅上传文本文件');
      toast.error('不支持的文件类型，请仅上传文本文件');
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
      
      // 处理文本文件
      if (selectedFile) {
        let fileContent = '';
        
        // 处理文本文件
        fileContent = await readTextFile(selectedFile);
        console.log("文本文件内容:", fileContent);
        
        // 根据文件内容生成标签
        const tags = generateTagsFromContent(fileContent);
        setGeneratedTags(tags);
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
  
  // 从内容生成标签
  const generateTagsFromContent = (content: string): string[] => {
    // 这里应该是实际的NLP或规则处理逻辑
    // 简单示例：基于文本内容识别关键词
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
              拖放或选择要处理的文本文件。仅支持TXT文本文件
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
                  accept=".txt" 
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
                      仅支持TXT文本文件
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
