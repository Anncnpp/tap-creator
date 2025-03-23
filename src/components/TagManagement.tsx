import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockTags } from '@/lib/mockData';
import { Tag, Plus, X, Edit, Check } from 'lucide-react';

const TagManagement = () => {
  const [tags, setTags] = useState(mockTags);
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
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    
    setTags(updatedTags);
    
    localStorage.setItem('documentTags', JSON.stringify(updatedTags));
    
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      try {
        const docs = JSON.parse(storedDocs);
        const updatedDocs = docs.map((doc: any) => ({
          ...doc,
          tags: doc.tags.filter((tag: any) => tag.id !== tagId)
        }));
        
        localStorage.setItem('documents', JSON.stringify(updatedDocs));
      } catch (error) {
        console.error("更新文档标签时出错:", error);
      }
    }
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
  
  useEffect(() => {
    const loadTagsFromStorage = () => {
      const storedTags = localStorage.getItem('documentTags');
      if (storedTags) {
        setTags(JSON.parse(storedTags));
      } else {
        setTags(mockTags);
      }
    };
    
    // 初始加载
    loadTagsFromStorage();
    
    // 添加存储事件监听器，当其他组件更新localStorage时刷新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'documentTags') {
        console.log('TagManagement检测到标签变化，正在刷新数据');
        loadTagsFromStorage();
      }
    };
    
    // 监听自定义事件
    const handleCustomEvent = () => {
      console.log('TagManagement检测到自定义事件，正在刷新数据');
      loadTagsFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tagsUpdated', handleCustomEvent);
    
    // 定期刷新标签数据，确保数据最新
    const interval = setInterval(() => {
      loadTagsFromStorage();
    }, 5000);
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tagsUpdated', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  // 添加手动刷新方法
  const refreshTags = () => {
    const storedTags = localStorage.getItem('documentTags');
    if (storedTags) {
      setTags(JSON.parse(storedTags));
      console.log('标签数据已手动刷新');
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
            <button 
              className="mt-4 px-3 py-1 text-sm bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
              onClick={refreshTags}
            >
              刷新标签
            </button>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TagManagement;
