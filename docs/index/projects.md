---
title: 关于我
layout: doc
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import Nav from '../.vitepress/theme/components/nav.vue'

const projects = [
  {
    title: '代办事项',
    desc: '基于Electron+Vue3+TS的桌面级应用',
    url: 'https://github.com/myfishdream/to-dos',
    badge: 'Beta',
    badgeType: 'beta',
    icon: 'https://api.iconify.design/logos:todoist.svg'
  },
  // {
  //   title: '项目模板',
  //   desc: 'Vue3 + TypeScript 项目模板',
  //   url: 'https://github.com/your-repo',
  //   badge: 'NEW',
  //   badgeType: 'new'
  // }
]


</script>

<br>

# 项目经历

<br>


## 桌面应用


<Nav :tools="projects"/>




