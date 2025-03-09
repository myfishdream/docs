<template>
  <div class="classification-container">
    <!-- 添加调试信息显示 -->
    <div v-if="documents.length === 0" class="debug-info">
      <Loading />
    </div>
    <div v-else>
      <!-- ... -->
    </div>
    <!-- 筛选器组 -->
    <div class="filters">
      <div v-if="openFilter">
        <!-- 分类筛选 -->
        <div class="filter-section" v-if="allCategories.length">
          <div class="filter-header" @click="toggleSection('category')">
            <h3>分类筛选</h3>
            <span class="toggle-icon" :class="{ 'is-open': openSections.category }">▼</span>
          </div>
          <div class="filter-content" v-show="openSections.category">
            <div class="categories-filter">
              <button v-for="category in allCategories" :key="category"
                :class="['category-btn', selectedCategory === category ? 'active' : '']"
                @click="toggleCategory(category)">
                {{ category }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 标签筛选 -->
      <div class="filter-section" v-if="allTags.length">
        <div class="filter-header" @click="toggleSection('tags')">
          <h3>标签筛选</h3>
          <span class="toggle-icon" :class="{ 'is-open': openSections.tags }">▼</span>
        </div>
        <div class="filter-content" v-show="openSections.tags">
          <div class="tags-filter">
            <button v-for="tag in allTags" :key="tag" :class="['tag-btn', selectedTags.includes(tag) ? 'active' : '']"
              @click="toggleTag(tag)">
              {{ tag }}
              <span class="tag-count">{{ getTagCount(tag) }}</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="openFilter">
        <!-- 时间筛选 -->
        <div class="filter-section" v-if="dateFilters.length">
          <div class="filter-header" @click="toggleSection('date')">
            <h3>时间筛选</h3>
            <span class="toggle-icon" :class="{ 'is-open': openSections.date }">▼</span>
          </div>
          <div class="filter-content" v-show="openSections.date">
            <div class="date-filters">
              <div class="year-filter">
                <button v-for="item in dateFilters" :key="item.year"
                  :class="['year-btn', selectedYear === item.year ? 'active' : '']" @click="toggleYear(item.year)">
                  {{ item.year }}
                </button>
              </div>
              <div class="month-filter" v-if="selectedYear">
                <button v-for="month in dateFilters.find(d => d.year === selectedYear)?.months" :key="month"
                  :class="['month-btn', selectedMonth === month ? 'active' : '']" @click="toggleMonth(month)">
                  {{ month }}月
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 文档列表 -->
    <div class="documents-grid">
      <!-- 当有筛选条件时显示文档列表 -->
      <template v-if="hasActiveFilters">
        <div v-for="(doc, index) in paginatedDocs" :key="doc.path" class="doc-card-wrapper" v-motion :initial="{
          opacity: 0,
          y: 20,
          scale: 0.95
        }" :enter="{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 250,
                damping: 25,
                delay: index * 50
              }
            }">
          <DocCard :doc="doc" />
        </div>
        <!-- 有筛选条件但没有匹配的文档 -->
        <div v-if="!paginatedDocs.length" class="no-docs">
          暂无符合条件的文档
        </div>
      </template>
      <!-- 没有筛选条件时显示提示 -->
      <div v-else>
        <div class="no-docs">
          请选择筛选条件以查看文档
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="hasActiveFilters && totalPages > 1">
      <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--; scrollToTop()">
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++; scrollToTop()">
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DocCard from './DocCard.vue'
import Loading from './Loading.vue'

// 状态管理
const documents = ref([])
const selectedTags = ref([])
const selectedCategory = ref(null)
const currentPage = ref(1)
const pageSize = 12
const sortType = ref('default')
let openFilter = ref(false)

// 计算所有可用的标签
const allTags = computed(() => {
  const tagSet = new Set()
  documents.value.forEach(doc => {
    if (Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

// 获取文档列表
const fetchDocuments = async () => {
  try {
    const modules = import.meta.glob('/pages/**/note.md', { eager: true })
    const docs = []

    for (const path in modules) {
      try {
        const mod = modules[path]
        //console.log('Raw 模块:', mod)

        // 从路径中获取文档标题（文件夹名称）
        const folderName = path.split('/').slice(-2, -1)[0]

        // 尝试获取文档内容
        let content = ''
        let frontmatter = {}

        // 方法1: 从 __pageData 获取
        if (mod.__pageData) {
          const pageData = mod.__pageData
          frontmatter = pageData.frontmatter || {}
        }
        // 方法2: 从 default 获取
        else if (mod.default?.frontmatter) {
          frontmatter = mod.default.frontmatter
        }
        // 方法3: 从 raw 内容获取
        else if (mod.default?.raw || mod.default?.content || mod.default) {
          content = mod.default.raw || mod.default.content || mod.default
          if (typeof content === 'string') {
            const match = content.match(/^---\n([\s\S]*?)\n---/)
            if (match) {
              try {
                const yaml = match[1]
                const lines = yaml.split('\n')
                let currentKey = ''
                let isArray = false
                let arrayItems = []

                lines.forEach(line => {
                  if (!line.trim() || line.trim().startsWith('#')) return

                  if (line.includes(':')) {
                    // 如果有之前的数组，保存它
                    if (isArray && currentKey) {
                      frontmatter[currentKey] = arrayItems
                      arrayItems = []
                      isArray = false
                    }

                    const [key, ...values] = line.split(':')
                    currentKey = key.trim()
                    const value = values.join(':').trim()

                    if (!value) {
                      isArray = true
                    } else {
                      frontmatter[currentKey] = value.split('#')[0].trim()
                    }
                  } else if (line.trim().startsWith('-') && isArray) {
                    const value = line.trim().substring(1).trim()
                    if (value) {
                      arrayItems.push(value.split('#')[0].trim())
                    }
                  }
                })

                // 保存最后一个数组
                if (isArray && currentKey && arrayItems.length) {
                  frontmatter[currentKey] = arrayItems
                }
              } catch (e) {
                console.warn('解析 frontmatter 失败:', e)
              }
            }
          }
        }

        //console.log('已处理的 frontmatter:', frontmatter)

        // 确保 tags 是数组
        if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
          frontmatter.tags = [frontmatter.tags]
        }

        // 构建文档信息
        const docInfo = {
          title: frontmatter.title || folderName,
          path: path.replace('.md', '.html'),
          author: frontmatter.author?.split('#')[0].trim() || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          category: frontmatter.category?.split('#')[0].trim() || '',
          description: frontmatter.description?.split('#')[0].trim() || '',
          sticky: frontmatter.sticky || 0,
          star: frontmatter.star || false,
          date: frontmatter.date || null
        }

        docs.push(docInfo)
        //console.log('新增文档：', docInfo)
      } catch (error) {
        console.error(`处理文档时出错: ${path}:`, error)
      }
    }

    documents.value = docs
    //console.log('加载的文档总数:', docs.length)
    //console.log('可用标记:', allTags.value)
  } catch (error) {
    console.error('无法获取文档:', error)
  }
}

// 计算所有分类
const allCategories = computed(() => {
  const categorySet = new Set()
  documents.value.forEach(doc => {
    if (doc.category) {
      categorySet.add(doc.category)
    }
  })
  return Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

// 计算所有可用的年份和月份
const dateFilters = computed(() => {
  const dateMap = new Map() // 年份 -> Set(月份)

  documents.value.forEach(doc => {
    if (doc.date) {
      const date = parseDate(doc.date)
      if (date && date.getTime() > 0) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        if (!dateMap.has(year)) {
          dateMap.set(year, new Set())
        }
        dateMap.get(year).add(month)
      }
    }
  })

  // 转换为排序后的数组
  return Array.from(dateMap.entries())
    .sort((a, b) => b[0] - a[0]) // 年份降序
    .map(([year, months]) => ({
      year,
      months: Array.from(months).sort((a, b) => a - b) // 月份升序
    }))
})

// 时间筛选状态
const selectedYear = ref(null)
const selectedMonth = ref(null)

// 时间筛选操作
const toggleYear = (year) => {
  if (selectedYear.value === year) {
    selectedYear.value = null
    selectedMonth.value = null
  } else {
    selectedYear.value = year
    selectedMonth.value = null
  }
  currentPage.value = 1
}

const toggleMonth = (month) => {
  if (selectedMonth.value === month) {
    selectedMonth.value = null
  } else {
    selectedMonth.value = month
  }
  currentPage.value = 1
}

// 修改文档筛选逻辑
const filteredDocs = computed(() => {
  try {
    let filtered = documents.value

    // 标签过滤
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(doc =>
        doc.tags?.some(tag => selectedTags.value.includes(tag))
      )
    }

    // 分类过滤
    if (selectedCategory.value) {
      filtered = filtered.filter(doc =>
        doc.category === selectedCategory.value
      )
    }

    // 时间筛选
    if (selectedYear.value) {
      filtered = filtered.filter(doc => {
        if (!doc.date) return false
        const date = parseDate(doc.date)
        if (!date || date.getTime() === 0) return false

        const matches = date.getFullYear() === selectedYear.value
        if (selectedMonth.value) {
          return matches && (date.getMonth() + 1) === selectedMonth.value
        }
        return matches
      })
    }

    return filtered
  } catch (error) {
    console.error('筛选文档时出错:', error)
    return []
  }
})

// 修改文档排序逻辑
const sortedDocuments = computed(() => {
  let docs = [...filteredDocs.value]

  switch (sortType.value) {
    case 'newest':
      // 只按日期排序，不考虑置顶
      return docs.sort((a, b) => {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        if (dateA.getTime() === dateB.getTime()) {
          return a.title.localeCompare(b.title, 'zh-CN')
        }
        return dateB.getTime() - dateA.getTime()
      })
    case 'default':
    default:  // 添加默认情况
      // 首先按置顶排序，然后按日期排序
      return docs.sort((a, b) => {
        // 首先按置顶排序
        if ((a.sticky || 0) !== (b.sticky || 0)) {
          return (b.sticky || 0) - (a.sticky || 0)
        }
        // 然后按日期排序
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        if (dateA.getTime() === dateB.getTime()) {
          return a.title.localeCompare(b.title, 'zh-CN')
        }
        return dateB.getTime() - dateA.getTime()
      })
  }
})

// 添加日期解析函数
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0)
  try {
    // 移除注释并清理空格
    const cleanDate = dateStr.split('#')[0].trim()
    // 分割日期部分
    const [year, month, day] = cleanDate.split('-').map(s => s.trim())
    // 确保年月日都是有效数字
    if (!year || !month || !day) return new Date(0)
    // 创建日期对象 (月份需要减1因为 JavaScript 月份从0开始)
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  } catch (e) {
    console.warn('日期格式无效：', dateStr)
    return new Date(0)
  }
}

// 置顶文档
const stickyDocs = computed(() => {
  return sortedDocuments.value.filter(doc => doc.sticky)
})

// 普通文档（非置顶）
const normalDocs = computed(() => {
  return sortedDocuments.value.filter(doc => !doc.sticky)
})

// 分页
const totalPages = computed(() =>
  Math.ceil(normalDocs.value.length / pageSize)
)

// 修改分页逻辑
const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedDocuments.value.slice(start, end)
})

// 标签操作
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value = [tag] // 只选择当前标签
  }
  currentPage.value = 1 // 重置页码
}

// 分类选择逻辑
const toggleCategory = (category) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null // 取消选择
  } else {
    selectedCategory.value = category // 选择新分类
  }
  currentPage.value = 1 // 重置页码
}

// 添加折叠状态管理
const openSections = ref({
  category: false,
  tags: true,
  date: false
})

// 切换折叠状态
const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section]
}

// 在 script setup 部分添加 scrollToTop 函数
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 添加计算标签文档数量的方法
const getTagCount = (tag) => {
  return documents.value.filter(doc => 
    doc.tags && doc.tags.includes(tag)
  ).length
}

// 添加一个计算属性来判断是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return selectedTags.value.length > 0 || 
         selectedCategory.value !== null || 
         selectedYear.value !== null || 
         selectedMonth.value !== null
})

// 添加键盘事件处理函数
const handleKeydown = (e) => {
  // 检查是否按下 Ctrl + X
  if (e.ctrlKey && e.key.toLowerCase() === 'x') {
    e.preventDefault() // 阻止默认行为
    openFilter.value = !openFilter.value
  }
}

onMounted(() => {
  fetchDocuments()
  const cards = document.querySelectorAll('.doc-card')

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      card.style.setProperty('--x', `${x}%`)
      card.style.setProperty('--y', `${y}%`)
    })
  })

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown)
})

// 在组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.classification-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}


@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}


/* .dividingLine {
  height: 1px;
  border: 1px var(--vp-c-divider);
  border-style: dashed;
} */

.filter-section {
  /* background: var(--vp-c-bg-soft); */
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  border: none;
  border-bottom: 2px dashed var(--vp-c-divider);
  border-color: var(--vp-c-divider);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  margin: -8px -12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.filter-header h3 {
  margin: 0 0 0 16px;
  font-size: 1em;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.toggle-icon {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.filter-header:hover .toggle-icon {
  color: #ef9d9f;
}

.toggle-icon.is-open {
  transform: rotate(180deg);
  color: #ef9d9f;
}

.filter-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  opacity: 1;
  transform-origin: top;
  transform: scaleY(1);
  margin-top: 12px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 12px;
}

.filter-content[style*="display: none"] {
  opacity: 0;
  transform: scaleY(0);
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.tags-filter,
.categories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px;
}

.documents-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.doc-card {
  width: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand);
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(var(--vp-c-brand-rgb), 0.1);
}

.doc-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.doc-title {
  margin: 0;
  font-size: 1.2em;
  font-weight: 500;
  color: var(--vp-c-text-1);
  flex: 1;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.doc-date {
  white-space: nowrap;
  color: var(--vp-c-text-2);
}

.doc-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 10px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  font-size: 0.85em;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.doc-summary {
  color: var(--vp-c-text-2);
  font-size: 0.95em;
  line-height: 1.6;
  margin-top: 4px;
}

.no-docs {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
  font-size: 1.1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.tag-btn,
.category-btn {
  padding: 6px 16px;
  /* border: 2px solid var(--vp-c-divider); */
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9em;
  position: relative;
  overflow: visible; /* 修改为visible以显示计数器 */
}

.tag-btn:hover,
.category-btn:hover {
  color: var(--vp-c-text-1);
}

.tag-btn.active,
.category-btn.active {
  color: var(--vp-c-text-1);
  font-weight: bold;
}

/* 添加标签计数器样式 */
.tag-count {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #eb8688;
  font-size: 0.75em;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  transform: scale(1.2);
}


.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:not(:disabled):hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 6px 12px;
  border-radius: 6px;
}

.year-filter,
.month-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.month-filter {
  margin-top: 5px;
}

.year-btn,
.month-btn {
  padding: 4px 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
  margin-top: 5px;
}

.year-btn {
  font-weight: 500;
}

.month-btn {
  padding: 2px 10px;
  font-size: 0.85em;
}

.year-btn:hover,
.month-btn:hover {
  color: var(--vp-c-brand);
}

.year-btn.active,
.month-btn.active {
  color: var(--vp-c-brand);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .classification-container {
    padding: 8px;
  }

  /* 搜索框压缩 */
  .search-wrapper {
    padding: 8px 0;
  }

  .search-box {
    max-width: 100%;
    margin: 0;
  }

  .search-input {
    height: 36px;
    font-size: 14px;
  }

  /* 调试信息简化 */
  .debug-info {
    font-size: 12px;
    padding: 4px 8px;
    margin-bottom: 8px;
    opacity: 0.8;
  }

  /* 排序按钮组压缩 */
  .sort-wrapper {
    bottom: 20px;
    right: 20px;
  }

  .cloud-btn {
    width: 50px;
    height: 50px;

    .cloud-icon {
      font-size: 1.2em;
    }

    .cloud-text {
      font-size: 0.7em;
    }
  }

  /* 文档网格布局调整 */
  .documents-grid {
    gap: 12px;
    padding: 12px 0;
  }

  .doc-card {
    padding: 16px;
  }

  .doc-header {
    flex-direction: column;
    gap: 8px;
  }

  .doc-title {
    font-size: 1.1em;
  }

  .doc-meta {
    gap: 12px;
  }

  .pagination {
    margin-top: 24px;
    gap: 12px;
  }

  .page-btn {
    padding: 6px 12px;
    font-size: 0.85em;
  }
}



</style>
