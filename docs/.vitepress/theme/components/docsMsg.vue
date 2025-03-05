<template>
  <div class="docs-msg" v-if="showCard">
    <div class="card">
      <div class="card-content">
        <div class="info-group">
          <div class="title-row">
            <span class="title">{{ frontmatter.title }}</span>
            <div class="share-wrapper">
              <button class="share-btn" @click="copyPageUrl" :class="{ copied: isCopied }">
                {{ isCopied ? '已复制' : '分享' }}        
              </button>
            </div>
          </div>
          <div class="meta-info">
            <span class="info-item">
              <span class="label">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M825.582656 99.902439V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H548.908401V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813s-36.908401 14.929864-36.908401 33.300813v66.601626H272.012141V33.300813c0-18.370949-16.650407-33.300813-36.908401-33.300813S198.417344 14.929864 198.417344 33.300813v66.601626C115.165312 103.676531 48.563686 169.445637 48.563686 249.756098v624.390243c0 82.641518 70.320217 149.853659 156.791328 149.853659h613.289972c86.471111 0 156.791328-67.212141 156.791328-149.853659V249.756098c0-80.310461-66.601626-146.079566-149.853658-149.853659zM198.417344 177.937344V244.205962c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h202.857453v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.908401-14.929864 36.908401-33.300813V177.604336h203.079458v66.601626c0 18.370949 16.650407 33.300813 36.908401 33.300813s36.686396-14.929864 36.686396-33.300813V177.937344c40.238482 3.330081 72.151762 34.244336 72.151761 71.818754v99.902439H126.265583V249.756098c0-37.574417 31.635772-68.488672 72.151761-71.818754zM818.644986 946.298103H205.355014c-43.624065 0-79.089431-32.35729-79.089431-72.151762V416.260163h771.468834v457.886178c0 39.794472-35.465366 72.151762-79.089431 72.151762z" fill="#467CFD"></path>
                  <path d="M470.373984 671.566396q43.069051-14.041843 43.124553-55.112846v-46.954146a48.508184 48.508184 0 0 0-27.750678-46.010624A137.865366 137.865366 0 0 0 420.422764 508.836423q-92.96477 0-92.964769 60.551978V627.165312h73.927804v-57.277399q0-10.267751 15.595881-10.26775t15.096369 10.26775v60.551979c0 13.375827-5.550136 20.035989-29.526721 20.035989v38.850948c13.764336 0 16.983415 1.609539 22.200542 4.88412s7.548184 9.43523 7.548184 18.481951v79.200433q0 12.654309-15.096368 12.654309t-15.096369-12.654309V715.96748H325.515447v76.036856q0 64.881084 95.184824 64.881084Q514.775068 856.996423 514.775068 785.732683v-50.78374q0-51.782764-44.401084-63.382547zM626.610298 511.944499a43.069051 43.069051 0 0 1-12.487805 27.417669 39.350461 39.350461 0 0 1-30.636748 14.097344v49.95122h31.746775v250.644119h83.252033V511.944499z" fill="#8BAEF7"></path>
                </svg>
              </span>
              <span>{{ formatDate(frontmatter.date) }}</span>
            </span>
            <span class="divider">|</span>
            <span class="info-item">
              <span class="label">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M510.862222 665.031111c485.546667 0 480.711111 307.427556 480.711111 307.427556a43.349333 43.349333 0 0 1-44.032 50.517333H74.069333c-27.989333 0-48.810667-22.926222-44.032-50.517333 0 0-4.835556-307.370667 480.768-307.370667zM510.634667 0.512h304.014222V307.2c0 169.415111-136.135111 306.801778-304.014222 306.801778-167.879111 0-304.014222-137.386667-304.014223-306.801778 0-169.415111 136.135111-306.744889 304.014223-306.744889z" fill="#467CFD"></path>
                </svg>
              </span>
              <a class="author-link" href="/index/about-me.html">{{ frontmatter.author }}</a>
            </span>
            <span class="divider">|</span>
            <span class="info-item">
              <span class="label">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z" fill="#FFE9B4"></path>
                  <path d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z" fill="#FFB02C"></path>
                  <path d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z" fill="#FFCA28"></path>
                </svg>
              </span>
              <span>{{ frontmatter.category }}</span>
            </span>
            <span class="divider" v-if="frontmatter.tags.length<=5 || frontmatter.aside !== 'right'">|</span>
            <span class="info-item tags" v-if="frontmatter.tags && frontmatter.tags.length">
              <span class="label">
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M995.125144 559.61812l-415.998603-415.998602A52.986489 52.986489 0 0 0 541.413335 127.99957H338.847348c-3.166656-26.559911-9.286635-51.046495-17.999939-71.333094C299.734146 7.333309 271.154242 0 256.00096 0c-13.939953 0-40.439864 6.339979-61.259794 48.806503-10.473298 21.366595-17.946606 48.966502-21.573261 79.193067H53.334974a53.393154 53.393154 0 0 0-53.333154 53.333154v360.078791a52.986489 52.986489 0 0 0 15.619948 37.713206l415.998602 415.998603a53.333154 53.333154 0 0 0 75.426413 0l26.286579-26.293245 26.286578 26.293245a53.426487 53.426487 0 0 0 16.719944 11.333295 21.333262 21.333262 0 0 0 36.079879 11.293295l382.705381-382.705381a53.399821 53.399821 0 0 0 0-75.426413z" fill="#ffd679"></path>
                </svg>
              </span>
              <span v-for="tag in frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import { computed, ref, onMounted, watch } from 'vue'
import { onContentUpdated } from 'vitepress/client'

const { frontmatter } = useData()
const route = useRoute()
const isCopied = ref(false)

// 验证所有必需的字段是否存在且有值
const showCard = computed(() => {
  if (!frontmatter.value) return false
  
  const requiredFields = {
    title: '标题',
    author: '作者',
    category: '主题',
    tags: '标签'
  }

  // 检查每个必需字段
  for (const [field, name] of Object.entries(requiredFields)) {
    if (!frontmatter.value[field]) {
      return false
    }

    // 特殊处理标签数组
    if (field === 'tags' && (!Array.isArray(frontmatter.value.tags) || frontmatter.value.tags.length === 0)) {
      return false
    }
  }

  return true
})

// 移除标题的函数
const removeTitle = () => {
  if (import.meta.env.SSR || !showCard.value) return

  const selectors = [
    '.vp-doc h1:first-of-type',
    '.content h1:first-of-type',
    '#VPContent h1:first-of-type',
    '.VPDoc h1:first-of-type'
  ]
  
  for (const selector of selectors) {
    const h1 = document?.querySelector(selector)
    if (h1) {
      h1.style.display = 'none'
      break
    }
  }
}

// 监听内容更新
onContentUpdated(() => {
  removeTitle()
})

// 格式化创建日期
const formatDate = (date) => {
  if (!date) return ''
  date = date.split('#')[0].trim()
  const [year, month, day] = date.split('-').map(s => s.trim())
  return `${year}-${month}-${day}`
}

// 复制页面链接
const copyPageUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.docs-msg {
  margin: 1rem 0;
}

.card {
  padding: 0.8rem 1.5rem;
  border-bottom: 2px solid var(--vp-c-brand-soft);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.share-wrapper {
  position: relative;
  flex-shrink: 0;
}

.title {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-size: 1.5rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-width: 0; /* 防止内容溢出 */
}

.divider {
  color: var(--vp-c-divider);
  padding: 0 0.2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

.label {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
}

.label .icon {
  margin-right: 2px;
}

.author-link:hover {
  color: var(--vp-c-brand);
}

.tags {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--vp-c-brand-soft);
  padding: 0.1rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85em;
}

.share-btn {
  padding: 4px 12px;
  border: none;
  color: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85em;
  white-space: nowrap;
}

.icon {
  display: inline-block;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

@media (max-width: 639px) {
  .card-content {
    flex-direction: column;
    align-items: stretch;
  }

  .share-wrapper {
    align-self: flex-end;
  }

  .title {
    font-size: 1.3rem;
  }

  .title-row {
    gap: 0.5rem;
  }
  
  /* .divider {
    display: none;
  } */
  
  .meta-info {
    gap: 0.7rem;
  }
}

@media (min-width: 640px) {
  .card-content {
    flex-direction: column;
  }

  .info-group {
    gap: 0.5rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .title-row {
    gap: 2rem;
  }
}
</style>
