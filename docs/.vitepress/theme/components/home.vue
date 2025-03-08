<template>
    <div class="home-page-container">
        <div class="home-page-content">
            <!-- 顶部插图 -->
            <div class="home-page-hero">
                <img src="https://s21.ax1x.com/2025/02/15/pEKJAwF.png" alt="hero illustration">
            </div>

            <!-- 个人简介 -->
            <div class="home-page-profile">
                <h1 class="home-page-greeting">你好，我是鱼梦江湖 <span class="home-page-wave-emoji">👋</span></h1>
                <p class="home-page-subtitle">这是我的个人博客</p>
                <p class="home-page-email">yumengjianghu@outlook.com</p>
            </div>

            <!-- 博客列表标题 -->
            <div class="home-page-blogs-header">
                <h2>Blogs 博客</h2>
            </div>

            <!-- 博客文章列表 -->
            <div v-if="documents.length === 0" class="home-page-loading">
                <Loading/>
            </div>
            <div v-else class="home-page-blog-list">
                <a v-for="doc in paginatedDocs" :key="doc.path" :href="doc.path" class="home-page-blog-item">
                    <div class="home-page-blog-content">
                        <h3>{{ doc.title }}</h3>
                        <div class="home-page-meta-info">
                            <span class="home-page-date">{{ formatDate(doc.date) }}</span>
                            <div class="home-page-tags" v-if="doc.tags?.length">
                                <span v-for="tag in doc.tags" :key="tag" class="home-page-tag">{{ tag }}</span>
                            </div>
                        </div>
                        <p v-if="doc.description" class="home-page-description">{{ doc.description }}</p>
                    </div>
                </a>
            </div>

            <!-- 分页 -->
            <div class="home-page-pagination" v-if="totalPages > 1">
                <button class="home-page-btn" :disabled="currentPage === 1" @click="currentPage--">
                    ➕
                </button>
                <div class="home-page-numbers">
                    <button v-for="page in displayPages" 
                            :key="page" 
                            :class="['home-page-number-btn', { active: currentPage === page }]"
                            @click="currentPage = page">
                        {{ page }}
                    </button>
                </div>
                <button class="home-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                    ➖
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Loading from './Loading.vue'

// 文档数据
const documents = ref([])
const currentPage = ref(1)
const pageSize = 5

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

                // 从不同来源获取frontmatter
                if (mod.__pageData) {
                    frontmatter = mod.__pageData.frontmatter || {}
                } else if (mod.default?.frontmatter) {
                    frontmatter = mod.default.frontmatter
                } else if (mod.default?.raw || mod.default?.content || mod.default) {
                    const content = mod.default.raw || mod.default.content || mod.default
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

                                if (isArray && currentKey && arrayItems.length) {
                                    frontmatter[currentKey] = arrayItems
                                }
                            } catch (e) {
                                console.warn('解析 frontmatter 失败:', e)
                            }
                        }
                    }
                }

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
            } catch (error) {
                console.error(`处理文档时出错: ${path}:`, error)
            }
        }

        documents.value = docs
    } catch (error) {
        console.error('无法获取文档:', error)
    }
}

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
        const cleanDate = dateStr.split('#')[0].trim()
        const [year, month, day] = cleanDate.split('-').map(s => s.trim())

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        const monthName = monthNames[parseInt(month) - 1]
        return `${monthName} ${parseInt(day)}, ${year}`
    } catch (e) {
        console.warn('日期格式无效：', dateStr)
        return dateStr
    }
}

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

// 修改排序文档逻辑
const sortedDocuments = computed(() => {
    let docs = [...documents.value]
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
})

// 添加分页计算
const totalPages = computed(() =>
    Math.ceil(sortedDocuments.value.length / pageSize)
)

// 分页后的文档
const paginatedDocs = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return sortedDocuments.value.slice(start, end)
})

// 添加用于显示页码的计算属性
const displayPages = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
    }
    return pages
})

// 监听页码变化，确保在切换页面时回到顶部
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

// 修改currentPage的watch
watch(currentPage, () => {
    //   scrollToTop()
})

onMounted(() => {
    fetchDocuments()
})
</script>

<style scoped>
/* 更新所有样式类名，添加 home-page- 前缀 */
.home-page-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    z-index: 1;
}

.home-page-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
}

/* 更新其他所有样式类名，把 . 后面的类名都加上 home-page- 前缀 */
.home-page-hero {
    width: 200px;
    margin-bottom: 40px;
    position: relative;
}

.home-page-hero img {
    width: 100%;
    height: auto;
    transition: transform 0.5s ease-out;
    border-radius: 50%; /* 可选：添加圆形效果 */
}

.home-page-hero img:hover {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 移开时平滑停止 */
.home-page-hero img:not(:hover) {
    animation: none;
    transition: transform 0.5s ease-out;
}

.home-page-profile {
    text-align: center;
    margin-bottom: 40px;
}

.home-page-greeting {
    font-size: 2em;
    margin-bottom: 10px;
}

.home-page-subtitle {
    color: var(--vp-c-text-1);
    margin-bottom: 10px;
}

.home-page-email {
    color: var(--vp-c-text-1);
}

.home-page-blogs-header {
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
}

.home-page-blogs-header h2 {
    font-size: 1.5em;
    color: #333;
}

.home-page-blog-list {
    width: 100%;
}

.home-page-meta-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
}

.home-page-date {
    color: var(--vp-c-text-2);
    font-size: 0.9em;
}

.home-page-tags {
    display: flex;
    gap: 8px;
}

.home-page-tag {
    padding: 2px 8px;
    background: var(--vp-c-brand-soft);
    background: var(--vp-c-bg-soft);
    border-radius: 12px;
    font-size: 0.8em;
    color: var(--vp-c-text-1);
}

.home-page-description {
    margin-top: 8px;
    color: var(--vp-c-text-2);
    font-size: 0.9em;
    line-height: 1.5;
}

.home-page-loading {
    text-align: center;
    padding: 40px;
    color: var(--vp-c-text-2);
}

.home-page-blog-item {
    display: block;
    padding: 20px;
    margin-bottom: 15px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
}

.home-page-blog-item:hover {
    transform: translateY(-2px);
    border-color: var(--vp-c-brand);
    box-shadow: 0 0px 8px rgba(0, 0, 0, 0.1);
}

.home-page-blog-content h3 {
    margin: 0;
    color: var(--vp-c-brand);
    color: var(--vp-c-text-1);
    font-size: 1.2em;
    font-weight: 600;
}

/* 修改分页样式 */
.home-page-pagination {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.home-page-numbers {
    display: flex;
    gap: 8px;
}

.home-page-btn, .home-page-number-btn {
    min-width: 36px;
    height: 36px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 50%;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.home-page-number-btn {
    font-weight: 500;
}

.home-page-number-btn.active {
    background: var(--vp-c-brand);
    color: white;
    border-color: var(--vp-c-brand);
}

.home-page-btn:not(:disabled):hover,
.home-page-number-btn:not(.active):hover {
    background: var(--vp-c-brand);
    color: white;
    border-color: var(--vp-c-brand);
}

.home-page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 移动端优化 */
@media (max-width: 768px) {
    .home-page-container {
        padding: 16px;
    }

    .home-page-hero {
        width: 150px;
        margin-bottom: 30px;
    }

    .home-page-greeting {
        font-size: 1.5em;
    }

    .home-page-wave-emoji {
        display: none;
        /* 在移动端隐藏挥手表情 */
    }


    .home-page-blog-item {
        padding: 15px;
        margin-bottom: 12px;
    }

    .home-page-blog-content h3 {
        font-size: 1.1em;
    }

    .home-page-meta-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .home-page-tags {
        flex-wrap: wrap;
    }

    .home-page-tag {
        font-size: 0.75em;
    }

    .home-page-description {
        font-size: 0.85em;
    }

    .home-page-pagination {
        gap: 8px;
    }

    .home-page-btn, .home-page-number-btn {
        min-width: 32px;
        height: 32px;
        font-size: 0.85em;
    }
}
</style>