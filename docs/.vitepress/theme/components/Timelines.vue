<template>
  <div class="timeline-wrapper">
    <div class="timeline">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <div class="timeline-item-tail" v-if="index !== items.length - 1" />
        <div class="timeline-item-head" :class="[
          `timeline-item-head-${item.type || 'blue'}`,
          { 'timeline-item-head-custom': item.dot || item.type === 'time' }
        ]">
          <slot :name="'dot-' + index">
            <template v-if="item.type === 'time'">
              <svg t="1740273400756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9022" width="16" height="16"><path d="M518.4 995.2c-264 0-478.4-214.4-478.4-478.4S254.4 38.4 518.4 38.4s478.4 214.4 478.4 478.4-214.4 478.4-478.4 478.4z m0-894.4c-228.8 0-416 187.2-416 416s187.2 416 416 416 416-187.2 416-416c0-230.4-185.6-416-416-416z" fill="#1296db" p-id="9023" data-spm-anchor-id="a313x.search_index.0.i8.731b3a81arPgWm" class=""></path><path d="M620.8 652.8c-6.4 0-12.8-1.6-17.6-6.4L476.8 560c-8-6.4-14.4-16-14.4-25.6V316.8c0-17.6 14.4-32 32-32s32 14.4 32 32v200l112 78.4c14.4 9.6 17.6 30.4 8 44.8-4.8 8-16 12.8-25.6 12.8z" fill="#229BFF" p-id="9024"></path></svg>
            </template>
            <span v-else-if="item.dot" v-html="item.dot"></span>
          </slot>
        </div>
        <div class="timeline-item-content"> 
          <div class="content-header">
            <span class="content-title">{{ item.title }}</span>
            <div class="content-time">
              <span>{{ item.time }}</span>
            </div>
          </div>
          <div v-if="item.content" class="content-body">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>

<style scoped>
.timeline-wrapper {
  padding: 8px 0;
}

.timeline {
  box-sizing: border-box;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline-item {
  position: relative;
  margin: 0;
  padding-bottom: 20px;
  font-size: 14px;
  list-style: none;
  padding: 0 0 20px 20px;
}

.timeline-item-tail {
  position: absolute;
  top: 10px;
  left: 4px;
  height: calc(100% - 10px);
  border-left: 2px solid var(--vp-c-divider);
}

.timeline-item-head {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--vp-c-bg);
  border: 2px solid transparent;
  border-radius: 100px;
  left: 0;
}

.timeline-item-head-blue {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.timeline-item-head-green {
  border-color: var(--vp-c-green-1);
  color: var(--vp-c-green-1);
}

.timeline-item-head-red {
  border-color: var(--vp-c-red-1);
  color: var(--vp-c-red-1);
}

.timeline-item-head-gray {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-3);
}

.timeline-item-head-custom {
  position: absolute;
  text-align: center;
  line-height: 1;
  margin-top: 0;
  border: 0;
  height: auto;
  border-radius: 0;
  padding: 3px 1px;
  transform: translate(-50%, -50%);
  top: 5.5px;
  left: 5px;
  width: auto;
}

.timeline-item-head-time {
  color: var(--vp-c-brand-1);
}

.timeline-item-head .icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--vp-c-brand-1);
}

.timeline-item-content {
  position: relative;
  top: -6px;
  margin: 0 0 0 26px;
  word-break: break-word;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0px;
  color: var(--vp-c-text-1);
  flex-direction: column;
}

.content-title {
  font-weight: 500;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.content-time {
  font-size: 12px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.content-body {
  color: var(--vp-c-text-2);
  line-height: 1.5715;
  margin-top: 4px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .timeline-item {
    padding-bottom: 16px;
  }

  .content-header {
    flex-direction: column;
  }

  .content-time {
    margin-top: 4px;
  }
}
</style> 