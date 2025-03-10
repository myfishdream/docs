---
title: 学习历程
layout: page
---

<script setup>
import TimeLine from './.vitepress/theme/components/TimeLine.vue'

/*
  {
    date: '2024-2-20',
    title: '前端工程化深入学习',
    description: '深入学习 Vite、Webpack 等构建工具，理解前端工程化的核心概念和最佳实践',
    type: 'milestone',
    -achievement/milestone/update-
    size: 'large',
    -large-small-medium-
    position: 'left',
    image: 'https://s21.ax1x.com/2025/02/17/pEMngmj.png',
    link: '/pages/HTML5/note'
  },
*/
const studyEvents = [
  //     {
  //   date: '2025-2-28',
  //   title: '学习',
  //   description: '多方面技术栈综合使用',
  //   type: 'milestone',
  //   size: 'large',
  // },
     {
    date: '2025-2-19',
    title: 'Electron+Vue3+TypeScript项目启动',
    description: '多方面技术栈综合使用',
    type: 'milestone',
    size: 'large',
    position: 'right',
  },
   {
    date: '2025-2-18',
    title: 'Electron快速上手',
    description: '使用前端技术开发桌面级应用',
    type: 'achievement',
    size: 'medium',
    // position: 'left',
    link: '/pages/Electron快速上手/note'
  },
  {
    date: '2025-2-17',
    title: 'JavaScrip模块化',
    description: '解决全局污染,依赖混乱,数据安全问题',
    type: 'achievement',
    size: 'medium',
    // position: 'left',
    link: '/pages/JavaScrip模块化/note'
  },
  {
    date: '2025-2-16',
    title: 'Cursor基础使用',
    description: '学习 Cursor AI开发工具 ',
    type: 'achievement',
    // position: 'left', 
    size: 'medium',
    link:'/pages/Cursor基础使用/note'
  },
  {
    date: '2025-2-8',
    title: 'Github/Git学习',
    description: '学习如何使用Github基本操作以及Git集成开发...',
    type: 'achievement',
    size: 'medium',
    // position:'right',
    link:'/pages/Github+Git/note'
  },
  {
    date: '2024-11-13',
    title: '网站功能完善',
    description: '文档分类系统',
    type: 'update',
    size: 'large',
    position:'left'
  },
  {
    date: '2024-7-25',
    title: '博客网站搭建',
    description: '完成了网站的主要模块功能',
    type: 'milestone',
    size: 'large',
    position:'left',
    // image: 'https://s21.ax1x.com/2025/02/17/pEMngmj.png',
  }
]
</script>

<!-- animationDelay 默认 80（毫秒） 控制每批次事件项目显示的延迟时间。较小的值会使动画更快地连续播放，较大的值会使动画之间有更明显的间隔。 -->

 <!-- animationDuration 默认值：400（毫秒）说明：控制单个动画的持续时间。这个值影响CSS过渡的速度，较小的值会使动画更快，较大的值会使动画更慢更平滑。 -->

 <!-- batchSize 默认值：3 说明：控制每批次加载的事件项目数量。这是一个性能优化参数，用于减少同时进行的动画数量。例如，当设置为3时，每3个项目会作为一组几乎同时显示，然后再显示下一组。 -->
<TimeLine :events="studyEvents" :animationDelay="80" :animationDuration="500" :batchSize="5"/>
