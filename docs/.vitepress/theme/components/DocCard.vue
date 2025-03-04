<template>
  <div class="doc-card-wrapper" :class="{ expanded: isExpanded }">
    <div class="doc-header" @click.prevent="toggleExpand">
      <div class="doc-title-wrapper">
        <h3 class="doc-title">{{ doc.title }}</h3>
      </div>
      <span v-if="doc.star" class="star-badge">
        <svg t="1740134539094" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4065" width="25" height="25">
          <path
            d="M313.991837 914.285714c-20.37551 0-40.228571-6.269388-56.946939-18.808163-30.302041-21.942857-44.930612-58.514286-38.661225-95.085714l24.032654-141.061225c3.134694-18.285714-3.134694-36.571429-16.195919-49.110204L123.297959 509.910204c-26.644898-26.122449-36.04898-64.261224-24.555102-99.787755 11.493878-35.526531 41.795918-61.126531 78.889796-66.35102l141.583674-20.375511c18.285714-2.612245 33.959184-14.106122 41.795918-30.30204l63.216326-128.522449C440.946939 130.612245 474.383673 109.714286 512 109.714286s71.053061 20.897959 87.24898 54.334694L662.987755 292.571429c8.359184 16.195918 24.032653 27.689796 41.795918 30.30204l141.583674 20.375511c37.093878 5.22449 67.395918 30.82449 78.889796 66.35102 11.493878 35.526531 2.089796 73.665306-24.555102 99.787755l-102.4 99.787755c-13.061224 12.538776-19.330612 31.346939-16.195919 49.110204l24.032654 141.061225c6.269388 37.093878-8.359184 73.142857-38.661225 95.085714-30.302041 21.942857-69.485714 24.555102-102.4 7.314286L538.122449 836.440816c-16.195918-8.359184-35.526531-8.359184-51.722449 0l-126.955102 66.87347c-14.628571 7.314286-30.302041 10.971429-45.453061 10.971428z m162.481632-96.653061z"
            fill="#F2CB51" p-id="4066"></path>
        </svg>
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
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16"
                height="16">
                <path
                  d="M510.862222 665.031111c485.546667 0 480.711111 307.427556 480.711111 307.427556a43.349333 43.349333 0 0 1-44.032 50.517333H74.069333c-27.989333 0-48.810667-22.926222-44.032-50.517333 0 0-4.835556-307.370667 480.768-307.370667zM510.634667 0.512h304.014222V307.2c0 169.415111-136.135111 306.801778-304.014222 306.801778-167.879111 0-304.014222-137.386667-304.014223-306.801778 0-169.415111 136.135111-306.744889 304.014223-306.744889z"
                  fill="#467CFD"></path>
              </svg>
              {{ doc.author }}
            </span>
            |
            <span v-if="doc.date" class="doc-date">
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16"
                height="16">
                <path
                  d="M825.582656 99.902439V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H548.908401V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H272.012141V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813S198.417344 14.929864 198.417344 33.300813v66.601626C115.165312 103.676531 48.563686 169.445637 48.563686 249.756098v624.390243c0 82.641518 70.320217 149.853659 156.791328 149.853659h613.289972c86.471111 0 156.791328-67.212141 156.791328-149.853659V249.756098c0-80.310461-66.601626-146.079566-149.853658-149.853659zM198.417344 177.937344V244.205962c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h202.857453v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h203.079458v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.686396-14.929864 36.686396-33.300813V177.937344c40.238482 3.330081 72.151762 34.244336 72.151761 71.818754v99.902439H126.265583V249.756098c0-37.574417 31.635772-68.488672 72.151761-71.818754zM818.644986 946.298103H205.355014c-43.624065 0-79.089431-32.35729-79.089431-72.151762V416.260163h771.468834v457.886178c0 39.794472-35.465366 72.151762-79.089431 72.151762z"
                  fill="#467CFD"></path>
                <path
                  d="M470.373984 671.566396q43.069051-14.041843 43.124553-55.112846v-46.954146a48.508184 48.508184 0 0 0-27.750678-46.010624A137.865366 137.865366 0 0 0 420.422764 508.836423q-92.96477 0-92.964769 60.551978V627.165312h73.927804v-57.277399q0-10.267751 15.595881-10.26775t15.096369 10.26775v60.551979c0 13.375827-5.550136 20.035989-29.526721 20.035989v38.850948c13.764336 0 16.983415 1.609539 22.200542 4.88412s7.548184 9.43523 7.548184 18.481951v79.200433q0 12.654309-15.096368 12.654309t-15.096369-12.654309V715.96748H325.515447v76.036856q0 64.881084 95.184824 64.881084Q514.775068 856.996423 514.775068 785.732683v-50.78374q0-51.782764-44.401084-63.382547zM626.610298 511.944499a43.069051 43.069051 0 0 1-12.487805 27.417669 39.350461 39.350461 0 0 1-30.636748 14.097344v49.95122h31.746775v250.644119h83.252033V511.944499z"
                  fill="#8BAEF7"></path>
              </svg>
              {{ formatDate(doc.date) }}
            </span>
            |
            <span v-if="doc.sticky > 0" class="doc-sticky">
              <svg t="1741083763681" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="13326"
                data-spm-anchor-id="a313x.search_index.0.i63.7b953a81PNispq" width="22" height="22">
                <path
                  d="M576 452.266667v422.4h-85.333333v-422.4l-89.6 89.6L341.333333 477.866667l192-192 192 192-59.733333 59.733333-89.6-85.333333z m213.333333-217.6h-512v-85.333334h512v85.333334z"
                  fill="#13227a" p-id="13327" data-spm-anchor-id="a313x.search_index.0.i62.7b953a81PNispq" class="">
                </path>
              </svg>
              {{ doc.sticky }}
            </span>
          </div>
        </div>

        <div v-if="doc.description" class="doc-description">
          {{ doc.description }}
        </div>

        <div class="doc-footer">
          <div v-if="doc.category" class="doc-category">
            <svg t="1741082900451" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="4286" width="20" height="20">
              <path
                d="M422.4 224c6.4 6.4 19.2 19.2 25.6 25.6C499.2 294.4 556.8 416 640 416l256 0 0 384L128 800l0-448 0-128L422.4 224M448 96 64 96c-38.4 0-64 25.6-64 64l0 192 0 512c0 19.2 6.4 32 19.2 44.8 12.8 12.8 25.6 19.2 44.8 19.2l832 0 64 0c38.4 0 64-25.6 64-64l0-512c0-38.4-25.6-64-64-64l-320 0c-51.2 0-102.4-140.8-153.6-179.2C473.6 102.4 460.8 96 448 96L448 96z"
                p-id="4287"></path>
            </svg>
            {{ doc.category }}
          </div>
          <div v-if="doc.tags?.length" class="doc-tags">
            <span v-for="tag in doc.tags" :key="tag" class="tag">
              {{ tag }}
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
  border-radius: 15px;
  /* background: var(--vp-c-bg-soft); */
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
  color: var(--vp-c-brand);
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

.doc-author {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.doc-date {
  display: flex;
  align-items: center;
  gap: 4px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doc-category {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.doc-category svg {
  fill: var(--vp-c-brand);
}

.dark .doc-category svg {
  fill: var(--vp-c-brand);
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 2;
}

.doc-sticky {
  font-size: 0.9em;
  color: var(--vp-c-brand);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-sticky svg {
  fill: var(--vp-c-brand);
}

.dark .doc-sticky svg {
  fill: var(--vp-c-brand);
}

/* 在 <style scoped> 中添加/修改移动端样式 */
@media (max-width: 768px) {
  .star-badge {
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