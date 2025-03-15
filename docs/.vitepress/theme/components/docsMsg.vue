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
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16"
                  height="16">
                  <path
                    d="M512 42.666667C252.793333 42.666667 42.666667 252.793333 42.666667 512s210.126667 469.333333 469.333333 469.333333 469.333333-210.126667 469.333333-469.333333S771.206667 42.666667 512 42.666667z m0 853.333333C294.4 896 128 729.6 128 512S294.4 128 512 128s384 166.4 384 384-166.4 384-384 384z"
                    fill="#467CFD" />
                  <path
                    d="M512 256c-25.6 0-42.666667 17.066667-42.666667 42.666667v213.333333c0 12.8 4.266667 21.333333 12.8 29.866667l149.333334 149.333333c17.066667 17.066667 42.666667 17.066667 59.733333 0s17.066667-42.666667 0-59.733333L554.666667 494.933333V298.666667c0-25.6-17.066667-42.666667-42.666667-42.666667z"
                    fill="#8BAEF7" />
                </svg>
              </span>
              <span>{{ formatDate(frontmatter.date) }}</span>
            </span>
            <template v-if="showLastUpdated">
              <span class="info-item">
                <span class="label">
                  <svg t="1742010464405" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="12827" width="16" height="16">
                    <path
                      d="M974.72 315.328A465.28 465.28 0 0 1 230.4 847.552a46.528 46.528 0 0 1 64.512-67.136 372.352 372.352 0 0 0 595.456-425.728 372.288 372.288 0 0 0-683.2 19.328l63.104 5.312a23.296 23.296 0 0 1 17.152 36.48L163.584 593.984a46.336 46.336 0 0 1-41.6 19.776 41.6 41.6 0 0 1-35.776-26.88L12.864 391.04a23.296 23.296 0 0 1 23.744-31.424l74.496 6.272a465.344 465.344 0 0 1 863.68-50.56z m-444.992-82.56c24.32 0 44.608 18.752 46.4 43.008l0.128 3.52V508.16l139.52 79.808c21.056 12.032 29.312 38.336 18.944 60.288l-1.664 3.2a46.528 46.528 0 0 1-60.288 19.008l-3.2-1.728L518.272 582.4a69.76 69.76 0 0 1-35.008-56l-0.128-4.672V279.296a46.528 46.528 0 0 1 46.528-46.592z"
                      p-id="12828"></path>
                  </svg>
                </span>
                <span class="last-updated" :title="fullDateTime">{{ lastUpdatedDate }}</span>
              </span>
            </template>
            <span class="divider desktop-only">|</span>
            <span class="info-item ">
              <span class="label">
                <svg t="1742009677876" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="3093" width="16" height="16">
                  <path
                    d="M972.8 972.8C972.8 1001.1136 949.9136 1024 921.6 1024 893.2864 1024 870.4 1001.1136 870.4 972.8 870.4 775.2192 709.5808 614.4 512 614.4 314.4192 614.4 153.6 775.2192 153.6 972.8 153.6 1001.1136 130.7136 1024 102.4 1024 74.0864 1024 51.2 1001.1136 51.2 972.8 51.2 785.0496 164.1984 623.4624 325.5808 551.7312 251.2896 495.6672 202.496 407.4496 202.496 307.2 202.496 137.5232 340.0704 0 509.696 0 679.3728 0 816.896 137.5232 816.896 307.2 816.896 406.6816 768.8704 494.1824 695.5008 550.3488 858.5216 621.4144 972.8 783.9232 972.8 972.8ZM509.696 102.4C396.8 102.4 304.896 194.2528 304.896 307.2 304.896 420.1472 396.8 512 509.696 512 622.6432 512 714.496 420.1472 714.496 307.2 714.496 194.2528 622.6432 102.4 509.696 102.4Z"
                    fill="#bfbfbf" p-id="3094"></path>
                </svg>
              </span>
              <a class="author-link" href="/index/about-me.html">{{ frontmatter.author }}</a>
            </span>
            <span class="divider">|</span>
            <span class="info-item">
              <span class="label">
                <svg t="1742009837838" class="icon" viewBox="0 0 1260 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="8096" width="16" height="16">
                  <path
                    d="M1171.561026 935.253333H88.746667V246.285128h1082.814359zM88.746667 88.746667h398.047179L508.849231 157.538462h-420.102564zM1171.561026 157.538462H601.796923l-30.982564-96.098462A88.221538 88.221538 0 0 0 486.793846 0H88.746667A88.746667 88.746667 0 0 0 0 88.746667v846.506666a88.746667 88.746667 0 0 0 88.746667 88.746667h1082.814359A88.746667 88.746667 0 0 0 1260.307692 935.253333V246.285128A88.746667 88.746667 0 0 0 1171.561026 157.538462z"
                    fill="#5E5C5C" p-id="8097"></path>
                </svg>
              </span>
              <span>{{ frontmatter.category }}</span>
            </span>
            <span class="divider desktop-only"
              v-if="frontmatter.tags.length <= 5 || frontmatter.aside !== 'right'">|</span>
            <span class="info-item tags desktop-only" v-if="frontmatter.tags && frontmatter.tags.length">
              <span class="label" v-if="frontmatter.tags.length <= 5 || frontmatter.aside !== 'right'">
                <svg t="1742009906375" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="10099" width="16" height="16">
                  <path
                    d="M163.229994 1023.786711c-19.537263 0-37.197584-7.934347-49.738971-22.224703-11.389627-13.053281-17.404374-30.031077-17.404374-49.141762V85.315559c0-47.051531 38.264028-85.315559 85.315559-85.315559h682.524474c47.051531 0 85.315559 38.264028 85.315559 85.315559v867.062029c0 40.652864-28.794001 71.323808-66.972714 71.323808-10.707103 0-21.499521-2.431493-32.035992-7.12385l-304.149969-178.48015c-7.251823-3.241991-36.173797-3.369965-43.340304-0.127973L195.052697 1016.748177a77.637159 77.637159 0 0 1-31.822703 7.038534zM181.402208 85.315559v844.197459l286.788252-169.522016c20.006499-8.872818 41.50602-10.74976 56.009665-10.749761 14.674276 0 36.429744 1.9196 56.692189 10.96305l283.077026 169.05278V85.315559H181.402208z"
                    fill="#5B5B5B" p-id="10100"></path>
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
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { onContentUpdated } from 'vitepress/client'

const { frontmatter } = useData()
const route = useRoute()
const isCopied = ref(false)
const fullDateTime = ref('')
const showLastUpdated = ref(false)
const lastUpdatedDate = ref('')

// 处理最后更新时间的函数
const processLastUpdated = () => {
  if (import.meta.env.SSR) return

  const lastUpdatedElement = document?.querySelector('.VPLastUpdated')
  if (!lastUpdatedElement) return

  const fullText = lastUpdatedElement.textContent.replace('最后更新于：', '')

  // 存储完整时间用于title显示
  fullDateTime.value = fullText

  // 解析创建时间和更新时间
  const createDate = formatDate(frontmatter.value.date)
  const updateMatch = fullText.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/)

  if (updateMatch) {
    const [_, year, month, day] = updateMatch
    const updateDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    // 比较创建时间和更新时间是否在同一天
    showLastUpdated.value = createDate !== updateDate

    if (showLastUpdated.value) {
      lastUpdatedDate.value = updateDate
    }
  }

  // 隐藏原始元素
  lastUpdatedElement.style.display = 'none'
}

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
onMounted(() => {
  if (showCard) {
    const h2 = document.querySelector('.vp-doc h2');
    console.log(h2);
    h2.style.paddingTop = "0px";
  }
})

// 移除标题并处理最后更新时间
const processPage = () => {
  if (import.meta.env.SSR || !showCard.value) return

  // 移除标题
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

  // 处理最后更新时间
  nextTick(() => {
    processLastUpdated()
  })
}

// 监听内容更新
onContentUpdated(() => {
  processPage()
})

// 格式化创建日期
const formatDate = (date) => {
  if (!date) return ''
  date = date.split('#')[0].trim()
  const [year, month, day] = date.split('-').map(s => s.trim())
  // 确保月和日是两位数
  const formattedMonth = month.padStart(2, '0')
  const formattedDay = day.padStart(2, '0')
  return `${year}-${formattedMonth}-${formattedDay}`
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

// 使用watch监听路由变化
const currentRoute = ref(route.path)
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath
  processPage()
})

onMounted(() => {
  processPage()
})
</script>

<style scoped>
.docs-msg {
  margin: 1rem 0;
}

.card {
  padding: 0.8rem 0;
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
  color: var(--vp-c-text-1);
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
  min-width: 0;
  /* 防止内容溢出 */
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

.icon path {
  fill: var(--vp-c-brand);
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
  .desktop-only {
    display: none !important;
  }

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

.last-updated-wrapper {
  color: var(--vp-c-text-2);
}

.last-updated {
  color: var(--vp-c-text-1);
  cursor: help;
}
</style>
