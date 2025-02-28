<template>
  <div class="secure-content">
    <!-- 锁定状态 -->
    <div v-if="!isUnlocked" class="locked-state">
      <div class="lock-icon">🔒</div>
      <p>此内容已加密，需要密码访问</p>
      <div class="password-form">
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
          @keyup.enter="verifyPassword"
        />
        <button @click="verifyPassword" :disabled="isVerifying">
          {{ isVerifying ? '验证中...' : '解锁' }}
        </button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
    
    <!-- 解锁状态 -->
    <div v-else class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Supabase连接（使用匿名客户端）
const supabase = createClient(
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

// 组件参数
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// 状态变量
const isUnlocked = ref(false)
const password = ref('')
const error = ref('')
const isVerifying = ref(false)

// 验证密码
async function verifyPassword() {
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
    } else {
      error.value = '密码错误，请重试'
    }
  } catch (err) {
    console.error('验证失败:', err)
    error.value = '验证失败，请稍后重试'
  } finally {
    isVerifying.value = false
  }
}
</script>

<style scoped>
.secure-content {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.locked-state {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.password-form {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
}

.password-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}

.password-form button {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.content {
  padding: 1rem;
}
</style> 