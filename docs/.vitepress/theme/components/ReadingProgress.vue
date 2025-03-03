<template>
  <div class="reading-progress">
    <!-- 右下角信息面板 -->
    <div class="progress-info" :class="{ 'show': progress > 0 && !showOnlyTopButton }">
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
             <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
               <path d="M752.736 431.063C757.159 140.575 520.41 8.97 504.518 0.41V0l-0.45 0.205-0.41-0.205v0.41c-15.934 8.56-252.723 140.165-248.259 430.653-48.21 31.457-98.713 87.368-90.685 184.074 8.028 96.666 101.007 160.768 136.601 157.287 35.595-3.482 25.232-30.31 25.232-30.31l12.206-50.095s52.47 80.569 69.304 80.528c15.114-1.23 87-0.123 95.6 0h0.82c8.602-0.123 80.486-1.23 95.6 0 16.794 0 69.305-80.528 69.305-80.528l12.165 50.094s-10.322 26.83 25.272 30.31c35.595 3.482 128.574-60.62 136.602-157.286 8.028-96.665-42.475-152.617-90.685-184.074z m-248.669-4.26c-6.758-0.123-94.781-3.359-102.891-107.192 2.95-98.714 95.97-107.438 102.891-107.93 6.964 0.492 99.943 9.216 102.892 107.93-8.11 103.833-96.174 107.07-102.892 107.192z m-52.019 500.531c0 11.838-9.42 21.382-21.012 21.382a21.217 21.217 0 0 1-21.054-21.34V821.74c0-11.797 9.421-21.382 21.054-21.382 11.591 0 21.012 9.585 21.012 21.382v105.635z m77.333 57.222a21.504 21.504 0 0 1-21.34 21.626 21.504 21.504 0 0 1-21.34-21.626V827.474c0-11.96 9.543-21.668 21.299-21.668 11.796 0 21.38 9.708 21.38 21.668v157.082z m71.147-82.043c0 11.796-9.42 21.34-21.053 21.34a21.217 21.217 0 0 1-21.013-21.34v-75.367c0-11.755 9.421-21.299 21.013-21.299 11.632 0 21.053 9.544 21.053 21.3v75.366z" />
             </svg>
        </div>
      </div>
    </div>

    <!-- 当showOnlyTopButton为true时，单独显示返回顶部按钮 -->
    <transition name="fade-scale">
      <div v-if="showOnlyTopButton && progress > 0" class="top-button-only">
        <div class="scroll-top-button" 
             @click="scrollToTop"
             :title="'返回顶部'">
             <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
               <path d="M752.736 431.063C757.159 140.575 520.41 8.97 504.518 0.41V0l-0.45 0.205-0.41-0.205v0.41c-15.934 8.56-252.723 140.165-248.259 430.653-48.21 31.457-98.713 87.368-90.685 184.074 8.028 96.666 101.007 160.768 136.601 157.287 35.595-3.482 25.232-30.31 25.232-30.31l12.206-50.095s52.47 80.569 69.304 80.528c15.114-1.23 87-0.123 95.6 0h0.82c8.602-0.123 80.486-1.23 95.6 0 16.794 0 69.305-80.528 69.305-80.528l12.165 50.094s-10.322 26.83 25.272 30.31c35.595 3.482 128.574-60.62 136.602-157.286 8.028-96.665-42.475-152.617-90.685-184.074z m-248.669-4.26c-6.758-0.123-94.781-3.359-102.891-107.192 2.95-98.714 95.97-107.438 102.891-107.93 6.964 0.492 99.943 9.216 102.892 107.93-8.11 103.833-96.174 107.07-102.892 107.192z m-52.019 500.531c0 11.838-9.42 21.382-21.012 21.382a21.217 21.217 0 0 1-21.054-21.34V821.74c0-11.797 9.421-21.382 21.054-21.382 11.591 0 21.012 9.585 21.012 21.382v105.635z m77.333 57.222a21.504 21.504 0 0 1-21.34 21.626 21.504 21.504 0 0 1-21.34-21.626V827.474c0-11.96 9.543-21.668 21.299-21.668 11.796 0 21.38 9.708 21.38 21.668v157.082z m71.147-82.043c0 11.796-9.42 21.34-21.053 21.34a21.217 21.217 0 0 1-21.013-21.34v-75.367c0-11.755 9.421-21.299 21.013-21.299 11.632 0 21.053 9.544 21.053 21.3v75.366z" />
             </svg>
        </div>
      </div>
    </transition>

    <!-- 极简的恢复位置提示 -->
    <div v-if="showRestorePrompt && !showOnlyTopButton" class="restore-prompt" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <button class="prompt-button restore" @click="restorePosition">
        <span class="icon">📖</span>
        <span>继续阅读</span>
      </button>
      <button class="prompt-button dismiss" @click="dismissPrompt">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

// 定义props
const props = defineProps({
  showOnlyTopButton: {
    type: Boolean,
    default: false
  },
  autoHideNav: {
    type: Boolean,
    default: true
  }
})

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
const lastScrollTop = ref(0)  // 上一次滚动位置 
const isNavVisible = ref(true)  // 导航栏是否可见
const scrollDirection = ref('up')  // 滚动方向
const scrollTimer = ref(null)  // 滚动计时器

// 检查是否在客户端  防止在SSR服务端渲染时报错
const isClient = typeof window !== 'undefined'

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
  if (!isClient) return

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
  if (!isClient) return 0

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
  if (!isClient) return

  const scrolled = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = (scrolled / height) * 100
  
  // 只有在启用自动隐藏时才执行导航栏显示隐藏逻辑
  if (props.autoHideNav) {
    const currentScrollTop = window.scrollY
    const scrollDelta = currentScrollTop - lastScrollTop.value
    
    // 更新滚动方向
    if (Math.abs(scrollDelta) > 5) {  // 减小阈值，提高灵敏度
      scrollDirection.value = scrollDelta > 0 ? 'down' : 'up'
    }

    // 使用防抖处理导航栏状态更新
    if (scrollTimer.value) {
      clearTimeout(scrollTimer.value)
    }

    scrollTimer.value = setTimeout(() => {
      // 根据滚动方向和位置决定导航栏状态
      if (scrollDirection.value === 'down' && currentScrollTop > 100) {
        isNavVisible.value = false
      } else if (scrollDirection.value === 'up' || currentScrollTop < 100) {
        isNavVisible.value = true
      }
    }, 10) // 100ms 的防抖时间
  }

  lastScrollTop.value = window.scrollY
  
  totalWords.value = calculateWords()
  const wordsPerMinute = 300
  const totalMinutes = Math.ceil(totalWords.value / wordsPerMinute)
  remainingTime.value = Math.ceil(totalMinutes * (1 - progress.value / 100))
}

// 恢复导航栏显示状态
const showNavBar = () => {
  if (!isClient) return
  isNavVisible.value = true
  const nav = document.querySelector('.VPNav')
  if (nav) {
    nav.classList.remove('nav-hidden')
    nav.classList.add('nav-visible')
  }
}

// 添加返回顶部方法
const scrollToTop = () => {
  if (!isClient) return
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  if (!isClient) return

  window.addEventListener('scroll', updateProgress, { passive: true })
  await checkBookmark()
  setTimeout(updateProgress, 500)
  
  // 添加样式到文档头部
  const style = document.createElement('style') // 创建一个style标签，通过追加到head标签中进行样式修改
  style.textContent = `
    .VPNav {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .VPNav.nav-hidden {
      transform: translateY(-100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .VPNav.nav-visible {
      transform: translateY(0);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `
  document.head.appendChild(style)
  
  // 监听导航栏状态变化
  watch(isNavVisible, (visible) => {
    const nav = document.querySelector('.VPNav')
    if (nav) {
      if (visible) {
        nav.classList.remove('nav-hidden')
        nav.classList.add('nav-visible')
      } else {
        nav.classList.add('nav-hidden')
        nav.classList.remove('nav-visible')
      }
    }
  })
  
  // 监听路由变化，确保页面切换时导航栏可见
  watch(() => route.path, () => {
    showNavBar()
  })
})

onUnmounted(() => {
  if (!isClient) return
  window.removeEventListener('scroll', updateProgress)
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }
  
  // 确保组件卸载时恢复导航栏状态
  showNavBar()
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  z-index: 100;
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
  pointer-events: none;
}

.progress-info.show {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
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
  border-color: #42b883;
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
  border-color: #42b883;
}

.scroll-top-button svg {
  fill: var(--vp-c-brand);  /* 使用 VitePress 的主题色变量 */
  transition: all 0.3s ease;
  transform: translateY(2px);
}

.scroll-top-button:hover svg {
  fill: #42b883; 
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

/* 优化导航栏动画样式 */
:global(.VPNav) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.VPNav.nav-hidden) {
  transform: translateY(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.VPNav.nav-visible) {
  transform: translateY(0);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 单独的返回顶部按钮样式 */
.top-button-only {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-button-only .scroll-top-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px var(--vp-c-shadow);
  backdrop-filter: blur(5px);
}

.top-button-only .scroll-top-button:hover {
  transform: scale(1.1);
  border-color: #42b883;
  box-shadow: 0 4px 12px var(--vp-c-shadow);
}

.top-button-only .scroll-top-button svg {
  fill: var(--vp-c-brand);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(2px);
}

.top-button-only .scroll-top-button:hover svg {
  fill: #42b883;
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .top-button-only {
    right: 10px;
    bottom: 10px;
  }
  
  .top-button-only .scroll-top-button {
    width: 36px;
    height: 36px;
  }
  
  .top-button-only .scroll-top-button svg {
    width: 20px;
    height: 20px;
  }
}

/* 添加平滑的显示/隐藏过渡效果 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style> 