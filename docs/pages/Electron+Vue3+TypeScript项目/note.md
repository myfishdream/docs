---
# 文档基本信息
title: Electron+Vue3+TypeScript项目
date: 2025-02-19-    # 创建日期
author: YuMeng    # 作者

# 分类和标签
category: 学习笔记  # 主分类
tags: 
  - JavaScript
  - Vue
  - Node.js
  - CSS
  - HTML
  - TypeScript
  - Electron

# 文档描述
description: 搭建项目流程

# 额外信息
sticky: 5        # 置顶顺序（0表示不置顶）
star: true           # 是否标星
---

<ReadingProgress/>


# Electron+Vue3+TypeScript项目

## Electron + Vue 3 项目搭建教程

### 环境要求

- Node.js (推荐 v18+)
- Git
- pnpm 或 npm (推荐使用 pnpm)

### 可能遇到的问题

- Electron 安装失败（证书问题）
- 依赖安装失败（网络问题）
- 权限问题（node_modules 删除困难）

### 搭建步骤

#### 克隆模板项目

```sh
# 克隆 electron-vite-vue 模板
git clone https://github.com/electron-vite/electron-vite-vue.git

# 进入项目目录
cd electron-vite-vue
```

#### 配置镜像源和环境变量

```sh
# 设置 npm 配置
npm config set strict-ssl false
npm config set registry https://registry.npmmirror.com

# 设置 Electron 镜像（Windows PowerShell）
$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'

# 如果使用 CMD，则使用：
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

#### 安装依赖

```sh
# 使用 npm
npm install

# 或者使用 pnpm（如果遇到问题，建议使用 npm）
pnpm install
```

#### 启动开发服务器

```sh
npm run dev
# 或
pnpm dev
```

### 项目结构

electron-vite-vue/
├── electron/               # Electron 相关代码
│   ├── main/              # 主进程代码
│   └── preload/           # 预加载脚本
├── src/                   # Vue 应用源码
│   ├── assets/           # 静态资源
│   ├── components/       # Vue 组件
│   └── App.vue           # 根组件
├── dist/                  # 构建输出目录
├── resources/             # 应用资源
└── package.json          # 项目配置文件

### 常见问题解决方案

####  Electron 安装失败

设置 Electron 镜像源

关闭 SSL 验证

使用较低版本的 Electron（如果需要）

####  依赖安装失败

使用淘宝镜像源

清除 npm/pnpm 缓存

删除 node_modules 重新安装

####  node_modules 删除问题

关闭所有终端和编辑器

使用管理员权限

使用 PowerShell 的 Remove-Item 命令

> [!important]
>
> ## 注意事项
>
> 确保网络环境稳定
>
> 使用管理员权限运行命令行
>
> 如果使用 pnpm 遇到问题，可以切换到 npm
>
> 保持依赖版本的兼容性
>
> 注意 Electron 安全性配置

## 应用打包教程

### 准备工作

<u>根目录</u>**配置 electron-builder.json5**

```json
{
  "appId": "com.electron.demo",
  "productName": "ElectronVueDemo",
  "directories": {
    "output": "release/${version}"
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ],
    "icon": "public/favicon.ico"
  },
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

**修改 package.json 中的构建脚本**

```json
{
  "scripts": {
    "build": "vue-tsc --noEmit && vite build && electron-builder --win --x64",
    "build:dir": "vue-tsc --noEmit && vite build && electron-builder --dir"
  }
}
```

### 打包步骤

**以管理员身份运行 PowerShell**

```sh
$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'
```

**清理缓存**(如果遇到问题)

```sh
rm -r -force "$env:USERPROFILE\AppData\Local\electron-builder\Cache"
```
**重新安装依赖**

```sh
npm install
```

**构建应用**

```sh
# 生成安装包
npm run build

# 或生成免安装版本
npm run build:dir
```

### 常见问题

- 权限问题

  - 使用管理员权限运行 PowerShell

  - 确保有足够的文件系统权限

- 下载超时

  - 设置 Electron 镜像

  - 确保网络连接稳定

- 构建失败

  - 清理 electron-builder 缓存

  - 使用较低版本的 Electron（如 24.0.0）

  - 先尝试构建免安装版本

### 输出文件

- 安装包位置：**release/{version}/**
- 免安装版本：**release/{version}/win-unpacked/**

> [!tip]
>
> 如果构建出来无法运行就**再构建一遍**，别问我怎么知道的😁

