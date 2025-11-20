# GitHub Actions 使用指南

本项目包含两个 GitHub Actions 工作流：

## 1. CI 工作流 (自动触发)

**文件**: `.github/workflows/ci.yml`

**触发条件**:
- 推送到 `main` 或 `develop` 分支
- 针对 `main` 或 `develop` 分支的 Pull Request

**功能**:
- 在 Ubuntu, Windows, macOS 上测试
- 使用 Node.js 18.x 和 20.x 进行测试
- 编译项目确保没有错误
- 上传构建产物（仅 Ubuntu + Node 20）

## 2. Release 工作流 (手动触发)

**文件**: `.github/workflows/release.yml`

### 如何触发

1. **通过 GitHub 网页界面**:
   - 进入仓库页面
   - 点击 `Actions` 标签
   - 在左侧选择 `Build and Release`
   - 点击右侧的 `Run workflow` 按钮
   - 选择分支（通常是 `main`）
   - 选择 Release 类型（alpha/beta/stable）
   - 点击 `Run workflow`

2. **通过 GitHub CLI**:
   ```bash
   gh workflow run release.yml
   ```

### 工作流程

1. **自动创建 Tag**:
   - 获取最新的数字 Tag
   - 自动加 1 生成新的 Tag
   - 如果没有 Tag，从 1 开始

2. **创建 Release**:
   - 创建 Alpha Prerelease
   - 生成 Release 说明

3. **多平台构建**:
   - Windows 10/11 (x64) - `.exe` 绿色版
   - macOS Intel (x64) - `.zip`
   - macOS Apple Silicon (arm64) - `.zip`
   - Linux (x64) - `.AppImage`

4. **自动上传**:
   - 将编译好的文件上传到 Release
   - 文件命名格式: `ResourceMonitor-{tag}-{platform}-{arch}.{ext}`

### 产物说明

| 平台 | 文件名示例 | 说明 |
|------|-----------|------|
| Windows | `ResourceMonitor-5-win-x64.exe` | 单文件可执行，直接运行 |
| macOS Intel | `ResourceMonitor-5-mac-x64.zip` | 解压后包含 .app |
| macOS ARM | `ResourceMonitor-5-mac-arm64.zip` | 原生 M1/M2/M3 支持 |
| Linux | `ResourceMonitor-5-linux-x86_64.AppImage` | 单文件可执行 |

### Tag 编号

- 首次运行: Tag `1`
- 第二次运行: Tag `2`
- 第三次运行: Tag `3`
- 以此类推...

每次运行都会自动递增 Tag 编号。

### 注意事项

1. **构建时间**: 完整构建需要 10-20 分钟
2. **并发构建**: 四个平台同时构建，失败不会影响其他平台
3. **代码签名**: macOS 版本未签名，首次运行需要在系统设置中允许
4. **权限要求**: 需要仓库的 Actions 写入权限

### 调试

每次构建都会上传调试产物，保留 7 天：
- `win-x64-build`
- `mac-x64-build`
- `mac-arm64-build`
- `linux-x64-build`

可以在 Actions 运行页面的 `Artifacts` 部分下载。

### 常见问题

**Q: 如何修改 Tag 编号?**
A: Tag 是自动递增的，如需修改，请手动删除 GitHub 上的 Tags。

**Q: 能否跳过某个平台?**
A: 可以，编辑 `release.yml` 中的 `matrix.include` 部分，注释掉不需要的平台。

**Q: 如何改为正式版本?**
A: 修改 `release.yml` 中的 `prerelease: true` 为 `prerelease: false`。

**Q: 构建失败怎么办?**
A: 查看 Actions 页面的详细日志，常见原因：
- 依赖安装失败
- 编译错误
- 打包失败（检查 electron-builder 配置）

### 本地测试

在提交前可以本地测试构建：

```bash
# 构建
npm run build

# 打包当前平台
npm run package

# 打包特定平台
npm run package:win
npm run package:mac
npm run package:linux
```

构建产物在 `release/` 目录。
