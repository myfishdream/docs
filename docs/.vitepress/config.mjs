import { defineConfig } from 'vitepress'
import MarkdownPreview from 'vite-plugin-markdown-preview'
import { nav } from './nav.js' // 导入导航配置
import { sidebar } from './sidebar.js' // 导入侧边栏配置

import { setupAlertBoxes } from './extend-md/markdown-extensions' // 导入自定义的警告框处理函数


// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/blog/",
  vite: {
    plugins: [MarkdownPreview()],
  },
  markdown: {
    image: {
      lazyLoading: true
    },
    config: (md) => {
      // 添加自定义的警告框支持
      setupAlertBoxes(md);
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "logo3.png" }],
  ],
  title: "鱼梦江湖",
  description: "知识文档",
  themeConfig: {
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到暗色主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '顶部',
    externalLinkIcon: true, // 外部链接旁显示外部链接图标
    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    logo: '/logo3.png',
    sidebar, // 使用导入的侧边栏配置
    aside: 'left', // 将大纲显示在右侧
    outlineTitle: '目录',
    outline: 'deep',  // 根据h1 - h6 自动排版

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          },
        },
      },
    },
    nav, // 使用导入的导航配置

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yumengjianghu' },
      {
        icon: {
          svg: '<svg t="1740917079095" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10635" width="256" height="256"><path d="M998.4 352.256c-3.072-136.192-121.856-162.304-121.856-162.304s-92.672-0.512-212.992-1.536l87.552-84.48s13.824-17.408-9.728-36.864c-23.552-19.456-25.088-10.752-33.28-5.632-7.168 5.12-112.128 108.032-130.56 126.464-47.616 0-97.28-0.512-145.408-0.512h16.896S323.584 63.488 315.392 57.856s-9.216-13.824-33.28 5.632c-23.552 19.456-9.728 36.864-9.728 36.864l89.6 87.04c-97.28 0-181.248 0.512-220.16 2.048C15.872 225.792 25.6 352.256 25.6 352.256s1.536 271.36 0 408.576c13.824 137.216 119.296 159.232 119.296 159.232s41.984 1.024 73.216 1.024c3.072 8.704 5.632 51.712 53.76 51.712 47.616 0 53.76-51.712 53.76-51.712s350.72-1.536 379.904-1.536c1.536 14.848 8.704 54.272 56.832 53.76 47.616-1.024 51.2-56.832 51.2-56.832s16.384-1.536 65.024 0c113.664-20.992 120.32-154.112 120.32-154.112s-2.048-273.92-0.512-410.112z m-97.792 434.176c0 21.504-16.896 38.912-37.888 38.912h-691.2c-20.992 0-37.888-17.408-37.888-38.912V328.192c0-21.504 16.896-38.912 37.888-38.912h691.2c20.992 0 37.888 17.408 37.888 38.912v458.24z" fill="#515151" p-id="10636"></path><path d="M409.088 418.816l-203.264 38.912 17.408 76.288 201.216-38.912zM518.656 621.056c-49.664 106.496-94.208 26.112-94.208 26.112l-33.28 21.504s65.536 89.6 128 21.504c73.728 68.096 130.048-22.016 130.048-22.016l-30.208-19.456c0-0.512-52.736 75.776-100.352-27.648zM619.008 495.104l201.728 38.912 16.896-76.288-202.752-38.912z" fill="#515151" p-id="10637"></path></svg>'
        },
        link: 'https://space.bilibili.com/1162766914',
      }
    ],
    footer: {
      copyright: 'Powered by <a href="https://vitepress.dev/zh/" target="_blank">Vitepress</a> | Theme by <a href="/index/about-me.html">YuMeng</a>',
      message: 'Copyright © 鱼梦江湖 2024-2025 MIT',
    }
  }

})
