---
title: Codex 命令调用失败与 PowerShell 版本冲突排查修复实录
date: 2026-04-27
category: AI工具
tags:
  - Codex
  - PowerShell
  - MCP
  - CC Switch
  - 环境配置
  - 故障排查
description: 记录一次 Codex 本地命令调用异常的真实排查过程，重点说明 PowerShell 5.1/7 并存、终端选择差异与 CC Switch 写入 MCP 配置可能带来的影响，并给出更稳妥的修复思路。
---

# Codex 命令调用失败与 PowerShell 版本冲突排查修复实录

> 本文记录一次真实的本地开发环境故障：Codex 本地命令调用频繁失败，排查中发现 PowerShell 5.1 / 7 并存与 MCP 配置被其他工具改写都可能影响结果。文中结论以这次机器上的实际现象为主，不把个案经验直接当成所有环境的通用定律。

---

## 一、问题背景

使用 **Codex AR 编辑器**（以及 Cursor）开发时，出现以下症状：

- 本地命令调用失败、执行无响应
- 内置终端执行异常、进程拉不起来
- MCP 服务配置莫名失效，旧配置被清空覆盖
- AI 联动指令无法执行

排查后，基本锁定两类高相关诱因：

1. 相关工具链在这台机器上使用 **PowerShell 7（pwsh）** 时更稳定，而部分调用链仍落到 **Windows PowerShell 5.1（powershell.exe）**，导致执行结果不一致
2. 安装 **CC Switch** 并启用其配置同步后，本地 MCP 相关配置出现被改写的情况

---

## 二、核心故障原因拆解

### 1. PowerShell 双版本冲突

Windows 11 通常自带 **Windows PowerShell 5.1（Desktop 版）**，另外也可以单独安装 **PowerShell 7.x（Core 跨平台版）**，两者是并行共存关系。

关键点不在于“系统里只能有一个 PowerShell”，而在于**具体程序调用的是哪个可执行文件**：

- 调用 `powershell.exe` 时，进入的是 Windows PowerShell 5.1
- 调用 `pwsh.exe` 时，进入的是 PowerShell 7

因此，某个 AI 编辑器、本地脚本工具或 MCP 启动器是否会出问题，不能简单归因成“装了 5.1 就不行”，而要看它最终落到哪条调用链。

**快速区分两个版本：**

```powershell
# 查看当前版本
$PSVersionTable

# 5.1 特征：PSEdition = Desktop
# 7.x 特征：PSEdition = Core
```

**启动方式不同：**

```powershell
powershell   # 启动 Windows PowerShell 5.1
pwsh         # 启动 PowerShell 7
```

**实际排查时更有价值的做法：**

分别在两个终端里执行下面的命令，确认自己当前到底处在 5.1 还是 7.x：

```powershell
$PSVersionTable
Write-Output $PSHOME
```

`$PSVersionTable.PSEdition` 与 `$PSHOME` 比单纯看窗口标题更可靠。至于 `System.Management.Automation.dll` 是否存在，不同安装方式、目录结构和版本实现可能不同，**不适合单独拿来当成 PowerShell 5.1 / 7 是否损坏的通用判断标准**。

### 2. MCP 配置被 CC Switch 强制覆盖

CC Switch 的职责本身就包含对多客户端配置进行同步与写入，因此一旦启用了自动切换、跨客户端同步或 MCP 相关配置写回，确实有机会改动本地配置。就这次案例而言，它带来的直接影响主要是：

- 原有自定义 MCP 服务配置丢失
- 路径失效、启动参数被篡改
- AI 编辑器无法连接本地 MCP 服务

### 3. 旧版 PowerShell 5.1 参与调用链，放大了排障难度

Windows PowerShell 5.1 并不等于“必然损坏”或“绝对不可用”，但它与 PowerShell 7 在模块兼容、编码、跨平台能力和部分现代工具链支持上确实存在差异。对 AI 编辑器、本地脚本代理、MCP 启动命令这类链路来说，**同一台机器里混用两套 PowerShell，确实会让问题更难定位**。

---

## 三、分步修复方案

### 第一步：固定默认使用 PowerShell 7

**修改 Windows 默认终端：**

打开「设置 → 系统 → 高级 → 默认终端应用」，将默认项改为 **Windows 终端**（不要选"让 Windows 决定"或"Windows 控制台主机"）。

**设置 Windows 终端默认 Shell 为 PowerShell 7：**

1. 打开 Windows 终端
2. 点击顶部下拉箭头 → 「设置」
3. 在「默认配置文件」里选中 **PowerShell 7（pwsh.exe，版本号 7.x.x）**
4. 点击「保存」

**补充说明：**

将 `pwsh.exe` 所在路径加入 `PATH` 有帮助，但这并不能把所有调用 `powershell.exe` 的程序自动变成 `pwsh.exe`。如果某个工具支持手动指定 shell，最好直接在工具设置里明确写死 `pwsh.exe` 路径。

### 第二步：重新部署 MCP，修复 CC Switch 覆盖问题

1. 先备份现有 MCP 配置文件，避免二次排障时丢失现场
2. 清理明显失效或重复的旧 MCP 配置项
3. 重新按当前实际工具链补齐 MCP 启动路径、启动命令、端口或权限配置
4. 检查 CC Switch 是否开启了会继续写回配置的同步项，必要时先关闭，再重新验证

> 重要：MCP 配置文件建议单独备份一份到安全位置，防止后续工具更新再次覆盖。

### 第三步：只在怀疑系统组件损坏时，再做系统级修复（可选）

以管理员身份运行终端，执行系统文件修复：

```powershell
sfc /scannow
```

这一步只适合用于排除“系统文件损坏”这种更底层的问题，不能把它当成所有 PowerShell 故障的默认解法。

更稳妥的原则是：

- 优先用官方安装器修复或重装 PowerShell 7
- 优先核对具体工具实际调用的是 `powershell.exe` 还是 `pwsh.exe`
- 不建议手工复制核心 DLL 回 `$PSHOME`，以免把问题从“配置异常”扩大成“安装被污染”

### 第四步：Codex & Cursor 编辑器专项适配

1. 打开 Cursor 或相关编辑器设置，修改**终端执行程序**，手动指定路径为 `pwsh.exe`
2. 清空编辑器内置终端缓存、进程残留，重启软件
3. 重新关联本地 MCP 服务地址
4. 测试命令调用、本地脚本执行、AI 联动指令，验证功能恢复

---

## 四、修复后效果验证

修复完成后，逐项确认：

- Windows Terminal 默认 profile 已切到 PowerShell 7，日常手开终端不会再误进 5.1
- 相关编辑器的本地命令调用恢复正常，不再随机落到旧终端链路
- MCP 配置在多次重启和切换后保持稳定，没有再次被异常改写
- Cursor / Codex / 本地脚本这几条常用链路的执行结果一致

---

## 五、长期规避建议

1. 开发和 AI 工具场景，**优先统一到 PowerShell 7**，至少保证核心链路明确使用 `pwsh.exe`
2. CC Switch 等环境切换工具启用前，先确认其是否会同步写入 MCP 或客户端配置
3. MCP、本地 AI 服务配置单独备份，防止工具更新或环境切换意外覆盖
4. 排障时先确认“具体调用的是哪个 shell”，再谈版本兼容，不要直接把所有问题归因到 5.1

---

## 附：PowerShell 版本速查

| 特征 | Windows PowerShell 5.1 | PowerShell 7.x |
|------|----------------------|----------------|
| 启动命令 | `powershell` | `pwsh` |
| PSEdition | Desktop | Core |
| 图标颜色 | 蓝色 | 黑色 |
| 可执行文件 | `powershell.exe` | `pwsh.exe` |
| 现代工具链兼容性 | 较容易遇到差异 | 通常更友好 |
| 跨平台 | 仅 Windows | Windows / macOS / Linux |
