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

export const mockTags: Tag[] = [];

export const mockDocuments: ProcessedDocument[] = [];

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
