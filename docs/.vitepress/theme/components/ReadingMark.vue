<template>
  <div class="reading-mark-container">
    <!-- 移动端触发按钮 -->
    <div 
      v-if="isMobile"
      class="mobile-trigger"
      :class="{ 'active': showMobileMenu }"
      @click="toggleMobileMenu"
    >
      <div class="trigger-icon">{{ hasBookmark ? '📌' : '📍' }}</div>
    </div>

    <!-- 标记按钮 -->
    <div 
      class="mark-button"
      :class="{ 
        'has-mark': hasBookmark, 
        'mobile': isMobile,
        'show': showMobileMenu || !isMobile
      }"
      @click="toggleBookmark"
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ opacity: 1, scale: 1 }"
    >
      <div class="button-content">
        <div class="icon">{{ hasBookmark ? '📌' : '📍' }}</div>
        <span>{{ hasBookmark ? '移除标记' : '标记位置' }}</span>
      </div>
    </div>

    <!-- 恢复位置提示 -->
    <div 
      v-if="showRestorePrompt"
      class="restore-prompt"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="prompt-content">
        <div class="prompt-text">
          <div class="prompt-title">💡 发现阅读标记</div>
          <div class="prompt-desc">您上次在此页面留下了阅读标记</div>
        </div>
        <div class="prompt-actions">
          <button class="prompt-button restore" @click="restorePosition">
            <span class="icon">📖</span> 继续阅读
          </button>
          <button class="prompt-button dismiss" @click="dismissPrompt">
            <span class="icon">✕</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 标记指示器 -->
    <div 
      v-if="hasBookmark"
      class="bookmark-indicator"
      :style="{ top: `${bookmarkPosition}px` }"
      v-motion
      :initial="{ opacity: 0, x: 20 }"
      :enter="{ opacity: 1, x: 0 }"
    >
      <div class="indicator-line"></div>
      <div class="indicator-icon">📌</div>
    </div>

    <!-- 标记点 -->
    <div ref="markRef" class="mark-point"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const markRef = ref(null)
const showRestorePrompt = ref(false)
const hasBookmark = ref(false)
const bookmarkPosition = ref(0)
const isInitialized = ref(false)
const isMobile = ref(false)
const showMobileMenu = ref(false)

// 获取存储键
const getStorageKey = (type) => {
  return `reading-mark-${route.path}-${type}`
}

// 保存标记
const saveBookmark = () => {
  if (markRef.value && isInitialized.value) {
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
    
    // 显示保存成功提示
    showToast('已保存阅读位置 ✨')
  }
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
    const bookmark = JSON.parse(bookmarkStr)
    hasBookmark.value = true
    bookmarkPosition.value = bookmark.position
    
    // 如果当前位置距离标记位置超过半屏，显示提示
    if (Math.abs(window.scrollY - bookmark.position) > window.innerHeight / 2) {
      await nextTick()
      showRestorePrompt.value = true
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

// 检查是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 点击外部关闭移动端菜单
const handleClickOutside = (event) => {
  if (showMobileMenu.value && !event.target.closest('.mobile-trigger') && !event.target.closest('.mark-button')) {
    showMobileMenu.value = false
  }
}

// 初始化
const initialize = async () => {
  await nextTick()
  isInitialized.value = true
  checkMobile()
  checkBookmark()
  
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
}

onMounted(() => {
  initialize()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.reading-mark-container {
  position: relative;
}

.mark-point {
  position: relative;
  width: 100%;
  height: 1px;
  background: transparent;
}

/* 移动端触发按钮 */
.mobile-trigger {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: var(--vp-c-bg-soft);
  padding: 0.8rem 0.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  cursor: pointer;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
  border-right: none;
}

.mobile-trigger:hover {
  background: var(--vp-c-bg-mute);
}

.mobile-trigger.active {
  background: var(--vp-c-brand);
  .trigger-icon {
    color: white;
  }
}

.trigger-icon {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

/* 标记按钮 */
.mark-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  border: 1px solid var(--vp-c-divider);
}

.mark-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: var(--vp-c-bg-mute);
}

.mark-button.has-mark {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-light);
}

.mark-button.has-mark:hover {
  background: var(--vp-c-brand-soft);
  opacity: 0.9;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
}

.button-content .icon {
  color: inherit;
}

/* 恢复提示 */
.restore-prompt {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-width: 90vw;
  width: 400px;
}

.prompt-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prompt-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prompt-title {
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.prompt-desc {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.prompt-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.prompt-button.restore {
  background: var(--vp-c-brand);
  color: white;
}

.prompt-button.dismiss {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  padding: 0.5rem;
}

/* 标记指示器 */
.bookmark-indicator {
  position: fixed;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 90;
  pointer-events: none;
}

.indicator-line {
  flex-grow: 1;
  height: 2px;
  background: var(--vp-c-brand);
  width: 2rem;
}

.indicator-icon {
  font-size: 1.2rem;
}

/* Toast 提示 */
:global(.reading-mark-toast) {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(2rem);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
}

:global(.reading-mark-toast.show) {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .mark-button {
    position: fixed;
    top: 50%;
    right: -200px;
    bottom: auto;
    transform: translateY(-50%);
    transition: right 0.3s ease;
    margin: 0;
    border-radius: 0.5rem;
    padding: 0.6rem 1rem;
    min-width: 120px;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .mark-button.show {
    right: 3rem;
  }

  .mark-button:hover {
    transform: translateY(-50%);
  }

  .restore-prompt {
    bottom: 1rem;
    top: auto;
    left: 1rem;
    right: 1rem;
    width: auto;
    transform: none;
    margin: 0;
  }

  :global(.reading-mark-toast) {
    bottom: 1rem;
  }

  .bookmark-indicator {
    right: 2.5rem;
  }
}

/* 深色模式适配 */
:root.dark .mobile-trigger {
  background: var(--vp-c-bg-soft);
}

:root.dark .mobile-trigger.active {
  background: var(--vp-c-brand);
}

:root.dark .mark-button.has-mark {
  background: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-soft);
}
</style> 