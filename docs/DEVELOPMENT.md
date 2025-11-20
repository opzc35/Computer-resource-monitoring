# Computer Resource Monitor - 开发文档

## 架构概述

本项目采用 Electron 架构，分为主进程和渲染进程。

### 主进程 (Main Process)

位于 `src/main/` 目录，负责：

- 创建和管理窗口
- 系统资源监控
- 进程间通信 (IPC)
- 文件系统操作
- 应用生命周期管理

主要文件：
- `main.ts` - 主进程入口，窗口管理
- `systemMonitor.ts` - 系统资源监控模块
- `preload.ts` - 预加载脚本，IPC 桥接

### 渲染进程 (Renderer Process)

位于 `src/renderer/` 目录，负责：

- 用户界面渲染
- 用户交互处理
- 数据展示

主要文件：
- `index.tsx` - React 应用入口
- `App.tsx` - 根组件
- `components/` - React 组件

## 系统监控实现

### CPU 监控

使用 `systeminformation` 库的 `currentLoad()` 方法获取 CPU 使用率。

```typescript
const load = await si.currentLoad();
const cpuUsage = load.currentLoad;
```

### 内存监控

使用 `mem()` 方法获取内存信息。

```typescript
const mem = await si.mem();
const memoryUsage = {
  used: mem.used,
  total: mem.total,
  percentage: (mem.used / mem.total) * 100
};
```

### 网络监控

使用 `networkStats()` 方法获取网络流量，通过计算两次采样之间的差值得到速度。

```typescript
const stats = await si.networkStats();
const current = stats[0];
// 计算速度 = (当前字节数 - 上次字节数) / 时间差
```

### GPU 监控

使用 `graphics()` 方法获取 GPU 信息。注意：某些系统可能不支持。

```typescript
const graphics = await si.graphics();
const gpu = graphics.controllers[0];
```

## IPC 通信

### 主进程 → 渲染进程

```typescript
// 主进程发送数据
mainWindow.webContents.send('system-stats', stats);

// 渲染进程接收
window.electronAPI.onSystemStats((stats) => {
  // 处理数据
});
```

### 渲染进程 → 主进程

```typescript
// 渲染进程调用
const settings = await window.electronAPI.getSettings();

// 主进程处理
ipcMain.handle('get-settings', () => {
  return currentSettings;
});
```

## 窗口管理

### 悬浮窗口特性

```typescript
const monitorWindow = new BrowserWindow({
  frame: false,        // 无边框
  transparent: true,   // 透明
  alwaysOnTop: true,   // 始终置顶
  skipTaskbar: true,   // 不显示在任务栏
});

// 设置拖动区域
// CSS: -webkit-app-region: drag;
```

### 窗口位置保存

窗口位置保存在用户数据目录的 `settings.json` 文件中。

## 构建流程

1. **TypeScript 编译** - 将 TS 代码编译为 JS
2. **Webpack 打包** - 分别打包主进程、渲染进程和 preload 脚本
3. **Electron Builder** - 将应用打包为可执行文件

### Webpack 配置

- `webpack.main.config.js` - 主进程配置
- `webpack.renderer.config.js` - 渲染进程配置
- `webpack.preload.config.js` - preload 脚本配置

## 性能优化

### 1. 监控间隔

默认 1 秒更新一次，可在设置中调整（0.5-5 秒）。

### 2. 资源清理

在窗口关闭时清理定时器：

```typescript
monitorWindow.on('closed', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
```

### 3. 条件加载

GPU 和进程信息仅在用户启用时才获取。

## 调试技巧

### 开发者工具

```bash
# 开发模式自动打开
npm start
# 按 Ctrl+Shift+I 打开
```

### 日志输出

```typescript
// 主进程
console.log('Main:', data);

// 渲染进程
console.log('Renderer:', data);
```

### 性能监控

```typescript
console.time('operation');
// 操作代码
console.timeEnd('operation');
```

## 常见问题

### Q: 为什么温度信息获取不到？

A: 温度监控依赖系统传感器，某些系统（特别是虚拟机）可能不提供温度信息。

### Q: 如何添加新的监控指标？

A:
1. 在 `systemMonitor.ts` 中添加获取方法
2. 更新 `types.ts` 中的类型定义
3. 在 UI 组件中显示新数据

### Q: 如何自定义窗口样式？

A: 修改 `src/renderer/components/MonitorWindow.css` 文件。

## 贡献指南

请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 相关资源

- [Electron 文档](https://www.electronjs.org/docs)
- [React 文档](https://reactjs.org/docs)
- [systeminformation 文档](https://systeminformation.io/)
- [electron-builder 文档](https://www.electron.build/)
