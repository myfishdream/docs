---
title: 加密文档管理
date: 2024-02-28
author: VitePress
category:
  - Supabase
tag:
  - 加密
  - 管理
---

# 加密文档管理指南

这个页面提供了加密文档的管理指南和SQL命令示例。

## 数据库设置

首先，确保已经设置好数据库表和函数：

```sql
-- 确保pgcrypto扩展存在
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 创建最简单的文档表
CREATE TABLE secure_docs (
  id SERIAL PRIMARY KEY,
  doc_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- 启用RLS
ALTER TABLE secure_docs ENABLE ROW LEVEL SECURITY;

-- 设置简单的RLS策略
CREATE POLICY "允许匿名查询" ON secure_docs FOR SELECT TO anon USING (true);
CREATE POLICY "允许认证用户管理" ON secure_docs FOR ALL TO authenticated USING (true);

-- 简单的密码验证函数
CREATE OR REPLACE FUNCTION verify_password(
  doc_id TEXT,
  password TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  hash TEXT;
BEGIN
  -- 获取密码哈希
  SELECT password_hash INTO hash FROM secure_docs WHERE doc_id = $1;
  
  -- 如果找不到文档，返回false
  IF hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 验证密码
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授权匿名用户调用
GRANT EXECUTE ON FUNCTION verify_password TO anon;
```

## 常用管理操作

### 1. 创建新的加密文档

```sql
-- 创建新的加密文档
INSERT INTO secure_docs (doc_id, password_hash) 
VALUES 
  ('example1', crypt('password123', gen_salt('bf', 10)));
```

### 2. 查看所有文档

```sql
-- 查看所有加密文档
SELECT id, doc_id, created_at FROM secure_docs ORDER BY created_at DESC;

-- 查看所有加密文档 ✔
SELECT id, doc_id FROM secure_docs;
```

### 3. 更新文档密码

```sql
-- 更新文档密码
UPDATE secure_docs 
SET password_hash = crypt('new_password', gen_salt('bf', 10))
WHERE doc_id = 'example1';
```

### 4. 删除文档

```sql
-- 删除文档
DELETE FROM secure_docs WHERE doc_id = 'example1';
```

## 使用指南

1. **文档ID**：必须是唯一的，建议使用有意义的名称，便于管理
2. **密码**：建议使用强密码，包含字母、数字和特殊字符
3. **安全考虑**：
   - 请勿在公共场合暴露密码
   - 定期更换重要文档的密码
   - 记录文档ID和对应的用途，避免混淆

## Markdown中使用加密内容

在Markdown文件中，使用以下语法添加加密内容：

```html
<SimpleSecureContent id="你的文档ID">
加密内容放在这里...
</SimpleSecureContent>
```

确保"你的文档ID"与Supabase中设置的文档ID一致。

## 示例文档列表

| 文档ID | 用途 | 密码提示 |
|-------|-----|---------|
| example1 | 示例文档 | password123 |
| notes1 | 个人笔记 | (仅管理员知道) |
| project-x | 项目X计划 | (项目成员知道) | 