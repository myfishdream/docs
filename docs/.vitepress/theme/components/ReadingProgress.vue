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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const remainingTime = ref(0)
const totalWords = ref(0)
const circumference = 2 * Math.PI * 16
const dashOffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const updateProgress = () => {
  const scrolled = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = (scrolled / height) * 100
  
  const content = document.querySelector('.content')
  if (content) {
    const text = content.textContent.replace(/\s+/g, '')
    totalWords.value = text.length
    const wordsPerMinute = 300
    const totalMinutes = Math.ceil(totalWords.value / wordsPerMinute)
    remainingTime.value = Math.ceil(totalMinutes * (1 - progress.value / 100))
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  setTimeout(updateProgress, 1000)
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
  /* background: linear-gradient(90deg, #42b883, #35495e); */
  background: linear-gradient(90deg, var(--bear-bg-color2), var(--bear-bg-color1));
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
  /* background: #42b883; */
  background: var(--bear-bg-color1);
  border-radius: 50%;
  /* box-shadow: 0 0 10px #42b883; */
  box-shadow: 0 0 10px var(--bear-bg-color2);
}

.progress-info {
  flex-direction: column;
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
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

.progress-circle {
  width: 36px;
  height: 36px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .progress-info {
    right: 10px;
    bottom: 10px;
    padding: 8px;
  }
  
  .progress-circle {
    width: 32px;
    height: 32px;
  }
  
  .info-container {
    display: none;
  }
}
</style> 