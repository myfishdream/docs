<template>
  <div class="enhanced-image-container">
    <!-- 图片加载组件 -->
    <div class="image-loader" 
         :class="{ 'is-loading': loading, 'has-error': error }"
         @click="showLightbox">
      <img
        :src="src"
        :alt="alt"
        @load="handleLoad"
        @error="handleError"
        class="image"
        :style="{ width: props.width, height: props.height }"
        ref="imageRef"
      />
      <div v-if="loading" class="loading-container">
        <Loading />
      </div>
      <div v-if="error" class="error-container" @click.stop="retryLoad" title="重试加载图片">
        <span class="error-icon">
          <svg t="1740145296421" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26828" width="32" height="32">
            <path d="M320 447.936c35.392 0 64-28.608 64-64s-28.608-64-64-64-64 28.608-64 64S284.608 447.936 320 447.936zM751.744 706.752c-146.496-91.008-333.44-91.008-479.872 0-14.336 8.896-19.328 28.736-11.264 44.48 8 15.744 26.048 21.248 40.384 12.352 128.704-79.936 292.864-79.936 421.632 0 4.544 2.88 9.6 4.224 14.528 4.224 10.368 0 20.416-6.016 25.856-16.64C771.072 735.488 766.016 715.648 751.744 706.752zM832 127.936 192 127.936c-70.656 0-128 57.344-128 128l0 576c0 70.656 57.344 128 128 128l640 0c70.656 0 128-57.344 128-128l0-576C960 185.28 902.656 127.936 832 127.936zM896 831.936c0 35.392-28.608 64-64 64L192 895.936c-35.392 0-64-28.608-64-64l0-576c0-35.392 28.608-64 64-64l640 0c35.392 0 64 28.608 64 64L896 831.936zM704 319.936c-35.392 0-64 28.608-64 64s28.608 64 64 64 64-28.608 64-64S739.392 319.936 704 319.936z" p-id="26829"></path>
          </svg>
        </span>
      </div>
    </div>

    <!-- vue-easy-lightbox 组件 -->
    <vue-easy-lightbox
      ref="lightbox"
      :visible="visible"
      :imgs="[src]"
      :index="0"
      @hide="handleHide"
      moveDisabled
    >
      <!-- 自定义工具栏 -->
      <template #toolbar="{ toolbarMethods }">
        <div class="custom-toolbar">
          <button class="toolbar-btn" @click="toolbarMethods.zoomIn" title="放大">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.zoomOut" title="缩小">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.rotateRight" title="顺时针旋转">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4v3z"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.rotateLeft" title="逆时针旋转">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6c0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6c0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4l-4-4v3z" transform="scale(-1, 1) translate(-24, 0)"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toggleFullscreen" title="全屏">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
          <button class="toolbar-btn" @click="handleReset(toolbarMethods)" title="重置">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </button>
        </div>
      </template>
    </vue-easy-lightbox>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import Loading from './Loading.vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  }
})

// 状态管理
const loading = ref(true) // 是否正在加载
const error = ref(false) // 是否加载失败
const retryCount = ref(0) // 重试次数
const maxRetries = 3 // 最大重试次数
const visible = ref(false) // 是否显示灯箱
const imageRef = ref(null) // 图片元素引用
const lightbox = ref(null) // 灯箱组件引用

// 事件处理
const handleLoad = () => {
  loading.value = false
  error.value = false
}

const handleError = () => {
  loading.value = false
  error.value = true
}

const retryLoad = () => {
  if (retryCount.value < maxRetries) {
    loading.value = true
    error.value = false
    retryCount.value++
    const img = new Image()
    img.src = props.src
    img.onload = handleLoad
    img.onerror = handleError
  }
}

// 图片操作功能
const showLightbox = () => {
  if (!loading.value && !error.value) {
    visible.value = true
  }
}

const handleReset = (toolbarMethods) => {
  visible.value = false
  setTimeout(() => {
    visible.value = true
  }, 0)
}

const handleHide = () => {
  visible.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

const toggleFullscreen = () => {
  const lightboxEl = document.querySelector('.vel-modal')
  if (!lightboxEl) return

  if (!document.fullscreenElement) {
    lightboxEl.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// 懒加载实现
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = props.src
        observer.unobserve(img)
      }
    })
  })

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<style scoped>
.enhanced-image-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.image-loader {
  position: relative;
  display: inline-block;
  min-width: 100px;
  min-height: 100px;
  cursor: zoom-in;
}

.image {
  display: block;
  max-width: 100%;
  height: auto;
  transition: all 0.3s ease;
}

.loading-container,
.error-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.error-container {
  cursor: pointer;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 24px;
}

.error-text {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.retry-button {
  padding: 6px 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background: var(--vp-c-brand-dark);
}

.is-loading .image {
  opacity: 0;
}

.has-error .image {
  display: none;
}

/* 自定义工具栏样式 */
.custom-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.toolbar-btn svg {
  width: 24px;
  height: 24px;
}

/* 修改灯箱样式 */
:deep(.vel-modal) {
  background: rgba(0, 0, 0, 0.85);
}

:deep(.vel-img-title) {
  color: white;
  font-size: 16px;
  margin-top: 16px;
}
</style> 