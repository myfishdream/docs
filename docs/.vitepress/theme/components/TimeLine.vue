<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="timeline-line"></div>
      <div v-for="(item, index) in sortedEvents" 
        :key="item.date + index" 
        class="timeline-item"
        :class="[
          getItemPosition(item, index),
          'size-' + item.size,
          item.type,
          { 'is-visible': visibleItems.has(index) }
        ]"
        :ref="(el) => {
          itemRefs[index] = el;
          setupIntersectionObserver(el, index);
        }"
      >
        <!-- 时间点 -->
        <div class="timeline-dot"></div>
        
        <!-- 内容卡片 -->
        <div class="timeline-card">
          <!-- 日期标签 -->
          <div class="timeline-date">{{ formatDate(item.date) }}</div>
          
          <!-- 主要内容 -->
          <div class="timeline-content">
            <!-- 图片区域 -->
            <div v-if="item.image" 
              class="timeline-image"
              :style="{ 
                backgroundImage: `url(${item.image})`,
                height: item.size === 'large' ? '300px' : '200px'
              }"
            >
              <div class="image-overlay"></div>
            </div>
            
            <!-- 文本内容 -->
            <div class="content-body">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-desc">{{ item.description }}</p>
              
              <!-- 链接按钮 -->
              <a 
                v-if="item.link"
                :href="withBase(item.link)"
                class="timeline-link"
                :class="item.type"
                :target="isExternalLink(item.link) ? '_blank' : undefined"
                :rel="isExternalLink(item.link) ? 'noopener noreferrer' : undefined"
              >
                了解更多
                <span class="link-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { useIntersectionObserver } from '@vueuse/core'

const router = useRouter()

const props = defineProps({
  events: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 修改显示状态管理
const itemRefs = ref([])
const visibleItems = ref(new Set())
const observers = ref([])

const setupIntersectionObserver = (el, index) => {
  if (!el) return

  // 如果已经可见，不需要设置观察器
  if (visibleItems.value.has(index)) return

  const observer = useIntersectionObserver(
    el,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        visibleItems.value.add(index)
        // 停止观察
        if (observers.value[index]) {
          observers.value[index].stop()
          observers.value[index] = null
        }
      }
    },
    { threshold: 0, rootMargin: '50px' }
  )

  observers.value[index] = observer
}

// 在组件卸载时清理所有观察器
onUnmounted(() => {
  observers.value.forEach(observer => {
    if (observer) {
      observer.stop()
    }
  })
})

// 初始检查
onMounted(() => {
  nextTick(() => {
    itemRefs.value.forEach((el, index) => {
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight) {
          visibleItems.value.add(index)
          // 如果元素已经可见，确保停止观察
          if (observers.value[index]) {
            observers.value[index].stop()
            observers.value[index] = null
          }
        }
      }
    })
  })
})

// 日期格式化
const formatDate = (dateStr) => {
  const date = new Date(dateStr.replace(/-/g, '/'))
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 排序事件
const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => {
    const dateA = new Date(a.date.replace(/-/g, '/'))
    const dateB = new Date(b.date.replace(/-/g, '/'))
    return dateB - dateA
  })
})

// 获取项目位置
const getItemPosition = (item, index) => {
  if (item.position) {
    return item.position
  }
  return index % 2 === 0 ? 'left' : 'right'
}

// 判断是否为外部链接
const isExternalLink = (link) => {
  return /^https?:\/\//.test(link)
}
</script>

<style scoped>
.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: var(--vp-c-divider);
  opacity: 0.6;
}

.timeline-item {
  position: relative;
  margin: 3rem 0;
  width: 50%;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
}

.timeline-item.left {
  padding-right: 3rem;
  left: 0;
}

.timeline-item.right {
  padding-left: 3rem;
  left: 50%;
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--vp-c-bg);
  border: 2px solid currentColor;
  border-radius: 50%;
  top: 24px;
  transition: all 0.3s ease;
}

.timeline-item.left .timeline-dot {
  right: -8px;
}

.timeline-item.right .timeline-dot {
  left: -8px;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
  box-shadow: 0 0 10px currentColor;
}

.timeline-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.timeline-date {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
}

.timeline-content {
  position: relative;
}

.timeline-image {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(var(--vp-c-bg-soft-rgb), 0.8) 50%,
    var(--vp-c-bg-soft) 100%
  );
  backdrop-filter: blur(2px);
}

.content-body {
  position: relative;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 0 0 12px 12px;
}

.timeline-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.timeline-desc {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

.timeline-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  color: inherit;
}

.timeline-link:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  background: var(--vp-c-bg-alt);
}

.link-arrow {
  transition: transform 0.3s ease;
}

.timeline-link:hover .link-arrow {
  transform: translateX(4px);
}

/* 类型样式 */
.timeline-item.milestone {
  color: var(--vp-c-brand) !important;
}

.timeline-item.achievement {
  color: var(--vp-c-green-1) !important;
}

.timeline-item.update {
  color: var(--vp-c-yellow-1) !important;
}

.milestone .timeline-date {
  background: var(--vp-c-brand) !important;
}

.achievement .timeline-date {
  background: var(--vp-c-green-1) !important;
}

.update .timeline-date {
  background: var(--vp-c-yellow-1) !important;
}

.milestone .timeline-link {
  color: var(--vp-c-brand) !important;
}

.achievement .timeline-link {
  color: var(--vp-c-green-1) !important;
}

.update .timeline-link {
  color: var(--vp-c-yellow-1) !important;
}

.milestone .timeline-dot {
  border-color: var(--vp-c-brand) !important;
}

.achievement .timeline-dot {
  border-color: var(--vp-c-green-1) !important;
}

.update .timeline-dot {
  border-color: var(--vp-c-yellow-1) !important;
}

/* 尺寸样式 */
.size-large .timeline-title {
  font-size: 1.5rem;
}

.size-small .timeline-title {
  font-size: 1.1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem;
    width: 100%;
  }

  .timeline {
    padding: 1rem 0;
  }

  .timeline-line {
    left: 1rem;
  }

  .timeline-item {
    width: calc(100% - 2.5rem);
    padding-left: 2rem !important;
    padding-right: 0 !important;
    margin: 2rem 0;
    left: 0 !important;
  }

  .timeline-dot {
    left: calc(1rem - 8px) !important;
  }

  .timeline-card {
    max-width: 100%;
  }

  .timeline-image {
    height: 200px !important;
  }

  .content-body {
    padding: 1.2rem;
  }

  .timeline-title {
    font-size: 1.3rem;
  }

  .timeline-date {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .timeline-desc {
    font-size: 1rem;
    line-height: 1.5;
  }

  .timeline-link {
    display: inline-flex;
    width: auto;
    margin-top: 1rem;
    float: right;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  /* 优化小尺寸卡片在移动端的显示 */
  .size-small .timeline-image {
    height: 150px !important;
  }

  .size-small .timeline-title {
    font-size: 1.1rem;
  }

  .size-small .timeline-desc {
    font-size: 0.9rem;
  }

  /* 优化大尺寸卡片在移动端的显示 */
  .size-large .timeline-image {
    height: 230px !important;
  }

  .size-large .timeline-title {
    font-size: 1.4rem;
  }

  /* 调整卡片间距和阴影 */
  .timeline-card {
    margin: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .timeline-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

/* 针对更小屏幕的优化 */
@media (max-width: 480px) {
  .timeline-container {
    padding: 0.5rem;
  }

  .timeline-item {
    width: calc(100% - 2rem);
    padding-left: 1.5rem !important;
    padding-right: 0 !important;
  }

  .timeline-line {
    left: 0.8rem;
  }

  .timeline-dot {
    left: calc(0.8rem - 8px) !important;
    width: 14px;
    height: 14px;
  }

  .timeline-image {
    height: 180px !important;
  }

  .content-body {
    padding: 1rem;
  }

  .timeline-title {
    font-size: 1.2rem;
  }

  .timeline-date {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .timeline-desc {
    font-size: 0.95rem;
  }

  .timeline-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* 深色模式适配 */
:root.dark .timeline-card {
  background: var(--vp-c-bg-soft);
}

:root.dark .timeline-dot {
  box-shadow: 0 0 0 4px var(--vp-c-bg-soft);
}
</style>
