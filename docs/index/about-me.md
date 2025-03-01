---
title: 关于我
layout: doc
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import Nav from '../.vitepress/theme/components/nav.vue'
import TypeWriter from '../.vitepress/theme/components/TypeWriter.vue'


const projects = [
  {
    title: '代办事项',
    desc: '基于Electron+Vue3+TS的桌面级应用',
    url: 'https://github.com/myfishdream/to-dos',
    badge: 'Beta',
    badgeType: 'beta',
    icon: 'https://api.iconify.design/logos:todoist.svg'
  }
]
const profile = {
  bio: [
    '不要害怕尝试新技术，失败是成功路上的必经之路。',
    '成长是一场与自己的较量，你只需要比昨天的自己更好。',
    '每一个Bug都是一次成长的机会。',
    '每一次优化，都是对完美的追求。',
    '技术没有终点，只有不断的学习和突破。'
  ]
}
</script>

<br>

# 鱼梦江湖 <Badge type="danger" text="YuMeng" />



<TypeWriter 
:texts="profile.bio"
:typeSpeed="40"  
:deleteSpeed="40"
:delayBetween="2000"
/>


![Email](https://img.shields.io/badge/Email-yumengjianghu@outlook.com-blue?style=for-the-badge&logo=gmail&logoColor=white)


<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://img.shields.io/badge/-HTML-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/-CSS-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-Vue-4FC08D?style=flat&logo=vue.js&logoColor=white" alt="Vue">
  <img src="https://img.shields.io/badge/-Git-F05032?style=flat&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/-GitHub-181717?style=flat&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/-Markdown-000000?style=flat&logo=markdown&logoColor=white" alt="Markdown">
  <img src="https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/-Ant%20Design-0170FE?style=flat&logo=ant-design&logoColor=white" alt="Ant Design">
  <img src="https://img.shields.io/badge/-NPM-CB3837?style=flat&logo=npm&logoColor=white" alt="NPM">
  <img src="https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white" alt="Python">
</div>




<br>

<Nav :tools="projects"/>

<Valine/>

<style scoped>
.io{
  display:inline;
}
</style>
