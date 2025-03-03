// 侧边栏配置
export const sidebar = {
    // 路径前缀匹配
    'pages/Electron+Vue3+TypeScript项目/': [
        {
            text: '介绍',
            collapsed: true,  // 是否折叠
            items: [
                { text: '框架搭建', link: '/pages/Electron+Vue3+TypeScript项目/note' },
                { text: '开发日志', link: '/pages/Electron+Vue3+TypeScript项目/log/' },
                { text: '时间线', link: '/pages/Electron+Vue3+TypeScript项目/timeline/' },
                {
                    text: '核心技术',
                    items: [
                        { text: 'A1', link: '/pages/Electron+Vue3+TypeScript项目/core/A1/' },
                        { text: 'A2', link: '/pages/Electron+Vue3+TypeScript项目/core/A2/' },
                        { text: 'A3', link: '/pages/Electron+Vue3+TypeScript项目/core/A3/' },
                        { text: 'A4', link: '/pages/Electron+Vue3+TypeScript项目/core/A4/' },
                        { text: 'A5', link: '/pages/Electron+Vue3+TypeScript项目/core/A5/' },
                        { text: 'A6', link: '/pages/Electron+Vue3+TypeScript项目/core/A6/' },
                        { text: 'A7', link: '/pages/Electron+Vue3+TypeScript项目/core/A7/' },
                        { text: 'A8', link: '/pages/Electron+Vue3+TypeScript项目/core/A8/' },
                        { text: 'A9', link: '/pages/Electron+Vue3+TypeScript项目/core/A9/' },
                        { text: 'A10', link: '/pages/Electron+Vue3+TypeScript项目/core/A10/' },
                    ]
                },


            ]
        },
        {
            text: '教程',
            items: [
                { text: 'Electron快速上手', link: '/pages/Electron快速上手/note.html' },
            ]
        }
    ],
    'pages/前端杂谈/': [
        {
            text: '介绍',
            collapsed: false,  // 是否折叠
            items: [
                { text: 'HTML', link: '/pages/前端杂谈/HTML/' },
                { text: 'CSS', link: '/pages/前端杂谈/CSS/' },
                { text: 'JavaScript', link: '/pages/前端杂谈/JS/' },
            ]
        },
    ],

} 