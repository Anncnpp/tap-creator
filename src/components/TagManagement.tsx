import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { mockTags } from '@/lib/mockData';
import { Tag, Plus, X, Edit, Check } from 'lucide-react';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editedTagName, setEditedTagName] = useState('');
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'theme', name: '主题' },
    { id: 'keyword', name: '关键词' },
    { id: 'entity', name: '实体' },
  ];
  
  const filteredTags = selectedCategory && selectedCategory !== 'all'
    ? tags.filter(tag => tag.category === selectedCategory)
    : tags;
  
  const handleTagDelete = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };
  
  const handleEditStart = (tag: typeof mockTags[0]) => {
    setEditingTag(tag.id);
    setEditedTagName(tag.name);
  };
  
  const handleEditSave = (tagId: string) => {
    setTags(tags.map(tag => 
      tag.id === tagId ? { ...tag, name: editedTagName } : tag
    ));
    setEditingTag(null);
  };
  
  const handleEditCancel = () => {
    setEditingTag(null);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theme': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'keyword': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'entity': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <section id="tags" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-medium mb-4">标签管理</h2>
            <p className="text-muted-foreground">
              系统自动生成智能标签，可以进行编辑、删除和分类
            </p>
          </motion.div>
          
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Tag className="w-5 h-5 text-primary" />
              <span className="font-medium">标签分类:</span>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {filteredTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`${getCategoryColor(tag.category)} rounded-full flex items-center gap-1 pr-1 overflow-hidden group`}
                >
                  {editingTag === tag.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedTagName}
                        onChange={(e) => setEditedTagName(e.target.value)}
                        className="px-3 py-1 bg-transparent border-none focus:outline-none text-sm min-w-[100px]"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleEditSave(tag.id)}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={handleEditCancel}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="px-3 py-1 text-sm">{tag.name}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditStart(tag)}
                          className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleTagDelete(tag.id)}
                          className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full flex items-center px-3 py-1 text-sm gap-1 transition-colors">
                <Plus className="w-3 h-3" />
                添加标签
              </button>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-4">
                标签置信度分布
              </div>
              <div className="relative h-12 mb-2">
                {filteredTags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tag.confidence * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + (index * 0.05) }}
                    className={`absolute h-3 rounded-full ${
                      index % 2 === 0 ? 'top-0' : 'bottom-0'
                    }`}
                    style={{
                      left: 0,
                      backgroundColor: `hsl(${210 + (index * 15)} 100% 50% / ${0.3 + (tag.confidence * 0.7)})`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TagManagement;
