---
# 文档基本信息
title: 抓包解密，mitmproxy+wireshark，htpps是否安全
date: 2025-02-26-    # 创建日期
author: YuMeng    # 作者

# 分类和标签
category: 技术文档  # 主分类
tags: 
  - 开发工具
  - 其他

# 文档描述
description: 尽管现在的网站普遍使用HTTPS加密网络通通信，仍然有技术手段可以截取并且解密数据

# 额外信息
sticky: 0        # 置顶顺序（0表示不置顶）
star: false           # 是否标星
---

# 抓包解密，mitmproxy+wireshark，htpps 是否安全

## 中间人攻击

指的是在<span style="font-weight:bold;">客户端</span>和<span style="font-weight:bold;">服务器</span>之间插入一个 **代理**

使用 [mitmproxy](https://mitmproxy.org/) 工具

<Picture src='./assets/image-20250226181011573.png'  alt='描述信息'/>

**mitmproxy** 可以作为代理就会拦截该请求，取而代之的是 **代理** 与目标服务器 **建立一个 HTTPS 连接**，代理会产生一个 **伪造证书**，尝试与客户端也建立一个 HTTPS 连接

> [!important]
>
> 通常情况下，客户端只会信任由权威的 CA 机构颁发的证书

如果想要伪造证书被客户端信任，需要提前在客户端的操作系统内安装一个由代理软件自己签发的**根证书**，当客户端被植入根证书后，它就会信任一切由代理发来的证书，代理即可建立起两侧的HTTPS通信

现在，**代理就可以同时持有两端的明文数据**

实现了HTTPS流量的中间解密与监控

## 实战

### 安装mitmproxy

https://mitmproxy.org/

### 运行

以管理员身份运行**CMD**(命令提示符)

```sh
mitmweb -p 9000 --set web_port=9001
```

指定以网页的形式启动抓包工具，代理端口为9000，网页端口为9001

<Picture src='./assets/image-20250226181609731.png'  alt='描述信息'/>

### 配置代理

在搜索栏搜索**代理服务器设置**

<Picture src='./assets/image-20250226182250782.png'  alt='描述信息'/>

### 安装根证书

https://mitmproxy.it/

...

::: danger
完事后 系统设置代理记得**关闭**
:::