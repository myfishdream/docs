<template>
  <div class="doc-card-wrapper" :class="{ expanded: isExpanded }">
    <div class="doc-header" @click.prevent="toggleExpand">
      <div class="doc-title-wrapper">
        <h3 class="doc-title">{{ doc.title }}</h3>
      </div>
      <span v-if="doc.star" class="star-badge">
        <svg t="1740134539094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4065" width="25" height="25"><path d="M313.991837 914.285714c-20.37551 0-40.228571-6.269388-56.946939-18.808163-30.302041-21.942857-44.930612-58.514286-38.661225-95.085714l24.032654-141.061225c3.134694-18.285714-3.134694-36.571429-16.195919-49.110204L123.297959 509.910204c-26.644898-26.122449-36.04898-64.261224-24.555102-99.787755 11.493878-35.526531 41.795918-61.126531 78.889796-66.35102l141.583674-20.375511c18.285714-2.612245 33.959184-14.106122 41.795918-30.30204l63.216326-128.522449C440.946939 130.612245 474.383673 109.714286 512 109.714286s71.053061 20.897959 87.24898 54.334694L662.987755 292.571429c8.359184 16.195918 24.032653 27.689796 41.795918 30.30204l141.583674 20.375511c37.093878 5.22449 67.395918 30.82449 78.889796 66.35102 11.493878 35.526531 2.089796 73.665306-24.555102 99.787755l-102.4 99.787755c-13.061224 12.538776-19.330612 31.346939-16.195919 49.110204l24.032654 141.061225c6.269388 37.093878-8.359184 73.142857-38.661225 95.085714-30.302041 21.942857-69.485714 24.555102-102.4 7.314286L538.122449 836.440816c-16.195918-8.359184-35.526531-8.359184-51.722449 0l-126.955102 66.87347c-14.628571 7.314286-30.302041 10.971429-45.453061 10.971428z m162.481632-96.653061z" fill="#F2CB51" p-id="4066"></path></svg>
      </span>
      <span v-if="isMobile" class="expand-indicator">
         ▼
      </span>
    </div>

    <div v-show="!isMobile || isExpanded" class="doc-content">
      <a :href="doc.path" class="doc-card-link">
        <div class="doc-meta">
          <div class="doc-info">
           
            <span v-if="doc.author" class="doc-author">
               {{ doc.author }}
            </span>
            |
            <span v-if="doc.date" class="doc-date">
               {{ formatDate(doc.date) }}
            </span>
            
            <span v-if="doc.sticky > 0" class="doc-sticky">
              🔥 {{ doc.sticky }}
            </span>
          </div>
        </div>

        <div v-if="doc.description" class="doc-description">
          {{ doc.description }}
        </div>

        <div class="doc-footer">
          <div v-if="doc.category" class="doc-category">
            🗂️ {{ doc.category }}
          </div>
          <div v-if="doc.tags?.length" class="doc-tags">
            <span v-for="tag in doc.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  doc: {
    type: Object,
    required: true
  }
})

const isExpanded = ref(true)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const toggleExpand = () => {
  if (isMobile.value) {
    isExpanded.value = !isExpanded.value
  }
}

// 格式化创建日期
const formatDate = (date) => {
  if (!date) return ''
  date = date.split('#')[0].trim()
  const [year, month, day] = date.split('-').map(s => s.trim())
  return `${year}-${month}-${day}`
}

// // 格式化最后更新时间
// const formatLastUpdated = (timestamp) => {
//   if (!timestamp) return ''
//   return new Date(timestamp).toLocaleDateString('zh-CN', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   })
// }
</script>

<style scoped>
.doc-card-wrapper {
  padding: 16px;
  height: 100%;
  border: 2px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.doc-card-wrapper:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.doc-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.doc-content {
  position: relative;
  z-index: 1;
}

.doc-title-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.doc-title {
  margin: 0;
  font-size: 1.1em;
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.doc-meta {
  margin-bottom: 8px;
}

.doc-info {
  display: flex;
  gap: 12px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}
.doc-author{
  font-weight: 600;
}
.doc-description {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  line-height: 1.5;
}

.doc-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.doc-category {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.8em;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  color: var(--vp-c-text-1);
}

.star-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1.2em;
  color: #FFD700;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  z-index: 2;
}

.doc-sticky {
  font-size: 0.9em;
  color: var(--vp-c-brand);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 在 <style scoped> 中添加/修改移动端样式 */
@media (max-width: 768px) {
  .star-badge{
    top: -1px;
    right: 30px;
  }
  .doc-card-wrapper {
    border-width: 1px;
  }

  .doc-header {
    cursor: pointer;
    padding: 0px 12px;
    position: relative;
  }

  .doc-content {
    padding: 0 12px 12px;
  }

  /* 默认隐藏内容 */
  .doc-meta,
  .doc-description,
  .doc-footer {
    display: block;
  }

  /* 标题样式调整 */
  .doc-title {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expand-indicator {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: var(--vp-c-text-2);
    opacity: 0.5;
    transition: transform 0.3s;
  }

  .doc-card-wrapper.expanded .expand-indicator {
    transform: translateY(-50%) rotate(180deg);
  }
}
</style> 