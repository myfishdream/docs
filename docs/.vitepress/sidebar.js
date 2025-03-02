// 侧边栏配置
export const sidebar = {
    // 路径前缀匹配
    'pages/Electron+Vue3+TypeScript项目/': [
        {
            text: '介绍',
            collapsed: true,  // 是否折叠
            items: [
                { text: '框架搭建', link: '/pages/Electron+Vue3+TypeScript项目/note' },
                { text: '开发日志', link: '/pages/Electron+Vue3+TypeScript项目/log/note' },
                { text: '时间线', link: '/pages/Electron+Vue3+TypeScript项目/timeline/note' },
                {
                    text: '核心技术',
                    items: [
                        { text: 'A1', link: '/pages/Electron+Vue3+TypeScript项目/core/A1/note' },
                        { text: 'A2', link: '/pages/Electron+Vue3+TypeScript项目/core/A2/note' },
                        { text: 'A3', link: '/pages/Electron+Vue3+TypeScript项目/core/A3/note' },
                        { text: 'A4', link: '/pages/Electron+Vue3+TypeScript项目/core/A4/note' },
                        { text: 'A5', link: '/pages/Electron+Vue3+TypeScript项目/core/A5/note' },
                        { text: 'A6', link: '/pages/Electron+Vue3+TypeScript项目/core/A6/note' },
                        { text: 'A7', link: '/pages/Electron+Vue3+TypeScript项目/core/A7/note' },
                        { text: 'A8', link: '/pages/Electron+Vue3+TypeScript项目/core/A8/note' },
                        { text: 'A9', link: '/pages/Electron+Vue3+TypeScript项目/core/A9/note' },
                        { text: 'A10', link: '/pages/Electron+Vue3+TypeScript项目/core/A10/note' },
                    ]
                },
            ]
        },
    ],

} 