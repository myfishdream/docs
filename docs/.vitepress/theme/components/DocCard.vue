<template>
  <div class="doc-card-wrapper">
    <div class="doc-tools">
      <div class="doc-circle">
        <span class="doc-box red"></span>
      </div>
      <div class="doc-circle">
        <span class="doc-box yellow"></span>
      </div>
      <div class="doc-circle">
        <span class="doc-box green"></span>
      </div>
    </div>

    <div class="doc-header">
      <div class="doc-title-wrapper">
        <h3 class="doc-title">{{ doc.title }}
          <span v-if="doc.star" class="star-badge">
            <svg t="1741495537850" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3915" width="20" height="20"><path d="M512 0c-15.990154 0-30.72 9.609846-37.100308 24.300308L349.459692 307.830154 35.209846 371.2c-14.729846 3.229538-26.230154 14.099692-30.72 28.199385C0 413.459692 3.859692 428.819692 14.729846 439.689846l218.899692 220.199385-61.44 315.510154c-2.56 15.399385 1.299692 30.050462 12.8 39.620923C192 1020.809846 201.609846 1024 210.589538 1024c5.750154 0 11.539692-1.220923 16.620308-3.899077L512 893.44l285.420308 126.700308C802.579692 1022.779077 807.699692 1024 813.410462 1024c8.979692 0 17.959385-3.190154 24.969846-9.019077 12.209231-8.900923 15.990154-24.221538 13.508923-39.620923l-61.518769-315.510154 218.860308-220.199385c10.870154-10.24 14.769231-26.269538 10.279385-40.290462-4.489846-14.099692-15.990154-24.969846-30.680615-28.199385l-314.249846-63.330462-125.479385-283.529846C542.759385 9.609846 528.029538 0 512 0zM512 177.270154l74.870154 169.590154c12.8 28.790154 38.360615 49.270154 68.489846 55.020308l213.740308 42.889846-146.550154 147.180308c-22.449231 22.370462-32.019692 54.980923-26.269538 86.370462l40.920615 210.628923-186.840615-83.219692c-12.130462-5.750154-24.930462-8.349538-38.360615-8.349538-13.430154 0-26.269538 2.56-39.030154 8.349538L286.72 888.989538l40.999385-210.628923c5.750154-31.389538-3.859692-64-26.269538-86.370462l-146.550154-147.180308 213.740308-42.889846c30.089846-5.750154 55.689846-26.230154 68.489846-55.020308L512 177.270154z" p-id="3916"></path></svg>
          </span>
        </h3>
      </div>
    </div>

    <div class="doc-content">
      <a :href="doc.path" class="doc-card-link">
        <div class="doc-meta">
          <div class="doc-info">
            <span v-if="doc.author" class="doc-author info-item">
              <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16"
                height="16">
                <path
                  d="M510.862222 665.031111c485.546667 0 480.711111 307.427556 480.711111 307.427556a43.349333 43.349333 0 0 1-44.032 50.517333H74.069333c-27.989333 0-48.810667-22.926222-44.032-50.517333 0 0-4.835556-307.370667 480.768-307.370667zM510.634667 0.512h304.014222V307.2c0 169.415111-136.135111 306.801778-304.014222 306.801778-167.879111 0-304.014222-137.386667-304.014223-306.801778 0-169.415111 136.135111-306.744889 304.014223-306.744889z"
                  fill="#467CFD"></path>
              </svg>
              {{ doc.author }}
            </span>
            
            <span v-if="doc.date" class="doc-date info-item">
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
            <span v-if="doc.sticky > 0" class="doc-sticky info-item">
              <svg t="1741087698608" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="23873" width="20" height="20">
                <path
                  d="M511.998 360.649c-41.727 0-75.676 33.949-75.676 75.676S470.271 512 511.998 512s75.676-33.949 75.676-75.676-33.949-75.675-75.676-75.675z m0 94.594c-10.434 0-18.919-8.49-18.919-18.919s8.485-18.919 18.919-18.919c10.434 0 18.919 8.49 18.919 18.919 0 10.43-8.485 18.919-18.919 18.919z"
                  fill="#787878" p-id="23874"></path>
                <path
                  d="M717.441 580.327v-85.385c0-78.022-22.374-134.936-64.701-200.367-28.166-43.538-64.267-80.78-106.054-110.41-11.182-7.926-22.706-15.385-34.688-22.166-11.977 6.781-23.501 14.24-34.683 22.166-41.787 29.63-77.888 66.872-106.054 110.41-42.327 65.431-64.701 122.345-64.701 200.367v85.385l-37.353 75.195v87.066h485.587v-87.066l-37.353-75.195z m-19.404 105.504H325.963v-6.808l37.353-75.195V494.942c0-67.057 19.228-113.31 55.597-169.54 24.651-38.101 56.327-70.613 93.084-96.262 36.757 25.649 68.438 58.161 93.089 96.262 36.369 56.23 55.597 102.484 55.597 169.54v108.885l37.353 75.195v6.809zM512.002 799.165c-22.425-11.455-36.803-25.318-53.916-41.219h-80.692c35.565 41.364 72.105 75.075 122.673 98.521L512.002 862l11.935-5.533c50.563-23.445 87.098-57.154 122.664-98.521h-80.683c-17.112 15.9-31.491 29.764-53.916 41.219z"
                  fill="#787878" p-id="23875"></path>
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

// 格式化创建日期
// 修改日期格式化函数
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    // 移除注释并清理空格
    const cleanDate = dateStr.split('#')[0].trim()
    // 分割日期部分
    const [year, month, day] = cleanDate.split('-').map(s => s.trim())
    
    // 月份名称映射
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    
    // 获取月份名称
    const monthName = monthNames[parseInt(month) - 1]
    
    // 返回格式化后的日期
    return `${monthName} ${parseInt(day)}, ${year}`
  } catch (e) {
    console.warn('日期格式无效：', dateStr)
    return dateStr
  }
}
</script>

<style scoped>
.doc-card-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.doc-tools {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.doc-circle {
  padding: 0 3px;
}

.doc-box {
  display: inline-block;
  align-items: center;
  width: 10px;
  height: 10px;
  padding: 1px;
  border-radius: 50%;
}

.doc-box.red {
  background-color: #ff605c;
}

.doc-box.yellow {
  background-color: #ffbd44;
}

.doc-box.green {
  background-color: #00ca4e;
}

.doc-header {
  padding: 12px 16px 0;
}

.doc-content {
  padding: 12px 16px;
}

.doc-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1em;
  font-weight: 600;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
}

.star-badge {
  display: inline-flex;
  align-items: center;
  margin-top: 2px;
}

.star-badge .icon {
  width: 20px;
  height: 20px;
}
.star-badge .icon path {
  fill: #ff605c;
}

.doc-meta {
  margin-top: 6px;
  margin-bottom: 6px;
}

.doc-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.85em;
  color: #64748b;
}

.info-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.info-item:not(:last-child) {
  padding-right: 12px;
  margin-right: 6px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

:root.dark .info-item:not(:last-child) {
  border-right-color: rgba(255, 255, 255, 0.2);
}

.doc-author {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-author .icon path {
  fill: var(--vp-c-text-2);
}

.doc-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-date .icon path {
  fill: var(--vp-c-text-2);
}

.doc-sticky {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.doc-category {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
  color: #64748b;
  margin-bottom: 0;
}

.doc-category svg {
  fill: var(--vp-c-text-2);
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.75em;
  padding: 3px 10px;
  background: #f1f5f9;
  border-radius: 16px;
  color: #475569;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* 调整图标大小和对齐 */
.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  vertical-align: middle;
}

.doc-description {
  margin: 8px 0;
  color: #64748b;
  font-size: 0.85em;
  line-height: 1.5;
}

.doc-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.doc-card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.08);
}

/* 深色模式适配 */
:root.dark .doc-card-wrapper {
  background-color: #1a1a1a;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.05);
}

:root.dark .doc-tools {
  background-color: #2a2a2a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark .doc-title {
  color: rgba(255, 255, 255, 0.95);
}

:root.dark .doc-info,
:root.dark .doc-description {
  color: rgba(255, 255, 255, 0.6);
}

:root.dark .doc-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

:root.dark .tag {
  background-color: #2a2a2a;
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .doc-card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.4),
    0 4px 6px -2px rgba(0, 0, 0, 0.3);
  background-color: #202020;
  border-color: rgba(255, 255, 255, 0.08);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .doc-card-wrapper {
    margin: 4px;
  }

  .doc-tools {
    padding: 6px;
  }

  .doc-box {
    width: 8px;
    height: 8px;
  }

  .doc-header {
    padding: 10px 12px 0;
  }

  .doc-content {
    padding: 10px 12px;
  }

  .doc-title {
    font-size: 0.9em;
  }

  .doc-info {
    gap: 4px;
  }

  .info-item:not(:last-child) {
    padding-right: 8px;
    margin-right: 4px;
  }

  .doc-description {
    font-size: 0.8em;
  }
}
</style>