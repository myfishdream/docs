<template>
  <div class="home-container">
    <!-- 顶部插图 -->
    <div class="hero-image">
      <img src="https://s21.ax1x.com/2025/02/15/pEKJAwF.png" alt="hero illustration">
    </div>

    <!-- 个人简介 -->
    <div class="profile">
      <h1 class="greeting">你好，我是鱼梦江湖 👋</h1>
      <p class="subtitle">这是我的个人博客</p>
      <p class="email">yumengjianghu@gmail.com</p>
    </div>

    <!-- 博客列表标题 -->
    <div class="blogs-header">
      <h2>Blogs 🌈</h2>
    </div>

    <!-- 博客文章列表 -->
    <div class="blog-list">
      <a v-for="post in posts" 
         :key="post.title" 
         :href="post.link"
         class="blog-item">
        <div class="blog-content">
          <h3>{{ post.title }}</h3>
          <p class="date">{{ post.date }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
const posts = [
  {
    title: 'docker 自动化安装部署、配置镜像源',
    date: 'Nov 18, 2024',
    link: '#'
  },
  {
    title: 'linux service服务配置',
    date: 'Jul 18, 2024',
    link: '#'
  },
  {
    title: 'postgresql 常用命令',
    date: 'Jul 01, 2024',
    link: '#'
  },
  {
    title: 'vue项目vite全局静态变量配置',
    date: 'May 10, 2024',
    link: '#'
  },
  {
    title: 'vue&vite的api网络请求proxy设置',
    date: 'May 10, 2024',
    link: 'www.baidu.com'
  }
]
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-image {
  width: 200px;
  margin-bottom: 40px;
}

.hero-image img {
  width: 100%;
  height: auto;
}

.profile {
  text-align: center;
  margin-bottom: 40px;
}

.greeting {
  font-size: 2em;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 10px;
}

.email {
  color: #666;
}

.blogs-header {
  width: 100%;
  margin-bottom: 20px;
}

.blogs-header h2 {
  font-size: 1.5em;
  color: #333;
}

.blog-list {
  width: 100%;
}

.blog-item {
  display: block;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.blog-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.blog-content h3 {
  margin: 0;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.date {
  color: #666;
  font-size: 0.9em;
  margin: 0;
}
</style>