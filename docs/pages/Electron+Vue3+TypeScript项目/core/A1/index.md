---
aside: 'right'
---

# 实现可累加弹窗

<br>

<Picture src='/picture/全局弹窗组件.gif'  alt='描述信息'/>



### 核心技术

**实现可累加弹窗**

在 Electron + Vue3 + TypeScript 项目中，我们实现了一个全局消息通知组件，支持多条消息同时显示，并且可以自动管理消息的位置和动画效果。

#### 核心实现原理

1. **单例模式管理**
2. **动态组件渲染**
3. **位置自动计算**
4. **动画过渡效果**

#### 代码实现

####  消息通知组件 (MessageNotification.vue)

::: details 代码

```vue
<template>
  <div class="message-container">
    <TransitionGroup 
      name="message-fade" 
      tag="div"
      @before-leave="onBeforeLeave"
      @after-leave="onAfterLeave"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-wrapper"
        :style="{
          transform: `translate(-50%, ${msg.offset}px)`,
          height: msg.height + 'px'
        }"
      >
        <div :class="['message', msg.type]">
          <div class="message-content">
            <!-- 消息图标 -->
            <span class="message-icon" :class="msg.type">
              <!-- 不同类型的图标 SVG -->
            </span>
            <!-- 消息文本 -->
            <span class="message-text">{{ msg.text }}</span>
            <!-- 关闭按钮 -->
            <button class="close-btn" @click="remove(msg.id)">
              <svg>...</svg>
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// 消息接口定义
interface Message {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
  offset: number
  height: number
}

// 状态管理
const messages = ref<Message[]>([])
const messageGap = 16  // 消息间距
const baseOffset = 20  // 基础偏移量

// 更新所有消息位置
const updatePositions = () => {
  let currentOffset = baseOffset
  messages.value.forEach(msg => {
    msg.offset = currentOffset
    currentOffset += msg.height + messageGap
  })
}

// 获取最后一条消息的偏移量
const getLastOffset = () => {
  if (messages.value.length === 0) return baseOffset
  const lastMessage = messages.value[messages.value.length - 1]
  return lastMessage.offset
}

// 添加新消息
const add = async (message: Omit<Message, 'offset' | 'id' | 'height'>) => {
  const id = `${Date.now()}-${messages.value.length}`
  const isFirstMessage = messages.value.length === 0
  
  // 设置初始位置
  const initialOffset = isFirstMessage 
    ? baseOffset - 100  // 第一条消息从上方滑入
    : getLastOffset()  // 后续消息从上一个位置开始
  
  messages.value.push({
    ...message,
    id,
    offset: initialOffset,
    height: 60
  })

  // 更新实际高度
  await nextTick()
  const messageElement = document.querySelector(`[data-message-id="${id}"]`)
  if (messageElement) {
    const height = messageElement.getBoundingClientRect().height
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value[index].height = height
    }
  }
  
  // 更新到最终位置
  await nextTick()
  updatePositions()

  // 自动关闭
  setTimeout(() => {
    remove(id)
  }, message.duration)
}

// 移除消息
const remove = (id: string) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index !== -1) {
    messages.value.splice(index, 1)
    nextTick(() => {
      updatePositions()
    })
  }
}

// 动画钩子
const onBeforeLeave = (el: Element) => {
  const style = (el as HTMLElement).style
  const height = el.getBoundingClientRect().height
  style.height = `${height}px`
  style.maxHeight = `${height}px`
  style.opacity = '0'
  style.transform = 'translate(-50%, -20px)'
  style.transition = 'all 0.3s ease-in-out'
}

const onAfterLeave = () => {
  updatePositions()
}

defineExpose({
  add
})
</script>

<style scoped>
/* 样式定义 */
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 9999;
  pointer-events: none;
  width: min(380px, calc(100vw - 32px));
}

.message-wrapper {
  position: fixed;
  left: 50%;
  width: 100%;
  pointer-events: none;
  transition: transform 0.3s ease-in-out;
}

.message {
  position: relative;
  width: fit-content;
  min-width: 280px;
  max-width: 100%;
  margin: 0 auto;
  padding: 14px 26px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  box-sizing: border-box;
}

/* 消息类型样式 */
.message.info {
  background: #e6f4ff;
  border: 1px solid #91caff;
  color: #1890ff;
}

.message.success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.message.warning {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.message.error {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

/* 动画效果 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.message-fade-move {
  transition: transform 0.3s ease-in-out;
}
</style>
```

:::



##### nextTick 

> [!INFO]
>
> 在 Vue 中，nextTick 是一个非常重要的 API，它允许我们等待下一个 DOM 更新周期后再执行特定的代码。

Vue 的响应式系统会批量处理数据变化并异步更新 DOM，以提高性能。这意味着当你改变响应式数据后，DOM 不会立即更新，而是在下一个"tick"中更新。

在消息通知组件中，我使用 nextTick 的主要原因有：

1. 获取真实 DOM 尺寸：当新消息被添加到数组后，我们需要获取其实际渲染后的高度，但此时 DOM 可能还未更新。

1. 确保位置计算准确：在更新消息位置前，需要确保所有消息都已正确渲染。

```ts (11,22)
const add = async (message: Omit<Message, 'offset' | 'id' | 'height'>) => {
  // ... 添加消息到数组
  messages.value.push({
    ...message,
    id,
    offset: initialOffset,
    height: 60  // 初始高度估计值
  })

  // 等待 DOM 更新
  await nextTick()
  
  // 获取实际渲染后的元素高度
  const messageElement = document.querySelector(`[data-message-id="${id}"]`)
  if (messageElement) {
    const height = messageElement.getBoundingClientRect().height
    // 更新消息的实际高度
    messages.value[index].height = height
  }
  
  // 再次等待 DOM 更新
  await nextTick()
  // 更新所有消息的位置
  updatePositions()
}
```

这里使用了两次 await nextTick()：

1. 第一次是为了等待消息元素被渲染到 DOM 中，这样我们才能获取其实际高度

1. 第二次是为了确保高度更新后，再计算和应用新的位置信息



##### Omit<Message, 'offset' | 'id' | 'height'>

这是 TypeScript 中的一个工具类型，用于从**已有类型中剔除某些属性**，**创建一个新的类型**。

```ts
const add = async (message: Omit<Message, 'offset' | 'id' | 'height'>) => {
```

- `Message` 是完整的消息接口类型

- `Omit<Message, 'offset' | 'id' | 'height'>` 创建了一个新类型，它包含 **Message** 的所有属性，除了 offset、id 和 height

原始的 `Message` 接口定义为：

```ts
interface Message {
  id: string        // 消息唯一标识
  text: string      // 消息文本内容
  type: 'info' | 'success' | 'warning' | 'error'  // 消息类型
  duration: number  // 显示时长
  offset: number    // 垂直位置偏移量
  height: number    // 消息高度
}
```

使用 `Omit` 后，`add` 方法的参数类型实际上等同于：

```ts
interface MessageInput {
  text: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
}
```

**使用原因**：

1. 自动生成的属性：id 是在函数内部自动生成的唯一标识，**不需要**调用者提供

1. 计算的属性：`offset` 和 `height` 是组件内部计算和管理的，与消息的位置和尺寸有关

1. 职责分离：调用者只需关心消息的内容、类型和持续时间，而不需要关心显示细节

这种设计体现了良好的 **API 设计原则**：只暴露**必要**的参数，**隐藏**实现细节。

**示例**：

当调用 `add` 方法时，只需提供必要的信息：

```ts
// 在 message.ts 中
info(text: string, duration = 3000) {
  const instance = createMessage()
  instance?.add({ 
    text,           // 消息文本
    type: 'info',   // 消息类型
    duration        // 显示时长
  })
}
```

组件内部会自动处理：

- 生成唯一的 id

- 计算初始 offset

- 设置默认 height 并在渲染后更新为实际高度

这种设计使得消息通知组件的使用<span style="font-weight:bold; color:#009900;">非常简洁</span>，同时内部实现了复杂的<span style="font-weight:bold; color:#009900;">位置管理</span>和<span style="font-weight:bold; color:#009900;">动画效果</span>。

#### 全局消息服务 (message.ts)

::: details 代码

```typescript
import { createVNode, render, type App } from 'vue'
import MessageNotification from '../components/MessageNotification.vue'

// 单例实例
let messageInstance: any = null

// 消息类型定义
export type MessageType = 'info' | 'success' | 'warning' | 'error'

// 消息配置接口
export interface MessageOptions {
  text: string
  type?: MessageType
  duration?: number
}

// 创建消息组件实例
function createMessage() {
  if (messageInstance) return messageInstance

  const container = document.createElement('div')
  const vnode = createVNode(MessageNotification)
  render(vnode, container)
  document.body.appendChild(container)
  messageInstance = vnode.component?.exposed

  return messageInstance
}

// 导出消息对象
export const message = {
  info(text: string, duration = 3000) {
    const instance = createMessage()
    instance?.add({ text, type: 'info', duration })
  },

  success(text: string, duration = 3000) {
    const instance = createMessage()
    instance?.add({ text, type: 'success', duration })
  },

  warning(text: string, duration = 3000) {
    const instance = createMessage()
    instance?.add({ text, type: 'warning', duration })
  },

  error(text: string, duration = 3000) {
    const instance = createMessage()
    instance?.add({ text, type: 'error', duration })
  }
}

// Vue 插件
export default {
  install(app: App) {
    app.config.globalProperties.$message = message
  }
}
```

:::

##### createVNode 

> [!INFO]
>
> <span style="font-weight:bold;">createVNode </span>是 Vue 3 中的一个底层 API，用于创建虚拟 DOM 节点（Virtual Node，简称 VNode）。

###### 概念

虚拟 DOM 是 Vue 内部用来表示真实 DOM 的 JavaScript 对象。`createVNode` 函数允许我们手动创建这些虚拟节点，而不是通过模板编译。

###### **应用**

```ts (2,8)
import { createVNode, render, type App } from 'vue'
import MessageNotification from '../components/MessageNotification.vue'

function createMessage() {
  if (messageInstance) return messageInstance

  const container = document.createElement('div')
  const vnode = createVNode(MessageNotification)
  // ...
}
```

在这段代码中：

1. `createVNode(MessageNotification)` 创建了一个表示 MessageNotification 组件的虚拟节点
2. 这个虚拟节点**包含了组件的所有信息**，但此时还没有被渲染到 DOM 中
3. <span style="text-decoration:line-through;">没有传递 props，因为我们的消息组件不需要初始属性</span>

###### 优势

1. 动态创建：可以在运行时动态创建组件
2. 脱离组件树：创建的组件不需要在现有的组件树中声明
3. 完全控制：可以完全控制组件的创建和销毁过程

##### render

> [!INFO]
>
> <span style="font-weight:bold;">render </span>函数用于将虚拟节点渲染到真实 DOM 容器中。

###### 概念

`render` 函数接收两个主要参数：

- 要渲染的虚拟节点

- 目标 DOM 容器

###### 应用

```ts (4-6)
function createMessage() {
  if (messageInstance) return messageInstance

  const container = document.createElement('div')
  const vnode = createVNode(MessageNotification)
  render(vnode, container)
  document.body.appendChild(container)
  messageInstance = vnode.component?.exposed
  
  return messageInstance
}
```

在这段代码中：

1. 首先创建一个真实的 DOM 元素 container 作为容器
2. 然后调用 `render(vnode, container)` 将虚拟节点渲染到这个容器中
3. 最后将容器添加到 document.body 中，使组件在页面上可见
4. 通过 `vnode.component?.exposed` 获取组件实例暴露的方法

###### 渲染过程

创建容器：`const container = document.createElement('div')`

- 创建一个空的 div 元素作为容器

渲染组件：`render(vnode, container)`

- Vue 将虚拟节点转换为真实 DOM 并插入到容器中

- 此时组件的生命周期钩子被触发，组件实例被创建

添加到文档：`document.body.appendChild(container)`

- 将包含已渲染组件的容器添加到 body 中

- 这使得消息通知可以显示在页面的最顶层

获取实例：`messageInstance = vnode.component?.exposed`

- `vnode.component` 包含了组件实例的引用

- `.exposed` 获取通过 `defineExpose` 暴露的方法和属性

- 在 MessageNotification.vue 中，我们暴露了 add 方法

###### 工作流程

在消息通知系统中，`createVNode` 和 `render` 的组合使用形成了以下工作流程：

1. 首次调用 `message.info/success/warning/error` 时，触发 `createMessage()`
2. `createMessage()` 使用 `createVNode` 创建组件的虚拟表示
3. 使用 `render` 将虚拟节点渲染为真实 DOM
4. 将渲染后的组件添加到 body 中
5. 获取组件实例的 `add` 方法
6. 调用 `add` 方法显示消息
7. 后续调用时直接复用已创建的实例

###### 优势

相比**传统的组件**注册和使用有几个优势

1. 无需预先挂载：不需要在每个页面或组件中预先声明消息组件
2. 全局单例：确保整个应用只有一个消息通知实例，避免重复创建
3. 命令式 API：提供简洁的命令式 API（如 message.success()），而不是声明式用法
4. 动态创建：可以在任何时候、任何地方动态创建和显示消息
5. 独立于组件树：消息通知不依赖于当前组件的生命周期

#### 使用方式

1. **注册插件**
   在 `main.ts` 中注册消息插件：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import message from './utils/message'

const app = createApp(App)
app.use(message)
app.mount('#app')
```

2. **在组件中使用**

```typescript
// 在组件中使用
this.$message.success('操作成功！')
this.$message.error('操作失败！')
this.$message.warning('警告信息')
this.$message.info('提示信息')
```

#### 实现特点

1. **自动位置管理**
   - 新消息自动计算位置
   - 消息移除时自动调整其他消息位置
   - 支持多条消息同时显示

2. **动画效果**
   - 消息出现时的滑入动画
   - 消息消失时的淡出动画
   - 位置变化时的平滑过渡

3. **类型安全**
   - 完整的 TypeScript 类型定义
   - 消息类型限制
   - 配置接口定义

4. **全局可用**
   - 通过 Vue 插件机制实现全局访问
   - 单例模式确保只有一个实例
   - 按需创建，避免资源浪费

5. **样式定制**
   - 支持四种消息类型
   - 响应式设计
   - 美观的视觉效果

#### 注意事项

1. 消息组件会自动管理位置，无需手动计算
2. 消息会在指定时间后自动消失
3. 可以通过点击关闭按钮手动关闭消息
4. 消息组件会自动处理溢出情况
5. 支持自定义显示时长

 
