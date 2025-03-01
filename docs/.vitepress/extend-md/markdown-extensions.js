/**
 * GitHub 风格的警告框扩展
 * 支持类型: BUG, FAILURE, QUESTION, SUCCESS, INFO
 */

// 警告框定义
const alertTypes = [
  {
    type: 'bug',
    title: 'BUG',
    icon: '☢',
    color: '#e7c000'
  },
  {
    type: 'failure',
    title: 'FAILURE',
    icon: '❌',
    color: '#e03131'
  }, 
  {
    type: 'question',
    title: 'QUESTION',
    icon: '❓',
    color: '#f08c00'
  },
  {
    type: 'success',
    title: 'SUCCESS',
    icon: '✅',
    color: '#37b24d'
  },
  {
    type: 'info',
    title: 'INFO',
    icon: 'ℹ',
    color: '#0ca678'
  }
];

/**
 * 为 markdown-it 添加 GitHub 风格的警告框支持
 * @param {MarkdownIt} md - markdown-it 实例 
 */
export function setupAlertBoxes(md) {
  // 保存原始的 render 方法
  const defaultRender = md.render;
  
  md.render = function(src, env) {
    // 处理 GitHub 风格的警告框
    let processed = src;
    
    // 为每种警告框类型创建替换规则
    alertTypes.forEach(alert => {
      const regex = new RegExp(`^>\\s*\\[!${alert.title}\\]\\s*\\n((?:>\\s*.*(?:\\n|$))+)`, 'gm');
      
      processed = processed.replace(regex, (match, content) => {
        // 提取实际内容（去除每行开头的 >）
        const cleanContent = content
          .split('\n')
          .map(line => line.replace(/^>\s*/, ''))
          .filter(line => line.trim() !== '')
          .join('\n');
        
        return `<div class="custom-block ${alert.type}"><p class="custom-block-title">${alert.title}</p><p>${cleanContent}</p></div>\n\n`;
      });
    });
    
    // 使用原始的 render 方法处理预处理后的文本
    return defaultRender.call(this, processed, env);
  };
}

