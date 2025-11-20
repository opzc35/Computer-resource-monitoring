# Computer Resource Monitor

<div align="center">

一个基于 Electron + React + TypeScript 的桌面资源监视器，可在屏幕右下角显示实时系统资源信息。

[![License](https://img.shields.io/github/license/opzc35/Computer-resource-monitoring)](LICENSE)
[![Release](https://img.shields.io/github/v/release/opzc35/Computer-resource-monitoring?include_prereleases)](https://github.com/opzc35/Computer-resource-monitoring/releases)
[![Downloads](https://img.shields.io/github/downloads/opzc35/Computer-resource-monitoring/total)](https://github.com/opzc35/Computer-resource-monitoring/releases)
[![Issues](https://img.shields.io/github/issues/opzc35/Computer-resource-monitoring)](https://github.com/opzc35/Computer-resource-monitoring/issues)
[![Stars](https://img.shields.io/github/stars/opzc35/Computer-resource-monitoring)](https://github.com/opzc35/Computer-resource-monitoring/stargazers)

[English](README.md) | [简体中文](README.zh-CN.md)

[下载](#下载) • [功能](#功能特性) • [使用](#使用说明) • [开发](#开发) • [贡献](CONTRIBUTING.md)

</div>

---

## 功能特性

- 📊 **实时监控**
  - CPU 使用率
  - 内存使用情况
  - 网络上传/下载速度
  - GPU 使用率（可选）
  - CPU/GPU 温度（可选）

- 🎯 **进程监控**
  - 显示占用资源最多的进程
  - 可按 CPU、内存、网络、GPU 排序
  - 可自定义显示数量

- 🎨 **界面设计**
  - 透明悬浮窗口
  - 可拖动位置
  - 不显示在任务栏
  - 始终置顶
  - 可调节透明度

- ⚙️ **灵活配置**
  - 独立设置窗口
  - 可自定义刷新间隔
  - 设置自动保存

## 下载

### 最新版本

前往 [Releases 页面](https://github.com/opzc35/Computer-resource-monitoring/releases) 下载最新版本。

#### 支持的平台

| 平台 | 文件类型 | 说明 |
|------|---------|------|
| Windows 10/11 | `.exe` | 绿色版，直接运行 |
| macOS (Intel) | `.zip` | 解压后运行 |
| macOS (Apple Silicon) | `.zip` | 原生支持 M1/M2/M3 |
| Linux | `.AppImage` | 添加执行权限后运行 |

#### 安装说明

**Windows**
1. 下载 `.exe` 文件
2. 双击运行即可，无需安装

**macOS**
1. 下载对应架构的 `.zip` 文件
2. 解压并拖动到应用程序文件夹
3. 首次运行可能需要在系统偏好设置中允许

**Linux**
```bash
chmod +x ResourceMonitor-*.AppImage
./ResourceMonitor-*.AppImage
```

## 从源码构建

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

## 开发

### 启动开发环境

```bash
npm start
```

这将同时启动：
- Webpack Dev Server（端口 3000）
- Electron 应用

### 构建项目

```bash
npm run build
```

## 打包

### 打包所有平台

```bash
npm run package
```

### 打包特定平台

```bash
# Windows
npm run package:win

# macOS
npm run package:mac

# Linux
npm run package:linux
```

打包后的应用将输出到 `release` 目录。

## 项目结构

```
src/
├── main/                   # Electron 主进程
│   ├── main.ts            # 主进程入口
│   ├── preload.ts         # 预加载脚本
│   └── systemMonitor.ts   # 系统监控模块
├── renderer/              # React 渲染进程
│   ├── components/        # React 组件
│   │   ├── MonitorWindow.tsx      # 监视器窗口
│   │   ├── MonitorWindow.css
│   │   ├── SettingsWindow.tsx     # 设置窗口
│   │   └── SettingsWindow.css
│   ├── styles/
│   │   └── global.css     # 全局样式
│   ├── App.tsx            # 主应用组件
│   ├── index.tsx          # React 入口
│   ├── index.html         # HTML 模板
│   └── window.d.ts        # TypeScript 类型定义
└── shared/                # 共享类型定义
    └── types.ts
```

## 使用说明

### 基本操作

1. **拖动窗口**：点击窗口任意位置拖动
2. **打开设置**：点击窗口右上角的齿轮图标，或右键窗口
3. **调整位置**：拖动窗口到想要的位置，位置会自动保存

### 设置选项

- **显示 GPU**：显示 GPU 使用率和显存信息
- **显示温度**：显示 CPU 和 GPU 温度（需要系统支持）
- **显示进程**：显示占用资源最多的进程列表
- **进程排序**：选择按 CPU、内存、网络或 GPU 排序
- **进程数量**：调整显示的进程数量（3-10个）
- **刷新间隔**：设置系统资源更新频率（0.5-5秒）
- **窗口透明度**：调整窗口透明度（30%-100%）

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **React**: UI 框架
- **TypeScript**: 类型安全
- **Webpack**: 模块打包
- **systeminformation**: 系统信息获取库

## 系统要求

- Windows 10/11
- macOS 10.13+
- Linux (主流发行版)

## 注意事项

1. **GPU 监控**：某些系统可能不支持 GPU 信息获取
2. **温度监控**：温度信息需要系统支持，可能在某些平台上不可用
3. **权限**：某些监控功能可能需要管理员权限

## 开发相关

### 调试

开发模式下按 `Ctrl+Shift+I`（Windows/Linux）或 `Cmd+Option+I`（macOS）打开开发者工具。

### 自定义配置

- Webpack 配置：`webpack.*.config.js`
- TypeScript 配置：`tsconfig.json`
- Electron Builder 配置：`package.json` 中的 `build` 字段

## 贡献

我们欢迎所有形式的贡献！无论是报告 bug、提出新功能建议，还是提交代码改进。

### 如何贡献

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

详细信息请参阅 [贡献指南](CONTRIBUTING.md)。

### 贡献者

感谢所有为本项目做出贡献的开发者！

<a href="https://github.com/opzc35/Computer-resource-monitoring/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=opzc35/Computer-resource-monitoring" />
</a>

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面库
- [systeminformation](https://github.com/sebhildebrandt/systeminformation) - 系统信息库

## 支持

如果这个项目对您有帮助，请考虑给它一个 ⭐️！

### 联系方式

- 提交 [Issue](https://github.com/opzc35/Computer-resource-monitoring/issues)
- 参与 [Discussions](https://github.com/opzc35/Computer-resource-monitoring/discussions)

## 变更日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本历史和更新内容。

## 常见问题

**Q: 窗口不显示？**
A: 检查是否被其他窗口遮挡，尝试重启应用。

**Q: GPU 信息显示不出来？**
A: 确保系统支持 GPU 监控，某些集成显卡可能不支持。

**Q: 温度信息不准确？**
A: 温度获取依赖系统传感器，不同系统精度可能不同。

**Q: 如何卸载？**
A:
- Windows: 通过控制面板或设置中的应用管理
- macOS: 将应用拖到废纸篓
- Linux: 删除 AppImage 文件或使用包管理器卸载
