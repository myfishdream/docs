<template>
  <div class="enhanced-image-container" :data-image-id="uniqueId" :data-src="src">
    <!-- 图片加载组件 -->
    <div class="image-loader" :class="{ 'is-loading': loading, 'has-error': error }" @click="showLightbox">
      <!-- 使用空白占位符作为初始src -->
      <img :src="hasLoaded ? src : placeholderImage" :data-src="src" :alt="alt" @load="handleLoad" @error="handleError" class="image"
        :style="{ width: props.width, height: props.height }" ref="imageRef" />
      <div v-if="loading" class="loading-container">
        <Loading />
      </div>
      <div v-if="error" class="error-container" @click.stop="retryLoad" title="重试加载图片">
        <span class="error-icon">
          <svg t="1740145296421" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="26828" width="32" height="32">
            <path
              d="M320 447.936c35.392 0 64-28.608 64-64s-28.608-64-64-64-64 28.608-64 64S284.608 447.936 320 447.936zM751.744 706.752c-146.496-91.008-333.44-91.008-479.872 0-14.336 8.896-19.328 28.736-11.264 44.48 8 15.744 26.048 21.248 40.384 12.352 128.704-79.936 292.864-79.936 421.632 0 4.544 2.88 9.6 4.224 14.528 4.224 10.368 0 20.416-6.016 25.856-16.64C771.072 735.488 766.016 715.648 751.744 706.752zM832 127.936 192 127.936c-70.656 0-128 57.344-128 128l0 576c0 70.656 57.344 128 128 128l640 0c70.656 0 128-57.344 128-128l0-576C960 185.28 902.656 127.936 832 127.936zM896 831.936c0 35.392-28.608 64-64 64L192 895.936c-35.392 0-64-28.608-64-64l0-576c0-35.392 28.608-64 64-64l640 0c35.392 0 64 28.608 64 64L896 831.936zM704 319.936c-35.392 0-64 28.608-64 64s28.608 64 64 64 64-28.608 64-64S739.392 319.936 704 319.936z"
              p-id="26829"></path>
          </svg>
        </span>
      </div>
    </div>

    <!-- vue-easy-lightbox 组件 -->
    <vue-easy-lightbox
      ref="lightbox"
      :visible="visible"
      :imgs="pageImages"
      :index="currentImageIndex"
      @hide="handleHide"
      :moveDisabled="false"
      dragHandle=".vel-img"
      :dragTolerance="50"
      :dragMaxX="Infinity"
      :dragMaxY="Infinity"
    >
      <!-- 左右切换按钮 -->
      <template #prev-btn>
        <div class="switch-btn prev-btn" @click="switchImage('prev')" v-if="pageImages.length > 1">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </div>
      </template>
      
      <template #next-btn>
        <div class="switch-btn next-btn" @click="switchImage('next')" v-if="pageImages.length > 1">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </div>
      </template>

      <!-- 自定义工具栏 -->
      <template #toolbar="{ toolbarMethods }">
        <div class="custom-toolbar">
          <button class="toolbar-btn" @click="toolbarMethods.zoomIn" title="放大">
            <svg t="1740214316859" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="2422" width="32" height="32" data-spm-anchor-id="a313x.search_index.0.i4.71163a81asJYkN">
              <path
                d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480z"
                p-id="2423" data-spm-anchor-id="a313x.search_index.0.i5.71163a81asJYkN" class="selected" fill="#e6e6e6">
              </path>
              <path
                d="M625.792 448H512v-112a32 32 0 0 0-64 0V448h-112a32 32 0 0 0 0 64H448v112a32 32 0 1 0 64 0V512h113.792a32 32 0 1 0 0-64z"
                p-id="2424" data-spm-anchor-id="a313x.search_index.0.i6.71163a81asJYkN" class="selected" fill="#e6e6e6">
              </path>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.zoomOut" title="缩小">
            <svg t="1740215102389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="3564" width="32" height="32">
              <path
                d="M919.264 905.984l-138.912-138.912C851.808 692.32 896 591.328 896 480c0-229.376-186.624-416-416-416S64 250.624 64 480s186.624 416 416 416c95.008 0 182.432-32.384 252.544-86.208l141.44 141.44a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0.032-45.248zM128 480C128 285.92 285.92 128 480 128s352 157.92 352 352-157.92 352-352 352S128 674.08 128 480z"
                p-id="3565" data-spm-anchor-id="a313x.search_index.0.i8.71163a81asJYkN" class="selected" fill="#e6e6e6">
              </path>
              <path d="M625.792 448H336a32 32 0 0 0 0 64h289.792a32 32 0 1 0 0-64z" p-id="3566"
                data-spm-anchor-id="a313x.search_index.0.i9.71163a81asJYkN" class="selected" fill="#e6e6e6"></path>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.rotateRight" title="顺时针旋转">
            <svg t="1740215189461" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5234" width="32" height="32">
              <path
                d="M482.773333 66.517333l148.181334 151.168a21.333333 21.333333 0 0 1 0 29.866667l-147.84 150.826667a21.333333 21.333333 0 0 1-28.16 2.090666l-2.346667-2.090666-27.050667-27.605334a21.333333 21.333333 0 0 1 0-29.866666l69.888-71.338667a304.64 304.64 0 1 0 318.421334 352.682667l1.024-6.826667c0.170667-1.408 0.426667-3.285333 0.64-5.632a21.333333 21.333333 0 0 1 22.314666-19.114667l42.666667 2.261334a21.333333 21.333333 0 0 1 20.224 22.4l-0.085333 1.024-1.194667 10.496A389.973333 389.973333 0 1 1 484.821333 184.746667l-59.306666-60.458667a21.333333 21.333333 0 0 1 0-29.866667l27.093333-27.605333a21.333333 21.333333 0 0 1 30.165333-0.298667z"
                fill="#e6e6e6" p-id="5235"></path>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toolbarMethods.rotateLeft" title="逆时针旋转">
            <svg t="1740215204982" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5559" width="32" height="32">
              <path
                d="M541.226667 66.517333L393.045333 217.685333a21.333333 21.333333 0 0 0 0 29.866667l147.84 150.826667a21.333333 21.333333 0 0 0 28.16 2.090666l2.346667-2.090666 27.050667-27.605334a21.333333 21.333333 0 0 0 0-29.866666l-69.888-71.338667a304.64 304.64 0 1 1-318.421334 352.682667l-1.024-6.826667a176.554667 176.554667 0 0 1-0.64-5.632 21.333333 21.333333 0 0 0-22.314666-19.114667l-42.666667 2.261334a21.333333 21.333333 0 0 0-20.224 22.4l0.085333 1.024 1.194667 10.496A389.973333 389.973333 0 1 0 539.178667 184.746667l59.306666-60.458667a21.333333 21.333333 0 0 0 0-29.866667l-27.093333-27.605333a21.333333 21.333333 0 0 0-30.165333-0.298667z"
                fill="#e6e6e6" p-id="5560"></path>
            </svg>
          </button>
          <button class="toolbar-btn" @click="toggleFullscreen" title="全屏">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </template>
    </vue-easy-lightbox>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
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

// 生成唯一ID，用于追踪每个图片组件
const uniqueId = ref(`img-${Math.random().toString(36).substr(2, 9)}`)

// 1x1像素的透明占位符图片
const placeholderImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// 状态管理
const loading = ref(true) // 是否正在加载
const error = ref(false) // 是否加载失败
const retryCount = ref(0) // 自动重试次数
const maxRetries = 3 // 最大自动重试次数
const manualRetryCount = ref(0) // 手动重试次数，不限制最大值
const visible = ref(false) // 是否显示灯箱
const imageRef = ref(null) // 图片元素引用
const lightbox = ref(null) // 灯箱组件引用
const pageImages = ref([]) // 页面上的所有图片
const currentImageIndex = ref(0) // 当前图片索引
const hasLoaded = ref(false) // 是否已经加载过
const isIntersecting = ref(false) // 是否进入视口

// 获取页面上的所有图片并更新当前索引
const updatePageImages = () => {
  const containers = document.querySelectorAll('.enhanced-image-container')
  const images = []
  const imageIds = []
  
  // 遍历所有图片容器，收集已加载的图片
  containers.forEach(container => {
    const src = container.getAttribute('data-src')
    const id = container.getAttribute('data-image-id')
    if (src) {
      images.push(src)
      imageIds.push(id)
    }
  })
  
  pageImages.value = images
  return imageIds.indexOf(uniqueId.value) // 返回当前图片的索引
}

// 切换图片（上一张/下一张）
const switchImage = (direction) => {
  if (pageImages.value.length <= 1) return
  
  if (direction === 'next') {
    currentImageIndex.value = (currentImageIndex.value + 1) % pageImages.value.length
  } else {
    currentImageIndex.value = currentImageIndex.value - 1
    if (currentImageIndex.value < 0) {
      currentImageIndex.value = pageImages.value.length - 1
    }
  }
  
  // 预加载当前图片
  preloadImage(pageImages.value[currentImageIndex.value])
}

// 预加载图片
const preloadImage = (src) => {
  if (!src) return
  
  // 查找对应的图片元素并加载
  const containers = document.querySelectorAll('.enhanced-image-container')
  containers.forEach(container => {
    if (container.getAttribute('data-src') === src) {
      const img = container.querySelector('.image')
      if (img && !img.complete) {
        img.src = src
      }
    }
  })
  
  // 同时预加载下一张图片
  const nextIndex = (currentImageIndex.value + 1) % pageImages.value.length
  const nextSrc = pageImages.value[nextIndex]
  if (nextSrc) {
    const nextImg = new Image()
    nextImg.src = nextSrc
  }
}

// 事件处理
const handleLoad = (event) => {
  // 只有当加载的是实际图片而不是占位符时才更新状态
  if (event.target.src !== placeholderImage) {
    loading.value = false
    error.value = false
    hasLoaded.value = true
  }
}

const handleError = () => {
  // 只有当不是占位符图片出错时才显示错误
  if (imageRef.value && imageRef.value.src !== placeholderImage) {
    loading.value = false
    error.value = true
    
    // 记录加载失败的图片URL
    console.error(`[图片错误] 图片加载失败: ${props.src}`)
    
    // 自动尝试重试加载
    if (retryCount.value < maxRetries) {
      console.log(`[图片重试] 自动重试加载图片，当前是第${retryCount.value + 1}次尝试`)
      setTimeout(() => {
        autoRetryLoad()
      }, 500) // 延迟0.5秒后重试
    }
  }
}

// 自动重试加载图片
const autoRetryLoad = () => {
  if (retryCount.value < maxRetries) {
    loading.value = true
    error.value = false
    retryCount.value++
    
    // 添加控制台日志，记录重试次数和图片URL
    console.log(`[图片自动重试] 第${retryCount.value}次自动重试加载图片: ${props.src}`)
    
    if (imageRef.value) {
      // 先重置为占位符，然后设置实际src
      imageRef.value.src = placeholderImage
      setTimeout(() => {
        if (imageRef.value) {
          imageRef.value.src = props.src
        }
      }, 50)
    }
  } else {
    console.warn(`[图片自动重试] 图片加载失败，已达到最大自动重试次数(${maxRetries}): ${props.src}`)
  }
}

// 手动重试加载图片（点击错误图标触发）
const retryLoad = () => {
  loading.value = true
  error.value = false
  manualRetryCount.value++
  
  // 添加控制台日志，记录手动重试次数和图片URL
  console.log(`[图片手动重试] 第${manualRetryCount.value}次手动重试加载图片: ${props.src}`)
  
  if (imageRef.value) {
    // 先重置为占位符，然后设置实际src
    imageRef.value.src = placeholderImage
    setTimeout(() => {
      if (imageRef.value) {
        imageRef.value.src = props.src
      }
    }, 50)
  }
}

// 显示灯箱
const showLightbox = () => {
  if (!loading.value && !error.value && hasLoaded.value) {
    const index = updatePageImages()
    currentImageIndex.value = Math.max(0, index)
    visible.value = true
    
    // 预加载当前图片和相邻图片
    nextTick(() => {
      preloadImage(pageImages.value[currentImageIndex.value])
    })
  }
}

// 隐藏灯箱
const handleHide = () => {
  visible.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

// 切换全屏显示
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

// 加载图片
const loadImage = () => {
  if (imageRef.value && !hasLoaded.value) {
    loading.value = true
    // 使用setTimeout确保DOM更新后再加载图片
    setTimeout(() => {
      if (imageRef.value) {
        imageRef.value.src = props.src
      }
    }, 10)
  }
}

// 图片懒加载实现
onMounted(() => {
  // 创建交叉观察器用于懒加载
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasLoaded.value) {
        isIntersecting.value = true
        loadImage()
        // 只有当图片成功加载后才解除观察
        if (hasLoaded.value) {
          observer.unobserve(entry.target)
        }
      }
    })
  }, {
    rootMargin: '200px 0px', // 提前200px加载 
    threshold: 0.01 // 只要有1%进入视口就触发
  })

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }

  // 组件卸载时清理观察器
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
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
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.image {
  display: block;
  max-width: 100%;
  height: auto;
  transition: all 0.3s ease;
  min-height: 100px;
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

.is-loading .image {
  opacity: 0;
}

.has-error .image {
  display: none;
}

/* 自定义工具栏样式 */
:deep(.custom-toolbar) {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;
}

:deep(.toolbar-btn) {
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

:deep(.toolbar-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

:deep(.toolbar-btn svg) {
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

/* 切换按钮样式 */
:deep(.switch-btn) {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 2001;
}

:deep(.switch-btn:hover) {
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-50%) scale(1.1);
}

:deep(.prev-btn) {
  left: 20px;
}

:deep(.next-btn) {
  right: 20px;
}

:deep(.switch-btn svg) {
  width: 24px;
  height: 24px;
}
</style>