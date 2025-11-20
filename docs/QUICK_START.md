# 快速开始指南

这是一个快速开始指南，帮助您在几分钟内运行项目。

## 📋 前提条件

在开始之前，确保您已安装：

- [Node.js](https://nodejs.org/) 16.x 或更高版本
- npm（通常随 Node.js 一起安装）
- Git

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/opzc35/Computer-resource-monitoring.git
cd Computer-resource-monitoring
```

### 2. 安装依赖

```bash
npm install
```

这可能需要几分钟时间，请耐心等待。

### 3. 启动开发服务器

```bash
npm start
```

应用将在开发模式下启动：
- Webpack Dev Server 将在 http://localhost:3000 启动
- Electron 应用将自动打开

### 4. 开始开发

现在您可以：
- 修改 `src/` 目录下的文件
- 保存后自动热重载
- 按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (macOS) 打开开发者工具

## 🔨 构建和打包

### 构建项目

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 打包应用

```bash
# 打包当前平台
npm run package

# 打包特定平台
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

打包后的应用将输出到 `release/` 目录。

## 📁 项目结构

```
Computer-resource-monitoring/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── main.ts
│   │   ├── preload.ts
│   │   └── systemMonitor.ts
│   ├── renderer/          # React 渲染进程
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── shared/            # 共享代码
│       └── types.ts
├── .github/               # GitHub 配置
│   ├── workflows/         # CI/CD 工作流
│   └── ISSUE_TEMPLATE/    # Issue 模板
├── docs/                  # 文档
├── package.json
├── tsconfig.json
└── webpack.*.config.js
```

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `npm start` | 启动开发服务器 |
| `npm run build` | 构建项目 |
| `npm run package` | 打包应用 |
| `npm run package:win` | 打包 Windows 版本 |
| `npm run package:mac` | 打包 macOS 版本 |
| `npm run package:linux` | 打包 Linux 版本 |

## 🐛 故障排除

### 依赖安装失败

```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 应用无法启动

1. 确保端口 3000 未被占用
2. 检查 Node.js 版本是否符合要求
3. 查看终端错误信息

### 构建错误

1. 确保所有依赖已正确安装
2. 检查 TypeScript 错误
3. 查看 Webpack 输出信息

## 📚 下一步

- 阅读 [开发文档](docs/DEVELOPMENT.md)
- 查看 [贡献指南](CONTRIBUTING.md)
- 浏览 [常见问题](README.md#常见问题)

## 💡 提示

- 开发模式下，应用会自动重载
- 修改主进程代码后需要重启应用
- 修改渲染进程代码会自动热重载
- 使用开发者工具调试问题

## 🤝 需要帮助？

- 📖 查看 [完整文档](README.md)
- 💬 参与 [Discussions](https://github.com/opzc35/Computer-resource-monitoring/discussions)
- 🐛 报告 [Issues](https://github.com/opzc35/Computer-resource-monitoring/issues)

祝您开发愉快！ 🎉
