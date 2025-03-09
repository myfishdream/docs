// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { MotionPlugin } from '@vueuse/motion'
import Giscus from './components/Giscus.vue'       // 评论组件
import Classification from './components/classification.vue'  // 分类
import ReadingProgress from './components/ReadingProgress.vue'  // 阅读进度
import Picture from './components/Picture.vue' // 增强图片组件  
import Timelines from './components/Timelines.vue' // 时间轴组件
import SimpleSecureContent from './components/SimpleSecureContent.vue' // 简单的加密内容组件
import DocsMsg from './components/docsMsg.vue' // 文档信息组件
import Visitor from './components/visitor/visitor.vue' // 访客记录组件（无UI）
import Home from './components/home.vue' // 首页组件
import './style.css'
import './css/variables.css'
import './custom.css'
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DocsMsg), // 特点位置插入组件
      'doc-footer-before': () => h(Visitor), // 页面访问组件
    })
  },
  enhanceApp({ app, router, siteData }) { 
    app.component('Classification', Classification);
    app.component('Giscus', Giscus);
    app.component('ReadingProgress', ReadingProgress); 
    app.component('Picture', Picture); // 注册增强图片组件
    app.component('Timelines', Timelines); // 注册时间轴组件
    app.component('SimpleSecureContent', SimpleSecureContent); // 注册简单加密内容组件
    app.component('Visitor', Visitor); // 注册访客记录组件（无UI）
    app.component('Home', Home); // 注册首页组件
    app.use(MotionPlugin)
  }
}
