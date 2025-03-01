<template>
  <div class="secure-content" :class="{ 'is-unlocked': isUnlocked }">
    <!-- 锁定状态 -->
    <div v-if="isLocked" class="locked-state">
      <div class="lock-icon locked">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h3 class="lock-title">已锁定</h3>
      <p class="lockout-message">由于多次密码错误，此内容已被临时锁定</p>
      <p class="lockout-timer">剩余锁定时间：{{ remainingTime }}分钟</p>
    </div>
    
    <!-- 正常锁定状态 -->
    <div v-else-if="!isUnlocked" class="locked-state">
      <div class="lock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h3 class="lock-title">{{ title || '此内容已加密，需要密码访问' }}</h3>
      
      <div class="password-form" :class="{ 'is-error': error }">
        <div class="input-wrapper">
          <input 
            ref="passwordInput"
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请输入密码" 
            @keyup.enter="verifyPassword"
            :disabled="isVerifying"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          
          <div class="error-container">
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </div>
        </div>
        
        <button 
          class="unlock-button" 
          @click="verifyPassword" 
          :disabled="isVerifying || !password"
        >
          {{ isVerifying ? '验证中...' : '解锁' }}
        </button>
        
        <div v-if="!isLocked" class="attempts-info">
          剩余尝试次数：{{ maxAttempts - attemptCount }}
        </div>
      </div>
    </div>
    
    <!-- 解锁状态 -->
    <div v-else class="content">
      <div class="content-header">
        <button @click="relockContent" class="relock-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          重新锁定
        </button>
      </div>
      <div class="content-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Supabase连接
const supabase = createClient(
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

// 组件参数
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

// 密码尝试限制
const maxAttempts = 3
const lockoutDuration = 30 * 60 * 1000 // 30分钟，以毫秒为单位
const attemptCount = ref(0)
const isLocked = ref(false)
const remainingTime = ref(0)
const lockoutTimer = ref(null)

// 状态变量
const isUnlocked = ref(false)
const password = ref('')
const error = ref('')
const isVerifying = ref(false)
const showPassword = ref(false)
const passwordInput = ref(null)

// 检查锁定状态
function checkLockout() {
  const docKey = `secure_doc_${props.id}`
  const lockData = localStorage.getItem(docKey)
  
  if (lockData) {
    const data = JSON.parse(lockData)
    const now = Date.now()
    
    // 恢复尝试次数
    attemptCount.value = data.attempts || 0
    
    if (data.lockedUntil && data.lockedUntil > now) {
      // 仍在锁定期内
      isLocked.value = true
      remainingTime.value = Math.ceil((data.lockedUntil - now) / 1000 / 60) // 剩余分钟
      startLockoutTimer(data.lockedUntil - now)
    } else if (data.lockedUntil) {
      // 锁定期已过
      data.lockedUntil = null
      data.attempts = 0
      attemptCount.value = 0
      localStorage.setItem(docKey, JSON.stringify(data))
    }
  }
}

// 启动锁定计时器
function startLockoutTimer(duration) {
  clearInterval(lockoutTimer.value)
  
  // 首次计算剩余时间
  remainingTime.value = Math.ceil(duration / 1000 / 60)
  
  lockoutTimer.value = setInterval(() => {
    const docKey = `secure_doc_${props.id}`
    const lockData = localStorage.getItem(docKey)
    
    if (lockData) {
      const data = JSON.parse(lockData)
      const now = Date.now()
      
      if (data.lockedUntil && data.lockedUntil > now) {
        remainingTime.value = Math.ceil((data.lockedUntil - now) / 1000 / 60)
      } else {
        // 锁定时间已过
        clearInterval(lockoutTimer.value)
        isLocked.value = false
        data.lockedUntil = null
        data.attempts = 0
        attemptCount.value = 0
        localStorage.setItem(docKey, JSON.stringify(data))
      }
    }
  }, 10000) // 每10秒更新一次
}

// 跟踪密码尝试
function trackAttempt(success) {
  const docKey = `secure_doc_${props.id}`
  let data = {}
  
  const storedData = localStorage.getItem(docKey)
  if (storedData) {
    data = JSON.parse(storedData)
  }
  
  if (success) {
    // 重置尝试次数
    data.attempts = 0
    attemptCount.value = 0
  } else {
    // 增加尝试次数
    data.attempts = (data.attempts || 0) + 1
    attemptCount.value = data.attempts
    
    if (data.attempts >= maxAttempts) {
      // 锁定
      const lockTime = Date.now() + lockoutDuration
      data.lockedUntil = lockTime
      isLocked.value = true
      remainingTime.value = Math.ceil(lockoutDuration / 1000 / 60)
      startLockoutTimer(lockoutDuration)
    }
  }
  
  localStorage.setItem(docKey, JSON.stringify(data))
}

// 验证密码
async function verifyPassword() {
  if (isLocked.value) {
    return
  }
  
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  
  isVerifying.value = true
  error.value = ''
  
  try {
    const { data, error: err } = await supabase.rpc('verify_password', {
      p_doc_id: props.id,
      p_password: password.value
    })
    
    if (err) throw err
    
    if (data === true) {
      isUnlocked.value = true
      trackAttempt(true) // 密码正确，重置尝试次数
    } else {
      error.value = '密码错误'
      trackAttempt(false) // 密码错误，增加尝试次数
      
      // 轻微震动效果
      const el = passwordInput.value
      if (el) {
        el.classList.add('shake')
        setTimeout(() => el.classList.remove('shake'), 600)
      }
    }
  } catch (err) {
    console.error('验证失败:', err)
    error.value = '验证失败'
  } finally {
    isVerifying.value = false
  }
}

// 重新锁定内容
function relockContent() {
  isUnlocked.value = false
  password.value = ''
  error.value = ''
  
  // 聚焦密码输入框
  nextTick(() => {
    if (passwordInput.value) {
      passwordInput.value.focus()
    }
  })
}

// 组件挂载时
onMounted(() => {
  // 检查锁定状态
  checkLockout()
  
  // 聚焦密码输入框（如果未锁定）
  nextTick(() => {
    if (passwordInput.value && !isLocked.value) {
      passwordInput.value.focus()
    }
  })
})

// 组件卸载时清除计时器
onBeforeUnmount(() => {
  if (lockoutTimer.value) {
    clearInterval(lockoutTimer.value)
  }
})
</script>

<style scoped>
.secure-content {
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  width: 30%; /* 锁定状态宽度为30% */
}

.secure-content.is-unlocked {
  border-color: var(--vp-c-brand);
  border: none;
  width: 100%; /* 解锁后宽度为100% */
}

.locked-state {
  padding: 1.2rem 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.lock-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 0.2rem;
  color: var(--vp-c-text-2);
}

.lock-icon.locked {
  color: var(--vp-c-danger);
}

.lock-icon svg {
  width: 100%;
  height: 100%;
}

.lock-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
  color: var(--vp-c-text-1);
}

.lockout-message {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.2rem 0;
}

.lockout-timer {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-danger);
  margin: 0.2rem 0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  max-width: 260px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.password-form input {
  width: 100%;
  padding: 0.4rem 0.7rem;
  padding-right: 2.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.password-form input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.is-error input {
  border-color: var(--vp-c-danger);
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--vp-c-text-1);
}

.toggle-password svg {
  width: 16px;
  height: 16px;
}

.error-container {
  position: absolute;
  left: 0;
  bottom: -18px;
  height: 16px;
  text-align: left;
  font-size: 0.75rem;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.is-error .error-container {
  opacity: 1;
}

.error-message {
  color: var(--vp-c-danger);
  padding: 0 2px;
  height: 20px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.error-message:before {
  content: "!";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  background-color: var(--vp-c-danger);
  color: white;
  border-radius: 50%;
  font-size: 9px;
  font-weight: bold;
}

.unlock-button {
  padding: 0.4rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.unlock-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.unlock-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.attempts-info {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: -0.1rem;
  text-align: right;
}

.content {
  padding: 0;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 0.6rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.relock-button {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  margin-top: 10px;
}

.relock-button:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.relock-button svg {
  width: 12px;
  height: 12px;
}

.content-body {
  padding: 0.7rem;
  background-color: var(--vp-c-bg);
}

/* 输入框震动动画 */
.shake {
  animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .secure-content {
    width: 80%; /* 在平板上稍微宽一些 */
  }
}

@media (max-width: 480px) {
  .secure-content {
    width: 100%; /* 在手机上占满宽度 */
  }
  .password-form {
    max-width: 100%;
  }
}
</style> 