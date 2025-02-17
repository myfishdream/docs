<template>
  <div class="reading-mark-container">
    <!-- 移动端触发按钮 -->
    <div v-if="isMobile" class="mobile-trigger" @click="toggleBookmark" :title="hasBookmark ? '移除标记' : '标记位置'">
      <div class="trigger-icon">
        <svg v-if="!hasBookmark" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          width="20" height="20">
          <path
            d="M85.3328 42.6664a42.6664 42.6664 0 0 1 42.6664-42.6664h767.9952a42.6664 42.6664 0 0 1 42.6664 42.6664v938.6608a42.6664 42.6664 0 0 1-66.346252 35.498445L511.9968 776.613813l-360.317748 240.211832A42.6664 42.6664 0 0 1 85.3328 981.3272V42.6664z m85.3328 42.6664v816.250898l341.3312-227.539911 341.3312 227.539911V85.3328H170.6656z"
            fill="#1296db" />
        </svg>
        <svg v-else t="1739790934539" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11878" data-spm-anchor-id="a313x.search_index.0.i0.4edf3a812Ksj1M" width="256" height="256"><path d="M85.3328 42.6664a42.6664 42.6664 0 0 1 42.6664-42.6664h767.9952a42.6664 42.6664 0 0 1 42.6664 42.6664v938.6608a42.6664 42.6664 0 0 1-66.346252 35.498445L511.9968 776.613813l-360.317748 240.211832A42.6664 42.6664 0 0 1 85.3328 981.3272V42.6664z m85.3328 42.6664v816.250898l341.3312-227.539911 341.3312 227.539911V85.3328H170.6656z" p-id="11879" data-spm-anchor-id="a313x.search_index.0.i1.4edf3a812Ksj1M" class="" fill="#34a44b"></path></svg>
      </div>
    </div>

    <!-- 标记按钮 -->
    <div class="mark-button" :class="{ 'mobile': isMobile, 'show': showMobileMenu || !isMobile }"
      @click="toggleBookmark" v-motion :initial="{ opacity: 0, scale: 0.8 }" :enter="{ opacity: 1, scale: 1 }">
      <div class="button-content">
        <div class="icon">
          <svg v-if="!hasBookmark" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            width="20" height="20">
            <path
              d="M85.3328 42.6664a42.6664 42.6664 0 0 1 42.6664-42.6664h767.9952a42.6664 42.6664 0 0 1 42.6664 42.6664v938.6608a42.6664 42.6664 0 0 1-66.346252 35.498445L511.9968 776.613813l-360.317748 240.211832A42.6664 42.6664 0 0 1 85.3328 981.3272V42.6664z m85.3328 42.6664v816.250898l341.3312-227.539911 341.3312 227.539911V85.3328H170.6656z"
              fill="#1296db" />
          </svg>
          <svg v-else t="1739790934539" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11878" data-spm-anchor-id="a313x.search_index.0.i0.4edf3a812Ksj1M" width="20" height="20"><path d="M85.3328 42.6664a42.6664 42.6664 0 0 1 42.6664-42.6664h767.9952a42.6664 42.6664 0 0 1 42.6664 42.6664v938.6608a42.6664 42.6664 0 0 1-66.346252 35.498445L511.9968 776.613813l-360.317748 240.211832A42.6664 42.6664 0 0 1 85.3328 981.3272V42.6664z m85.3328 42.6664v816.250898l341.3312-227.539911 341.3312 227.539911V85.3328H170.6656z" p-id="11879" data-spm-anchor-id="a313x.search_index.0.i1.4edf3a812Ksj1M" class="" fill="#34a44b"></path></svg>
        </div>
        <span>{{ hasBookmark ? '移除标记' : '标记位置' }}</span>
      </div>
    </div>

    <!-- 恢复位置提示 -->
    <div v-if="showRestorePrompt" class="restore-prompt" v-motion :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }">
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
    console.log('保存标记 - 位置:', position, '标记状态:', hasBookmark.value)

    // 显示保存成功提示
    showToast('已保存阅读位置 ✨')
  } else {
    console.log('保存失败 - markRef:', !!markRef.value, 'initialized:', isInitialized.value)
  }
}

// 移除标记
const removeBookmark = () => {
  localStorage.removeItem(getStorageKey('bookmark'))
  hasBookmark.value = false
  console.log('移除标记 - 标记状态:', hasBookmark.value)
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
  console.log('检查标记 - 存储值:', bookmarkStr)
  if (bookmarkStr) {
    try {
      const bookmark = JSON.parse(bookmarkStr)
      hasBookmark.value = true
      bookmarkPosition.value = bookmark.position
      console.log('恢复标记 - 位置:', bookmark.position, '标记状态:', hasBookmark.value)

      // 如果当前位置距离标记位置超过半屏，显示提示
      if (Math.abs(window.scrollY - bookmark.position) > window.innerHeight / 2) {
        await nextTick()
        showRestorePrompt.value = true
      }
    } catch (error) {
      console.error('解析标记数据失败:', error)
      localStorage.removeItem(getStorageKey('bookmark'))
      hasBookmark.value = false
    }
  } else {
    console.log('无标记数据')
    hasBookmark.value = false
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
  await checkBookmark()
  console.log('初始化完成 - 标记状态:', hasBookmark.value, '位置:', bookmarkPosition.value)

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
  left: 50%;
  top: 0.7rem;
  transform: translateX(-50%);
  padding: 0.4rem;
  border-radius: 0.6rem;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
}

.mobile-trigger:hover {
  transform: translateX(-50%) translateY(-1px);
}

.trigger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
}

.mobile-trigger:active .trigger-icon {
  transform: scale(0.95);
}

.trigger-icon .icon {
  width: 100%;
  height: 100%;
  transform: translateX(2.4px);
}

/* 标记按钮样式 */
.mark-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.8rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  backdrop-filter: blur(8px);
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mark-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mark-button:active {
  transform: translateY(0);
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
  border: 1px solid var(--vp-c-brand-dimm);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 100;
  max-width: 90vw;
  width: 400px;
  backdrop-filter: blur(8px);
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
  padding: 0.4rem 0.8rem;
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
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  padding: 0.4rem;
}

/* 标记点 */
.bookmark-indicator,
.indicator-line,
.indicator-icon {
  display: none;
}

/* Toast 提示 */
:global(.reading-mark-toast) {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(2rem);
  background: var(--vp-c-brand);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
  font-weight: 500;
  backdrop-filter: blur(8px);
  border: none;
  font-size: 0.9rem;
}

:global(.reading-mark-toast.show) {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 移动端适配优化 */
@media (max-width: 768px) {
  .mark-button {
    display: none;
  }

  .mobile-trigger {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .mobile-trigger::after {
    content: attr(data-text);
    margin-left: 0.3rem;
    font-size: 0.9rem;
  }

  .mobile-trigger.active {
    background: var(--vp-c-brand);
    color: white;
  }

  .mobile-trigger.active .trigger-icon {
    transform: scale(1.1);
  }

  .restore-prompt {
    bottom: 1rem;
    top: auto;
    left: 1rem;
    right: 1rem;
    width: auto;
    transform: none;
    margin: 0;
    background: var(--vp-c-bg);
    backdrop-filter: blur(8px);
  }

  :global(.reading-mark-toast) {
    bottom: 1rem;
    background: var(--vp-c-brand);
    color: white;
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }

  .bookmark-indicator {
    right: 2rem;
  }

  .indicator-line {
    width: 1.5rem;
    height: 1px;
    opacity: 0.6;
  }

  .indicator-icon {
    font-size: 1rem;
    opacity: 0.8;
  }
}

/* 深色模式适配 */
:root.dark .mobile-trigger {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

:root.dark .mobile-trigger:hover {
  background: var(--vp-c-bg-mute);
}

:root.dark .mobile-trigger.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

/* 动画优化 */
.mark-button,
.mobile-trigger,
.restore-prompt,
.bookmark-indicator {
  will-change: transform, opacity;
}

/* 提示框样式优化 */
.prompt-button.restore {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
}

.prompt-button.dismiss {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  padding: 0.4rem;
}

/* Toast 样式优化 */
:global(.reading-mark-toast) {
  background: var(--vp-c-brand);
  color: white;
  font-weight: 500;
  padding: 0.6rem 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  border: none;
  font-size: 0.9rem;
}
</style>