---
title: 加密文档示例
date: 2024-02-28
author: VitePress
category:
  - Supabase
tag:
  - 加密
  - 文档
---

# 加密文档示例

这个页面展示了如何使用 `SimpleSecureContent` 组件来创建加密内容。

## 基本用法

只需在Markdown中使用组件标签，并提供一个唯一的文档ID：

```html
<SimpleSecureContent id="example1">
这是加密的内容，只有知道密码的人才能看到。
</SimpleSecureContent>
```

## 示例演示

下面是一个加密内容的示例：

<SimpleSecureContent id="example1">

## 这是加密的内容

恭喜你解锁了这段加密内容！这段内容只有知道正确密码的人才能看到。

你可以在这里放置任何Markdown内容，包括：

- 列表项
- 代码块  
- 表格
- 图片等

```js
// 甚至可以包含代码
function secretCode() {
  console.log('这是一个秘密!');
}
```

</SimpleSecureContent>

## 管理加密文档

要创建新的加密文档，你需要在Supabase中插入记录。可以使用以下SQL命令：

```sql
-- 插入新的加密文档
INSERT INTO secure_docs (doc_id, password_hash) 
VALUES ('example1', crypt('password123', gen_salt('bf', 10)));
```

上面示例中，`'example1'` 是文档ID，`'password123'` 是访问密码。

## 密码是 `password123`

这是一个演示用的示例，实际使用时请使用更复杂的密码！ 