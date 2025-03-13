<template>
    <div class="home-page-container">
        <!-- 添加粒子容器 -->
        <div id="particles-js"></div>
        <div class="home-page-content">
            <!-- 顶部插图 -->
            <div class="home-page-hero">
                <img src="/logo3.png" alt="hero illustration">
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
                <Loading />
            </div>
            <div v-else class="home-page-blog-list">
                <div v-for="doc in paginatedDocs" :key="doc.path" class="home-page-blog-item">
                    <div class="home-page-tools">
                        <div class="home-page-circle">
                            <span class="home-page-box red"></span>
                        </div>
                        <div class="home-page-circle">
                            <span class="home-page-box yellow"></span>
                        </div>
                        <div class="home-page-circle">
                            <span class="home-page-box green"></span>
                        </div>
                    </div>
                    <a :href="doc.path" class="home-page-blog-content">
                        <h3>{{ doc.title }}</h3>
                        <div class="home-page-meta-info">
                            <span class="home-page-date">{{ formatDate(doc.date) }}</span>
                            <div class="home-page-tags" v-if="doc.tags?.length">
                                <span v-for="tag in doc.tags" :key="tag" class="home-page-tag">{{ tag }}</span>
                            </div>
                        </div>
                        <p v-if="doc.description" class="home-page-description">{{ doc.description }}</p>
                    </a>
                </div>
            </div>

            <!-- 分页 -->
            <div class="home-page-pagination" v-if="totalPages > 1">
                <div class="radio-input">
                    <input v-for="page in displayPages" :key="page" :class="['input', getColorClass(page)]" type="radio"
                        name="radio" :checked="currentPage === page" @change="currentPage = page" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Loading from './Loading.vue'

// 文档数据
const documents = ref([])  // 存储所有文档数据
const currentPage = ref(1)  // 当前页码
const pageSize = 5  // 每页显示的文档数量
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
                    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.filter(tag => tag && tag.trim()) : [],
                    category: frontmatter.category?.split('#')[0].trim() || '',
                    description: frontmatter.description?.split('#')[0].trim() || '',
                    sticky: frontmatter.sticky || 0,
                    star: frontmatter.star || false,
                    date: frontmatter.date?.split('#')[0].trim() || null
                }

                // 检查是否有描述信息
                if (frontmatter.description && frontmatter.description.trim()) {
                    docs.push(docInfo)
                } else {
                    console.debug(`跳过文档 ${path}: 没有描述信息`)
                }
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

// 添加颜色循环函数
const getColorClass = (page) => {
    const colors = ['green', 'yellow', 'red'];
    return colors[(page - 1) % 3];
}

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
    
    // 动态加载 particles.js
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
    script.onload = () => {
        window.particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80, // 增加粒子数量
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#666666'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.6,
                    random: true, // 启用随机透明度
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#666666',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: true, // 启用反弹
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab' // 改为 grab 模式
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        })
    }
    document.head.appendChild(script)
    
    // 添加头像旋转动画逻辑
    const heroImg = document.querySelector('.home-page-hero img')
    let rotationAngle = 0
    let rotationSpeed = 0
    let isHovering = false
    let lastTimestamp = 0
    let animationFrameId = null

    function updateRotation(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp
        const deltaTime = timestamp - lastTimestamp
        lastTimestamp = timestamp

        if (isHovering) {
            // 当鼠标悬浮时，速度逐渐增加
            rotationSpeed = Math.min(rotationSpeed + 0.01, 100) // 限制最大速度
        } else {
            // 当鼠标离开时，速度逐渐减小
            rotationSpeed = Math.max(rotationSpeed - 0.01, 0)
        }

        if (rotationSpeed > 0) {
            rotationAngle += rotationSpeed
            heroImg.style.transform = `rotate(${rotationAngle}deg)`
            animationFrameId = requestAnimationFrame(updateRotation)
        } else {
            lastTimestamp = 0
            animationFrameId = null
        }
    }

    heroImg.addEventListener('mouseenter', () => {
        isHovering = true
        if (!animationFrameId) {
            lastTimestamp = 0
            animationFrameId = requestAnimationFrame(updateRotation)
        }
    })

    heroImg.addEventListener('mouseleave', () => {
        isHovering = false
    })
})
</script>

<style scoped>
/* 添加粒子容器样式 */
#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
}

/* 更新容器样式以确保内容在粒子之上 */
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

.home-page-hero {
    width: 200px;
    margin-bottom: 40px;
    position: relative;
}

.home-page-hero img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    border: 5px solid var(--vp-c-divider);
    transform: rotate(0deg);
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
    color: var(--vp-c-text-1);
}

.home-page-blog-list {
    width: 100%;
}

.home-page-meta-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
    /* 允许换行 */
}

.home-page-date {
    color: var(--vp-c-text-2);
    font-size: 0.9em;
}

.home-page-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    /* 允许标签换行 */
    overflow: hidden;
    /* 防止溢出 */
}

.home-page-tag {
    padding: 2px 8px;
    background: var(--vp-c-bg-soft);
    border-radius: 12px;
    font-size: 0.8em;
    color: var(--vp-c-text-1);
    white-space: nowrap;
    /* 防止标签文字换行 */
    max-width: 150px;
    /* 限制最大宽度 */
    overflow: hidden;
    text-overflow: ellipsis;
    /* 超出显示省略号 */
}

.home-page-description {
    margin-top: 8px;
    color: var(--vp-c-text-2);
    font-size: 0.9em;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* 限制最多显示2行 */
    -webkit-box-orient: vertical;
}

.home-page-loading {
    text-align: center;
    padding: 40px;
    color: var(--vp-c-text-2);
}

.home-page-blog-item {
    background-color: #ffffff;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.home-page-tools {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: #f8f9fa;
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.home-page-circle {
    padding: 0 4px;
}

.home-page-box {
    display: inline-block;
    align-items: center;
    width: 10px;
    height: 10px;
    padding: 1px;
    border-radius: 50%;
}

.home-page-box.red {
    background-color: #ff605c;
}

.home-page-box.yellow {
    background-color: #ffbd44;
}

.home-page-box.green {
    background-color: #00ca4e;
}

.home-page-blog-content {
    display: block;
    padding: 20px 24px;
    text-decoration: none;
    color: inherit;
}

.home-page-blog-content h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.4;
}

.home-page-blog-item:hover {
    transform: translateY(-2px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.08);
}

/* 新的分页样式 */
.home-page-pagination {
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.input {
    -webkit-appearance: none;
    margin: 6px;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    cursor: pointer;
    vertical-align: middle;
    box-shadow: hsla(0, 0%, 100%, 0.15) 0 1px 1px,
        inset hsla(0, 0%, 0%, 0.5) 0 0 0 1px;
    background-color: hsla(0, 0%, 0%, 0.2);
    background-repeat: no-repeat;
    -webkit-transition: background-position 0.15s cubic-bezier(0.8, 0, 1, 1),
        -webkit-transform 0.25s cubic-bezier(0.8, 0, 1, 1);
    outline: none;
}

.input.green {
    background-image: -webkit-radial-gradient(hsla(118, 100%, 90%, 1) 0%,
            hsla(118, 100%, 70%, 1) 15%,
            hsla(118, 100%, 60%, 0.3) 28%,
            hsla(118, 100%, 30%, 0) 70%);
}

.input.yellow {
    background-image: -webkit-radial-gradient(hsla(50, 100%, 90%, 1) 0%,
            hsla(50, 100%, 70%, 1) 15%,
            hsla(50, 100%, 60%, 0.3) 28%,
            hsla(50, 100%, 30%, 0) 70%);
}

.input.red {
    background-image: -webkit-radial-gradient(hsla(0, 100%, 90%, 1) 0%,
            hsla(0, 100%, 70%, 1) 15%,
            hsla(0, 100%, 60%, 0.3) 28%,
            hsla(0, 100%, 30%, 0) 70%);
}

.input:checked {
    -webkit-transition: background-position 0.2s 0.15s cubic-bezier(0, 0, 0.2, 1),
        -webkit-transform 0.25s cubic-bezier(0, 0, 0.2, 1);
}

.input:active {
    -webkit-transform: scale(1.5);
    -webkit-transition: -webkit-transform 0.1s cubic-bezier(0, 0, 0.2, 1);
}

/* The up/down direction logic */
.input,
.input:active {
    background-position: 24px 0;
}

.input:checked {
    background-position: 0 0;
}

.input:checked~.input,
.input:checked~.input:active {
    background-position: -24px 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .home-page-container {
        padding: 16px 0;
        /* 移除左右内边距 */
    }

    .home-page-content {
        padding: 0;
        /* 移除内边距 */
        width: 100%;
        /* 确保内容区域占满宽度 */
    }

    .home-page-blog-list {
        width: 100%;
        /* 确保列表占满宽度 */
    }

    .home-page-blog-item {
        margin: 12px;
        /* 只保留底部间距 */
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

    .home-page-blog-content h3 {
        font-size: 1em;
    }

    .home-page-tools {
        padding: 8px;
    }

    .home-page-box {
        width: 8px;
        height: 8px;
    }

    .input {
        margin: 4px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
    }

    .home-page-tags {
        display: none;
        /* 移动端隐藏标签 */
    }

    .home-page-description {
        display: none;
        /* 移动端隐藏描述 */
    }

    .home-page-blog-content {
        padding: 12px 16px;
    }

    .home-page-blog-content h3 {
        font-size: 1em;
        margin-bottom: 4px;
        /* 由于隐藏了标签和描述，减少底部间距 */
    }

    .home-page-meta-info {
        margin-top: 4px;
    }

    .home-page-date {
        font-size: 0.85em;
    }
}

/* 深色模式适配 */
:root.dark .home-page-blog-item {
    background-color: #1a1a1a;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.3),
        0 2px 4px -1px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.05);
}

:root.dark .home-page-tools {
    background-color: #2a2a2a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .home-page-blog-content h3 {
    color: rgba(255, 255, 255, 0.95);
}

:root.dark .home-page-date {
    color: rgba(255, 255, 255, 0.6);
}

:root.dark .home-page-description {
    color: rgba(255, 255, 255, 0.7);
}

:root.dark .home-page-tag {
    background-color: #2a2a2a;
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .home-page-blog-item:hover {
    transform: translateY(-2px);
    box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.4),
        0 4px 6px -2px rgba(0, 0, 0, 0.3);
    background-color: #202020;
    border-color: rgba(255, 255, 255, 0.08);
}

:root.dark #particles-js {
    background-color: #1a1a1a;
}

:root.dark .particles-js-canvas-el {
    opacity: 0.3;
}
</style>