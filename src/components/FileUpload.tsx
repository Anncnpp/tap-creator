import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, X, FilePlus, FileText, Image, FileType } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
    // Only accept PDF, images, or text files
    if (
      file.type === 'application/pdf' || 
      file.type.startsWith('image/') || 
      file.type === 'text/plain'
    ) {
      setSelectedFile(file);
    } else {
      // Show an error for unsupported file types
      console.error('不支持的文件类型，请上传 PDF、图片或文本文件');
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
      
      // 模拟文件上传和处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 添加处理完成后的回调，确保标签生成完成
      console.log("文件处理完成，准备生成标签");
      
      // 提示用户查看处理结果
      toast({
        title: "处理完成",
        description: "文件已上传并处理成功，请查看生成的标签和摘要。",
      });
      
      // 处理完成后自动跳转到结果区域
      setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (error) {
      console.error("文件处理失败:", error);
      toast({
        title: "处理失败",
        description: "文件处理过程中出现错误，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };
  
  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (file.type === 'text/plain') return <FileType className="w-5 h-5 text-green-500" />;
    return <FilePlus className="w-5 h-5 text-gray-500" />;
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
              拖放或选择要处理的文档。支持 PDF、图片和文本文件
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
                  accept=".pdf,image/*,.txt" 
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
                      支持 PDF、图片或文本文件
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
                  {getFileIcon(selectedFile)}
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
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
