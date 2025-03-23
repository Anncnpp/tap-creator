/**
 * 提供API服务调用功能的工具库
 */

// 直接使用硬编码的API基础URL和密钥，避免使用process.env
const API_BASE_URL = 'https://api.siliconflow.cn/v1';
const API_KEY = 'sk-prxcgrxjgslgeenbkomwowqdulpidybbbmvvbsrytamdtebg';

/**
 * 生成文本的标签
 * @param content 文本内容
 * @returns 返回标签数组
 */
export async function generateTags(content: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "Pro/deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文本分析和标签提取专家。请从用户提供的文本中提取关键标签。提取的标签应该是5-10个单词或短语，能概括文本的主要内容、主题和关键信息。以JSON数组格式返回标签，格式为[\"标签1\", \"标签2\", ...]。不要有任何其他输出。"
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data && data.choices && data.choices[0]?.message?.content) {
      try {
        // 尝试解析JSON格式的标签
        const tagsContent = data.choices[0].message.content.trim();
        // 确保内容是一个JSON数组
        if (tagsContent.startsWith('[') && tagsContent.endsWith(']')) {
          return JSON.parse(tagsContent);
        } else {
          // 如果不是标准JSON格式，尝试提取类似JSON的内容
          const match = tagsContent.match(/\[(.*)\]/s);
          if (match && match[1]) {
            // 尝试将提取的内容转换为数组
            return JSON.parse(`[${match[1]}]`);
          }
        }
      } catch (parseError) {
        console.error('解析标签JSON失败:', parseError);
        // 尝试使用正则表达式提取标签
        const tagMatches = data.choices[0].message.content.match(/["']([^"']+)["']/g);
        if (tagMatches) {
          return tagMatches.map(tag => tag.replace(/["']/g, ''));
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('标签生成API请求失败:', error);
    throw error;
  }
}

/**
 * 生成文本摘要
 * @param content 文本内容
 * @returns 返回文本摘要
 */
export async function generateSummary(content: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文本摘要生成专家。请为用户提供的文本生成一个简洁的摘要。摘要应在100字以内，概括文本的主要内容和核心信息。直接返回摘要内容，不要有任何其他输出。"
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data && data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    
    return '无法生成摘要';
  } catch (error) {
    console.error('摘要生成API请求失败:', error);
    throw error;
  }
}

/**
 * 分析文本内容
 * @param content 文本内容
 * @returns 返回分析结果
 */
export async function analyzeContent(content: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "system",
            content: "你是一个专业的文本分析专家。请分析用户提供的文本，并以JSON格式返回分析结果，包含以下字段：\n1. 主题（subject）\n2. 关键词（keywords）数组\n3. 情感（sentiment）：积极、中性或消极\n4. 文本类型（type）\n5. 复杂度（complexity）：简单、中等或复杂\n仅返回JSON格式数据，不要有任何其他输出。"
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data && data.choices && data.choices[0]?.message?.content) {
      try {
        return JSON.parse(data.choices[0].message.content.trim());
      } catch (parseError) {
        console.error('解析内容分析JSON失败:', parseError);
        return {
          error: '解析响应失败',
          rawContent: data.choices[0].message.content
        };
      }
    }
    
    return { error: '无法分析内容' };
  } catch (error) {
    console.error('内容分析API请求失败:', error);
    throw error;
  }
} 