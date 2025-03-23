
export interface Tag {
  id: string;
  name: string;
  confidence: number;
  category: 'entity' | 'theme' | 'keyword';
}

export interface ProcessedDocument {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'image';
  uploadedAt: string;
  status: 'processed' | 'processing' | 'error';
  summary: string;
  tags: Tag[];
  thumbnail?: string;
}

export const mockTags: Tag[] = [
  { id: '1', name: '人工智能', confidence: 0.98, category: 'theme' },
  { id: '2', name: '数据处理', confidence: 0.95, category: 'theme' },
  { id: '3', name: 'PDF解析', confidence: 0.92, category: 'keyword' },
  { id: '4', name: '图像识别', confidence: 0.89, category: 'theme' },
  { id: '5', name: '文本分析', confidence: 0.87, category: 'theme' },
  { id: '6', name: 'OCR技术', confidence: 0.86, category: 'keyword' },
  { id: '7', name: '标签管理', confidence: 0.83, category: 'keyword' },
  { id: '8', name: '搜索功能', confidence: 0.81, category: 'keyword' },
  { id: '9', name: '数据库', confidence: 0.78, category: 'theme' },
  { id: '10', name: 'Elasticsearch', confidence: 0.76, category: 'entity' },
  { id: '11', name: 'MySQL', confidence: 0.74, category: 'entity' },
  { id: '12', name: 'T5模型', confidence: 0.73, category: 'entity' },
  { id: '13', name: 'PaddleOCR', confidence: 0.71, category: 'entity' },
];

export const mockDocuments: ProcessedDocument[] = [
  {
    id: '1',
    title: '智能数据处理系统架构设计.pdf',
    type: 'pdf',
    uploadedAt: '2023-09-15T10:30:00Z',
    status: 'processed',
    summary: '本文档详细描述了一个多层次的智能数据处理系统架构，包括用户层、应用层、AI处理层和数据层。系统能够处理PDF文件、提取文本和图像，并应用AI技术进行分析和标记。',
    tags: [
      mockTags[0], mockTags[1], mockTags[2], mockTags[4], mockTags[6], mockTags[8]
    ],
    thumbnail: 'https://images.unsplash.com/photo-1568952433726-3896e3881c65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  },
  {
    id: '2',
    title: 'OCR图像识别技术评估报告.pdf',
    type: 'pdf',
    uploadedAt: '2023-09-10T14:15:00Z',
    status: 'processed',
    summary: '本报告评估了当前主流的OCR图像识别技术，重点比较了PaddleOCR与其他开源解决方案的性能和准确度。报告还包含在不同场景下的测试结果和最佳实践建议。',
    tags: [
      mockTags[3], mockTags[5], mockTags[12]
    ],
    thumbnail: 'https://images.unsplash.com/photo-1633409361618-c73427e9e206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: '3',
    title: '搜索引擎优化与Elasticsearch集成方案.pdf',
    type: 'pdf',
    uploadedAt: '2023-09-05T09:45:00Z',
    status: 'processed',
    summary: '本文档详细介绍了如何优化搜索功能并与Elasticsearch集成，以提高搜索效率和准确性。包含了索引设计、查询优化和实时更新策略等内容。',
    tags: [
      mockTags[8], mockTags[9], mockTags[1]
    ],
    thumbnail: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2101&q=80',
  },
  {
    id: '4',
    title: '数据库设计与优化.pdf',
    type: 'pdf',
    uploadedAt: '2023-08-28T11:20:00Z',
    status: 'processing',
    summary: '正在处理中...',
    tags: [
      mockTags[10], mockTags[1]
    ],
  }
];

export const processingSteps = [
  {
    id: 'user-layer',
    title: '用户层',
    description: '用户可以上传PDF文件、输入文本或图片，并与系统交互以搜索或修改标签。',
    items: [
      '文件上传',
      '文本/图片输入',
      '交互式搜索',
      '标签管理'
    ]
  },
  {
    id: 'application-layer',
    title: '应用层',
    description: '处理用户输入，解析文件内容，预处理数据，并管理标签和搜索功能。',
    items: [
      'PDF解析',
      '内容预处理',
      '标签管理系统',
      '搜索引擎集成'
    ]
  },
  {
    id: 'ai-layer',
    title: 'AI处理层',
    description: '使用先进的AI模型进行文本分析、摘要生成、实体识别和图像处理。',
    items: [
      'T5模型摘要生成',
      '命名实体识别',
      'PaddleOCR图像处理',
      '文本分类'
    ]
  },
  {
    id: 'data-layer',
    title: '数据层',
    description: '管理结构化和非结构化数据，包括标签库、用户配置、原始文件和搜索索引。',
    items: [
      'MySQL数据库',
      'S3/OSS文件存储',
      'Elasticsearch索引',
      '缓存系统'
    ]
  }
];
