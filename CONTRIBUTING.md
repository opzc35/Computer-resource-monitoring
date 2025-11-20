# 贡献指南

感谢您考虑为 Computer Resource Monitor 做出贡献！

## 如何贡献

### 报告 Bug

如果您发现了 bug，请创建一个 Issue 并包含以下信息：

- 清晰的标题和描述
- 重现步骤
- 预期行为和实际行为
- 截图（如果适用）
- 您的操作系统和版本
- 应用版本

### 建议新功能

我们欢迎新功能建议！请创建一个 Issue 并说明：

- 功能的详细描述
- 为什么这个功能有用
- 可能的实现方式（可选）

### 提交 Pull Request

1. **Fork 仓库**
   ```bash
   git clone https://github.com/你的用户名/Computer-resource-monitoring.git
   cd Computer-resource-monitoring
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **进行更改**
   - 遵循现有的代码风格
   - 添加必要的注释
   - 确保代码可以正常编译

5. **测试您的更改**
   ```bash
   npm run build
   npm start
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能" # 或 "fix: 修复bug"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` Bug 修复
   - `docs:` 文档更新
   - `style:` 代码格式（不影响代码运行）
   - `refactor:` 重构
   - `test:` 测试相关
   - `chore:` 构建过程或辅助工具的变动

7. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 访问原仓库
   - 点击 "New Pull Request"
   - 选择您的分支
   - 填写 PR 描述，说明您的更改

## 开发指南

### 项目结构

```
src/
├── main/           # Electron 主进程
├── renderer/       # React 渲染进程
└── shared/         # 共享代码
```

### 代码规范

- 使用 TypeScript
- 遵循现有的代码风格
- 变量和函数使用有意义的命名
- 为复杂逻辑添加注释
- 保持函数简短和专注

### 调试

开发模式下，按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (macOS) 打开开发者工具。

### 构建和打包

```bash
# 开发模式
npm start

# 构建
npm run build

# 打包
npm run package
```

## 行为准则

请阅读并遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

## 许可证

通过贡献，您同意您的贡献将在 MIT 许可证下授权。

## 问题？

如果您有任何问题，请随时创建 Issue 或参与讨论。

感谢您的贡献！ 🎉
