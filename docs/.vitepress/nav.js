export const nav = [
  { text: '🏠️Home', link: '/' },
  { text: '🛠Tools', link: '/index/resources' },
  { text: '🏷️Tags', link: '/index/study-notes' },
  {
    text: '🏳‍🌈Web', items: [
      {
        text: '',
        items: [
          { text: 'HTML 理论知识', link: '/pages/HTML5/note' },
          { text: 'CSS 理论知识', link: '/pages/CSS/note' },
          { text: 'JavaScript 基础知识', link: '/pages/JavaScript/note' },
          { text: 'TypeScript 快速入门', link: '/pages/TypeScript/note' },
          { text: 'Vue3 快速入门', link: '/pages/Vue3/note' },
          { text: 'Uniapp 快速入门', link: '/pages/uniapp/note' },
        ],
      },
      {
        text: '',
        items: [
          { text: 'Node.js 入门', link: '/pages/Node/note' },
          { text: 'SQL Server', link: '/pages/SQL-Server/note' },
        ],
      },
      {
        text: '',
        items: [
          { text: 'Github 快速入门', link: '/pages/Github+Git/note' },
          { text: 'Git 快速入门', link: '/pages/Git/note' },
          { text: 'Vite 理论知识', link: '/pages/Vite/note' },
          { text: 'Cursor 基础使用', link: '/pages/Cursor基础使用/note'},
        ],
      },
    ]
  },
  {
    text: '📝Note',
    items: [
      { text: '开发技巧', link: '/pages/小技巧/note' },
      { text: '八股文', link: '/' },
      { text: '时间线', link: '/timeline' },
      { text: '前端物语', link: '/pages/前端杂谈/JS/index' },
    ]
  },
]; 