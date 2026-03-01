# Codex + Chrome DevTools MCP 安装与排错手册（Windows）

最后更新：2026-03-01

## 1. 目标
这份文档解决三个问题：
- 正确配置 `Codex CLI` 的 MCP（`~/.codex/config.toml`）
- 正确配置 VS Code 的 MCP（`mcp.json`）
- 定位并修复“调用经常报错”（尤其是 `npx EPERM`）

## 2. 官方依据（已核对）
- OpenAI Codex 配置：<https://github.com/openai/codex/blob/main/docs/config.md>
- OpenAI Codex 配置参考（含 MCP 字段）：<https://github.com/openai/codex/blob/main/docs/config.md#model-context-protocol-mcp>
- Chrome DevTools MCP 官方仓库：<https://github.com/ChromeDevTools/chrome-devtools-mcp>
- Chrome DevTools MCP 参数（`--autoConnect` / `--browserUrl`）：<https://github.com/ChromeDevTools/chrome-devtools-mcp#connecting-to-an-existing-chrome-instance>
- VS Code MCP 配置格式（顶层键是 `servers`）：<https://code.visualstudio.com/docs/copilot/chat/mcp-servers>

## 3. 两套配置不要混用
- `Codex CLI / OpenAI Codex VS Code 扩展`：读 `C:\Users\HN246\.codex\config.toml`
- `VS Code 原生 MCP（Copilot Chat MCP）`：读 `C:\Users\HN246\AppData\Roaming\Code\User\mcp.json`

结论：这是两套入口。你可以同时配，但要保证两边都合法且一致。

## 4. 本机核查结果（2026-03-01）

### 4.1 Codex CLI
- 版本：`codex-cli 0.106.0`
- `codex mcp list`：`chrome-devtools` 已 `enabled`
- 配置文件：`C:\Users\HN246\.codex\config.toml`

当前可用配置：

```toml
[mcp_servers.chrome-devtools]
type = "stdio"
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--autoConnect", "--no-usage-statistics"]
env = { npm_config_cache = "C:\\Users\\HN246\\.codex\\npm-cache", CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS = "1" }
```

### 4.2 VS Code MCP
你原来的用户级 `mcp.json` 用的是 `mcpServers`，与 VS Code 官方文档不一致（应为 `servers`）。
已修正为：

```json
{
  "servers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--autoConnect",
        "--no-usage-statistics"
      ],
      "env": {
        "npm_config_cache": "C:\\Users\\HN246\\.codex\\npm-cache",
        "CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS": "1"
      }
    }
  }
}
```

文件位置：`C:\Users\HN246\AppData\Roaming\Code\User\mcp.json`

## 5. 为什么你之前会“经常报错”
核心原因是 npm 缓存目录权限异常：
- 报错特征：`npm error code EPERM`、`operation not permitted`
- 出错路径：`E:\DevEnv\nodejs\node_cache\_cacache\tmp\...`

修复思路：
- 显式把 MCP 进程的 npm 缓存指向用户目录：
  `C:\Users\HN246\.codex\npm-cache`
- 该策略已经同时应用在：
  - `C:\Users\HN246\.codex\config.toml`
  - `C:\Users\HN246\AppData\Roaming\Code\User\mcp.json`

## 6. 快速验证清单

### 6.1 验证 Codex CLI
```powershell
codex.cmd --version
codex.cmd mcp list
```
期望：能看到 `chrome-devtools` 且 `enabled`。

### 6.2 验证 chrome-devtools-mcp 包可执行
```powershell
$env:npm_config_cache='C:\Users\HN246\.codex\npm-cache'
$env:CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS='1'
npx.cmd -y chrome-devtools-mcp@latest --version
```
期望：输出版本号（例如 `0.18.1`）。

### 6.3 验证 VS Code MCP 文件合法
```powershell
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('C:/Users/HN246/AppData/Roaming/Code/User/mcp.json','utf8')); console.log('mcp.json OK')"
```
期望：输出 `mcp.json OK`。

## 7. 使用建议（稳定优先）
- 想复用你已打开的 Chrome：保留 `--autoConnect`
- 想强制连接某个调试端口：改用 `--browserUrl http://127.0.0.1:9222`
- 如果网络波动导致 `npx @latest` 拉包慢：可改为固定版本（如 `chrome-devtools-mcp@0.18.1`）减少不确定性

## 8. 常见误区
- 误区 1：把 VS Code `mcp.json` 当成 Codex CLI 配置
  - 结果：CLI 能用，但 VS Code 还报错，或反过来
- 误区 2：`mcp.json` 使用带 BOM 的 UTF-8
  - 结果：某些 JSON 解析器报 `Unexpected token`（建议无 BOM）
- 误区 3：保留无关或失效 server（如测试用 `my-server`）
  - 结果：启动时出现额外失败日志，干扰排查

## 9. 本次实际修改清单
- 已重写本文档（UTF-8）
- 已修正：`C:\Users\HN246\AppData\Roaming\Code\User\mcp.json`
  - `mcpServers` -> `servers`
  - 仅保留 `chrome-devtools`
  - 增加 `npm_config_cache` / `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS`

---
如果你后面仍偶发报错，我建议先抓两份原始输出：
1. `codex.cmd mcp list`
2. VS Code 的 MCP 输出面板（对应 server 的 stderr）

我可以基于这两份日志继续做定点修复。