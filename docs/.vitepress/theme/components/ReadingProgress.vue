<template>
  <div class="reading-progress">
    <!-- 顶部进度条 -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }">
        <div class="progress-glow"></div>
      </div>
    </div>
    
    <!-- 右下角信息面板 -->
    <div class="progress-info" :class="{ 'show': progress > 0 }">
      <div class="info-row">
        <div class="progress-circle">
          <svg viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              stroke-width="2"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#42b883"
              stroke-width="2"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
            />
            <text x="18" y="20.35" class="percentage">{{ Math.round(progress) }}%</text>
          </svg>
        </div>
        <div class="info-container">
          <div class="time-info">
            <span class="label">预计剩余</span>
            <span class="value">{{ remainingTime }}分钟</span>
          </div>
          <div class="word-info">
            <span class="label">文章字数</span>
            <span class="value">{{ totalWords }}字</span>
          </div>
        </div>
        <div class="bookmark-button" 
             @click="toggleBookmark" 
             :class="{ 'active': hasBookmark }"
             :title="hasBookmark ? '移除标记' : '标记位置'">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M85.3328 42.6664a42.6664 42.6664 0 0 1 42.6664-42.6664h767.9952a42.6664 42.6664 0 0 1 42.6664 42.6664v938.6608a42.6664 42.6664 0 0 1-66.346252 35.498445L511.9968 776.613813l-360.317748 240.211832A42.6664 42.6664 0 0 1 85.3328 981.3272V42.6664z" />
          </svg>
        </div>
        <div class="scroll-top-button" 
             @click="scrollToTop"
             v-show="progress > 0"
             :title="'返回顶部'">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M512 432L760 680C776 696 800 696 816 680C832 664 832 640 816 624L536 344C528 336 520 332 512 332C504 332 496 336 488 344L208 624C192 640 192 664 208 680C224 696 248 696 264 680L512 432Z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 极简的恢复位置提示 -->
    <div v-if="showRestorePrompt" class="restore-prompt" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <button class="prompt-button restore" @click="restorePosition">
        <span class="icon">📖</span>
        <span>继续阅读</span>
      </button>
      <button class="prompt-button dismiss" @click="dismissPrompt">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const progress = ref(0)
const remainingTime = ref(0)
const totalWords = ref(0)
const circumference = 2 * Math.PI * 16
const dashOffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

// 阅读标记相关
const showRestorePrompt = ref(false)
const hasBookmark = ref(false)
const bookmarkPosition = ref(0)

// 获取存储键
const getStorageKey = (type) => {
  return `reading-mark-${route.path}-${type}`
}

// 保存标记
const saveBookmark = () => {
  const position = window.scrollY
  const timestamp = new Date().toISOString()
  const bookmark = {
    position,
    timestamp,
    title: document.title
  }

  localStorage.setItem(getStorageKey('bookmark'), JSON.stringify(bookmark))
  hasBookmark.value = true
  bookmarkPosition.value = position
  showToast('已保存阅读位置 ✨')
}

// 移除标记
const removeBookmark = () => {
  localStorage.removeItem(getStorageKey('bookmark'))
  hasBookmark.value = false
  showToast('已移除阅读标记')
}

// 切换标记状态
const toggleBookmark = () => {
  if (hasBookmark.value) {
    removeBookmark()
  } else {
    saveBookmark()
  }
}

// 恢复位置
const restorePosition = () => {
  const bookmarkStr = localStorage.getItem(getStorageKey('bookmark'))
  if (bookmarkStr) {
    const bookmark = JSON.parse(bookmarkStr)
    window.scrollTo({
      top: bookmark.position,
      behavior: 'smooth'
    })
    showRestorePrompt.value = false
  }
}

// 关闭提示
const dismissPrompt = () => {
  showRestorePrompt.value = false
}

// 检查是否有标记
const checkBookmark = async () => {
  const bookmarkStr = localStorage.getItem(getStorageKey('bookmark'))
  if (bookmarkStr) {
    try {
      const bookmark = JSON.parse(bookmarkStr)
      hasBookmark.value = true
      bookmarkPosition.value = bookmark.position

      if (Math.abs(window.scrollY - bookmark.position) > window.innerHeight / 2) {
        await nextTick()
        showRestorePrompt.value = true
      }
    } catch (error) {
      localStorage.removeItem(getStorageKey('bookmark'))
      hasBookmark.value = false
    }
  }
}

// 显示提示消息
const showToast = (message) => {
  const toast = document.createElement('div')
  toast.className = 'reading-mark-toast'
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('show')
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }, 100)
}

// 字数计算
const calculateWords = () => {
  const article = document.querySelector('.vp-doc')
  if (!article) return 0

  const textBlocks = Array.from(article.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li'))
    .filter(el => !el.closest('pre'))
    .map(el => el.textContent.trim())
    .filter(text => text)
    .join('')
    .replace(/\s+/g, '')

  return textBlocks.length
}

const updateProgress = () => {
  const scrolled = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = (scrolled / height) * 100
  
  totalWords.value = calculateWords()
  const wordsPerMinute = 300
  const totalMinutes = Math.ceil(totalWords.value / wordsPerMinute)
  remainingTime.value = Math.ceil(totalMinutes * (1 - progress.value / 100))
}

// 添加返回顶部方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  window.addEventListener('scroll', updateProgress)
  await checkBookmark()
  setTimeout(updateProgress, 500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  z-index: 100;
}

.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--vp-c-divider);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--reading-pg-line-color1), var(--reading-pg-line-color2));
  transition: width 0.3s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: var(--reading-pg-line-color1);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--reading-pg-line-color1);
}

.progress-info {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  box-shadow: 0 2px 8px var(--vp-c-shadow);
  backdrop-filter: blur(8px);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
}

.progress-info.show {
  transform: translateY(0);
  opacity: 1;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: column;
}

.progress-circle {
  width: 36px;
  height: 36px;
  position: relative;
  cursor: pointer;
}

.progress-circle svg {
  transform: rotate(0deg);
}

.progress-circle path:first-child {
  stroke: var(--vp-c-divider);
}

.percentage {
  font-size: 10px;
  fill: #42b883;
  text-anchor: middle;
  font-weight: 500;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-info,
.word-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.value {
  font-size: 14px;
  font-weight: 500;
  color: #42b883;
  text-align: center;
}

/* 书签按钮样式 */
.bookmark-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg);
}

.bookmark-button:hover {
  transform: scale(1.1);
}

.bookmark-button svg {
  fill: var(--vp-c-brand-1); /* 未标记时为蓝色 */
  transition: all 0.3s ease;
}

.bookmark-button.active svg {
  fill: #42b883; /* 已标记时为绿色 */
  transform: scale(1.1);
}

/* 极简提示框样式 */
.restore-prompt {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 2rem;
  padding: 0.3rem;
  box-shadow: 0 2px 8px var(--vp-c-shadow);
  z-index: 100;
  backdrop-filter: blur(8px);
}

.prompt-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  background: none;
  color: var(--vp-c-text-1);
}

.prompt-button.restore {
  background: var(--vp-c-brand);
  color: white;
}

.prompt-button.restore:hover {
  opacity: 0.9;
}

.prompt-button.dismiss {
  padding: 0.4rem;
  color: var(--vp-c-text-2);
}

.prompt-button.dismiss:hover {
  color: var(--vp-c-text-1);
}

/* Toast 样式 */
:global(.reading-mark-toast) {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(2rem);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px var(--vp-c-shadow);
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
  font-weight: 500;
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
}

:global(.reading-mark-toast.show) {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 添加返回顶部按钮样式 */
.scroll-top-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg);
}

.scroll-top-button:hover {
  transform: scale(1.1);
  border-color: var(--vp-c-brand);
}

.scroll-top-button svg {
  fill: var(--vp-c-brand);
  transition: all 0.3s ease;
}

.scroll-top-button:hover svg {
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .progress-info {
    right: 10px;
    bottom: 10px;
    padding: 8px;
  }
  
  .info-row {
    gap: 8px;
  }
  
  .progress-circle {
    width: 32px;
    height: 32px;
  }
  
  .info-container {
    display: none;
  }
  
  .bookmark-button {
    width: 32px;
    height: 32px;
  }

  .restore-prompt {
    top: auto;
    bottom: 80px;
    right: 10px;
  }

  :global(.reading-mark-toast) {
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 16px;
    font-size: 14px;
  }

  :global(.reading-mark-toast.show) {
    transform: translateX(-50%);
  }

  .scroll-top-button {
    width: 32px;
    height: 32px;
  }
  
  .scroll-top-button svg {
    width: 16px;
    height: 16px;
  }
}
</style> 