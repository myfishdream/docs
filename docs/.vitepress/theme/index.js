// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { MotionPlugin } from '@vueuse/motion'

import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import VueLazyloadNext  from 'vue-lazyload-next'   // 懒加载指令
import MouseEvent from './components/MouseEvent.vue' // 鼠标跟随特效
// import ThemeSwitch from './components/ThemeSwitch.vue' // 主题切换过渡动画
import Classification from './components/classification.vue'  // 分类
import ReadingProgress from './components/ReadingProgress.vue'  // 阅读进度
import Picture from './components/Picture.vue' // 增强图片组件
import Timelines from './components/Timelines.vue' // 时间轴组件
import DocsMsg from './components/docsMsg.vue' // 文档信息组件
import SimpleSecureContent from './components/SimpleSecureContent.vue' // 简单的加密内容组件


// 引入懒加载图片
import loadingIMG from '../../src/status/xhj.gif'
import errorIMG from '../../src/status/loseimg.png'


import './style.css'
import './css/variables.css'
import './custom.css'


// /** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // ...
      'doc-before': () => h(DocsMsg), // 特点位置插入组件
    })
  },
  // Layout: ThemeSwitch,  // 浅暗切换动画  
  // 使用这个上面的位置插入又不行，两个一起用？
  
  enhanceApp({ app, router, siteData }) { 
    // ...
    app.component('Classification', Classification);
    app.component('Giscus', Giscus);
    app.component('CopyBlock', CopyBlock);
    app.component('MouseEvent', MouseEvent);
    app.component('ReadingProgress', ReadingProgress);
    app.component('Picture', Picture); // 注册增强图片组件
    app.component('Timelines', Timelines); // 注册时间轴组件
    app.component('DocsMsg', DocsMsg); // 注册文档信息组件
    app.component('SimpleSecureContent', SimpleSecureContent); // 注册简单加密内容组件
    app.use(VueLazyloadNext, {
      loading: loadingIMG, // 加载占位图
      error: errorIMG,     // 错误占位图
      preLoad:1.3,          // 预加载高度比例
      attempt:3,             // 重试次数
    });
    app.use(MotionPlugin)
  }
}
