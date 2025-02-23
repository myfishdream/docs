<template>
  <div class="show-container">
    <div class="documents-grid">
      <DocCard v-for="doc in selectedDocs" :key="doc.path" :doc="doc" />
      <div v-if="!selectedDocs.length" class="no-docs">
        暂无精选文档
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DocCard from '../DocCard.vue'

// 状态管理
const selectedDocs = ref([])

// 获取文档列表
const fetchDocuments = async () => {
  try {
    const modules = import.meta.glob('/pages/**/note.md', { eager: true })
    const docs = []

    for (const path in modules) {
      try {
        const mod = modules[path]
        const folderName = path.split('/').slice(-2, -1)[0]
        let frontmatter = {}

        // 获取frontmatter数据
        if (mod.__pageData) {
          frontmatter = mod.__pageData.frontmatter || {}
        } else if (mod.default?.frontmatter) {
          frontmatter = mod.default.frontmatter
        }

        // 只选择被标记为精选(star=true)的文档
        if (frontmatter.star) {
          const docInfo = {
            title: frontmatter.title || folderName,
            path: path.replace('.md', '.html'),
            author: frontmatter.author?.split('#')[0].trim() || '',
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            category: frontmatter.category?.split('#')[0].trim() || '',
            description: frontmatter.description?.split('#')[0].trim() || '',
            date: frontmatter.date || null,
            star: frontmatter.star || false
          }
          docs.push(docInfo)
        }
      } catch (error) {
        console.error(`处理文档时出错: ${path}:`, error)
      }
    }

    selectedDocs.value = docs
  } catch (error) {
    console.error('无法获取文档:', error)
  }
}

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.show-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.documents-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.no-docs {
  text-align: center;
  padding: 40px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  color: var(--vp-c-text-2);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .show-container {
    padding: 8px;
  }

  .documents-grid {
    gap: 8px;
    margin: 8px 0;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .no-docs {
    background: var(--vp-c-bg-soft);
  }
}
</style>