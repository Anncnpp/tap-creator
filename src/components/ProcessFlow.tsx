
import React from 'react';
import { motion } from 'framer-motion';
import { processingSteps } from '@/lib/mockData';
import { ArrowRight } from 'lucide-react';

const ProcessFlow = () => {
  return (
    <section id="process" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            处理流程
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            从文档上传到生成标签，我们的系统通过多层处理确保高质量的文档分析
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Desktop view */}
          <div className="hidden md:block">
            {/* Horizontal line connecting all steps */}
            <div className="absolute top-32 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary/20 to-secondary" />
            
            <div className="grid grid-cols-4 gap-6 relative">
              {processingSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative z-10 mb-8">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800 p-2">
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                        {index + 1}
                      </div>
                    </div>
                    {index < processingSteps.length - 1 && (
                      <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 text-primary">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4 max-w-xs">{step.description}</p>
                  
                  <div className="glass-card w-full p-4">
                    <ul className="space-y-2 text-sm">
                      {step.items.map((item, itemIndex) => (
                        <motion.li 
                          key={item} 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 + (itemIndex * 0.1) }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden space-y-8">
            {processingSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="glass-card p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-medium">{step.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                
                <ul className="space-y-2 text-sm">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
