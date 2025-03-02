export const nav = [
  { text: '首页', link: '/' },
  { text: '工具导航', link: '/index/resources' },
  {
    text: 'Web', items: [
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
    text: '随记',
    items: [
      { text: '图床测试', link: '/other/imgbed/note' },
      { text: '前端杂谈', link: '/pages/前端杂谈/note' },
    ]
  },
]; 