# 三角洲行动 · 改枪码收藏

个人用的改枪码收藏夹。电脑和手机登录同一账号即可看到同一份数据。

## 技术栈

Vite + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel

## 本地启动

### 1. 配置 Supabase

1. 到 https://supabase.com 注册并新建 Project（区域建议选 Tokyo 或 Singapore）
2. 进入 **SQL Editor**，粘贴执行 `supabase/schema.sql` 的全部内容
3. 进入 **Project Settings → API**，复制 `Project URL` 和 `anon public` key

### 2. 填写环境变量

```bash
cp .env.example .env.local
```

把上一步复制的两个值填进 `.env.local`。

### 3. 运行

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173，注册账号即可使用。

手机访问：连同一 WiFi，用终端里显示的 `Network` 地址（形如 `http://192.168.x.x:5173`）打开。

## 部署到 Vercel

1. 把本仓库推到 GitHub
2. 在 Vercel 导入该仓库
3. 在 Vercel 的 **Environment Variables** 中配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
4. 部署完成后获得 HTTPS 域名，手机可直接访问

## 关于复制功能

`navigator.clipboard` 只在 HTTPS 或 localhost 下可用。通过局域网 IP（HTTP）访问时会自动降级为 `document.execCommand` 兜底；若仍然失败，按钮会提示手动长按复制。部署到 Vercel 后即为 HTTPS，复制功能正常。

## 数据安全

前端使用的 `anon` key 是设计为可公开的密钥，安全性由 Supabase 的 Row Level Security 保证：`supabase/schema.sql` 中的策略限制了每个用户只能读写自己的数据。
