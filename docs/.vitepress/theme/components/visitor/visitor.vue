<script setup>
import { onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// 初始化Supabase客户端
const supabase = createClient(
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

// 检测是否在微信浏览器中
const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

// 获取格式化的当前时间（包含时区信息）
const getFormattedTime = () => {
  const now = new Date()
  
  // 获取本地时间的ISO字符串
  const isoString = now.toISOString()
  
  // 获取时区偏移量（分钟）
  const timezoneOffset = now.getTimezoneOffset()
  
  // 计算时区偏移的小时和分钟
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60))
  const offsetMinutes = Math.abs(timezoneOffset % 60)
  
  // 格式化时区字符串 (+08:00 格式)
  const timezoneString = `${timezoneOffset <= 0 ? '+' : '-'}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`
  
  // 返回带有本地时区信息的时间
  return {
    iso: isoString,
    local_time: now.toLocaleString(), // 本地时间字符串
    timezone: timezoneString,
    timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown' // 时区名称，如 'Asia/Shanghai'
  }
}

// 收集访客信息的函数
const collectVisitorInfo = async () => {
  try {
    // 获取浏览器信息
    const userAgent = navigator.userAgent
    const isInWechat = isWechat()
    
    // 获取时间信息
    const timeInfo = getFormattedTime()
    
    // 基本信息收集 - 只包含已知存在于数据库表中的字段
    const browserInfo = {
      user_agent: userAgent,
      browser: isInWechat ? 'WeChat' : getBrowserInfo(userAgent),
      os: getOSInfo(userAgent),
      device: getDeviceInfo(userAgent),
      language: navigator.language || navigator.userLanguage,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      window_size: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      path: window.location.pathname,
      timestamp: timeInfo.iso, // ISO格式的时间
      local_time: timeInfo.local_time, // 本地时间字符串
      timezone: timeInfo.timezone, // 时区信息
      timezone_name: timeInfo.timezone_name, // 时区名称
      ip: 'unknown' // 默认值
    }

    // 微信环境下的特殊处理
    if (isInWechat) {
      // console.log('检测到微信环境')
      
      // 在浏览器信息中添加微信标识，而不是作为单独的字段
      browserInfo.browser = 'WeChat Browser'
    }

    // 将数据发送到Supabase
    const { data, error } = await supabase
      .from('visitors')
      .insert([browserInfo])

    if (error) {
      // console.error('保存访客数据失败:', error)
      
      // 如果仍然失败，尝试移除可能导致问题的字段后重试
      if (error.code === 'PGRST204') {
        // console.log('尝试移除可能导致问题的字段后重试...')
        
        // 只保留基本字段，确保包含正确的时间信息
        const basicInfo = {
          user_agent: userAgent,
          browser: isInWechat ? 'WeChat' : getBrowserInfo(userAgent),
          os: getOSInfo(userAgent),
          device: getDeviceInfo(userAgent),
          timestamp: timeInfo.iso,
          local_time: timeInfo.local_time // 尝试保留本地时间
        }
        
        const retryResult = await supabase
          .from('visitors')
          .insert([basicInfo])
          
        if (retryResult.error) {
          // console.error('重试保存仍然失败:', retryResult.error)
          
          // 最后尝试，只保留绝对必要的字段
          if (retryResult.error.code === 'PGRST204') {
            const minimalInfo = {
              user_agent: userAgent,
              browser: isInWechat ? 'WeChat' : getBrowserInfo(userAgent),
              os: getOSInfo(userAgent),
              device: getDeviceInfo(userAgent),
              timestamp: timeInfo.iso
            }
            
            const finalResult = await supabase
              .from('visitors')
              .insert([minimalInfo])
              
            if (finalResult.error) {
              // console.error('最终尝试仍然失败:', finalResult.error)
            } else {
              // console.log('使用最小字段集保存成功')
            }
          }
        } else {
          // console.log('使用基本字段保存成功')
        }
      }
    } else {
      // console.log('访客数据已保存')
    }
  } catch (error) {
    // console.error('收集访客信息时出错:', error)
  }
}

// 获取浏览器信息
const getBrowserInfo = (userAgent) => {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('micromessenger')) {
    return 'WeChat'
  } else if (ua.includes('firefox')) {
    return 'Firefox'
  } else if (ua.includes('edg')) {
    return 'Edge'
  } else if (ua.includes('chrome')) {
    return 'Chrome'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'Safari'
  } else if (ua.includes('opera') || ua.includes('opr')) {
    return 'Opera'
  } else if (ua.includes('qq')) {
    return 'QQ Browser'
  } else if (ua.includes('ucbrowser')) {
    return 'UC Browser'
  } else if (ua.includes('miuibrowser')) {
    return 'MIUI Browser'
  } else if (ua.includes('huaweibrowser')) {
    return 'Huawei Browser'
  } else {
    return 'Unknown'
  }
}

// 获取操作系统信息（带版本号）
const getOSInfo = (userAgent) => {
  const ua = userAgent.toLowerCase()
  
  // Windows 版本检测
  if (ua.includes('windows')) {
    if (ua.includes('windows nt 10.0')) {
      return 'Windows 10'
    } else if (ua.includes('windows nt 6.3')) {
      return 'Windows 8.1'
    } else if (ua.includes('windows nt 6.2')) {
      return 'Windows 8'
    } else if (ua.includes('windows nt 6.1')) {
      return 'Windows 7'
    } else if (ua.includes('windows nt 6.0')) {
      return 'Windows Vista'
    } else if (ua.includes('windows nt 5.1') || ua.includes('windows xp')) {
      return 'Windows XP'
    } else if (ua.includes('windows nt 5.0')) {
      return 'Windows 2000'
    } else if (ua.includes('windows 11') || (ua.includes('windows nt 10.0') && ua.includes('rv:') && !ua.includes('like gecko'))) {
      return 'Windows 11' // 尝试检测Windows 11
    } else {
      return 'Windows'
    }
  } 
  // macOS 版本检测
  else if (ua.includes('mac os')) {
    const macOSVersionMatch = ua.match(/mac os x (\d+)[._](\d+)[._]?(\d+)?/i)
    if (macOSVersionMatch) {
      const majorVersion = parseInt(macOSVersionMatch[1])
      const minorVersion = parseInt(macOSVersionMatch[2])
      
      if (majorVersion >= 10 && minorVersion >= 15) {
        return `macOS Catalina+`
      } else if (majorVersion >= 10 && minorVersion >= 14) {
        return `macOS Mojave`
      } else if (majorVersion >= 10 && minorVersion >= 13) {
        return `macOS High Sierra`
      } else if (majorVersion >= 10 && minorVersion >= 12) {
        return `macOS Sierra`
      } else {
        return `macOS ${majorVersion}.${minorVersion}`
      }
    }
    return 'macOS'
  } 
  // Android 版本检测
  else if (ua.includes('android')) {
    const match = ua.match(/android\s([0-9.]+)/i)
    return match ? `Android ${match[1]}` : 'Android'
  } 
  // iOS 版本检测
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    const match = ua.match(/os\s([0-9_]+)/i)
    return match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS'
  } 
  // HarmonyOS 检测
  else if (ua.includes('harmonyos')) {
    const match = ua.match(/harmonyos\s([0-9.]+)/i)
    return match ? `HarmonyOS ${match[1]}` : 'HarmonyOS'
  }
  // Linux 检测
  else if (ua.includes('linux')) {
    if (ua.includes('ubuntu')) {
      return 'Ubuntu Linux'
    } else if (ua.includes('fedora')) {
      return 'Fedora Linux'
    } else if (ua.includes('debian')) {
      return 'Debian Linux'
    } else {
      return 'Linux'
    }
  } else {
    return 'Unknown'
  }
}

// 获取设备类型
const getDeviceInfo = (userAgent) => {
  const ua = userAgent.toLowerCase()
  
  // 检测常见的中国手机品牌
  if (ua.includes('huawei')) {
    return 'Huawei'
  } else if (ua.includes('xiaomi') || ua.includes('mi ') || ua.includes('mix ') || ua.includes('redmi')) {
    return 'Xiaomi'
  } else if (ua.includes('oppo')) {
    return 'OPPO'
  } else if (ua.includes('vivo')) {
    return 'Vivo'
  } else if (ua.includes('honor')) {
    return 'Honor'
  } else if (ua.includes('iphone')) {
    return 'iPhone'
  } else if (ua.includes('ipad')) {
    return 'iPad'
  } else if (ua.includes('samsung')) {
    return 'Samsung'
  } else if (ua.includes('android') && ua.includes('mobile')) {
    return 'Android Mobile'
  } else if (ua.includes('android') && !ua.includes('mobile')) {
    return 'Android Tablet'
  } else if (ua.includes('windows') && (ua.includes('touch') || ua.includes('tablet'))) {
    return 'Windows Tablet'
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    return 'Mac'
  } else if (ua.includes('windows')) {
    return 'Windows PC'
  } else if (ua.includes('linux') && !ua.includes('android')) {
    return 'Linux PC'
  } else {
    return 'Unknown'
  }
}

// 组件挂载时收集访客信息
onMounted(() => {
  // 延迟一点执行，确保页面完全加载
  setTimeout(() => {
    collectVisitorInfo()
  }, 500)
})
</script>

<template>
  <!-- 不显示任何UI -->
</template>
