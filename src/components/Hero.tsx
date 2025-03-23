
import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-balance font-medium tracking-tighter mb-4">
            <span className="inline-block">
              智能文档
            </span>{" "}
            <span className="inline-block text-primary">
              标签处理
            </span>{" "}
            <span className="inline-block">
              系统
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl mb-8 text-balance">
            上传文档，AI 自动提取关键信息并生成标签，让文档管理和搜索变得简单高效。
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a 
            href="#upload" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FileUp className="w-5 h-5" />
            <span>上传文档</span>
          </a>
          
          <a 
            href="#process" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all duration-300"
          >
            <span>了解工作流程</span>
          </a>
        </motion.div>
        
        <motion.div
          className="relative mx-auto max-w-4xl glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Simplified workflow visualization */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['用户层', '应用层', 'AI处理层', '数据层'].map((item, index) => (
              <motion.div
                key={item}
                className="flex flex-col items-center p-4 rounded-xl bg-secondary/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                  {index + 1}
                </div>
                <h3 className="text-sm font-medium">{item}</h3>
              </motion.div>
            ))}
          </div>
          
          {/* Connecting lines */}
          <svg className="absolute top-1/2 left-0 w-full h-6 -translate-y-1/2 hidden md:block z-0" xmlns="http://www.w3.org/2000/svg">
            <line x1="12.5%" y1="50%" x2="87.5%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" />
          </svg>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
