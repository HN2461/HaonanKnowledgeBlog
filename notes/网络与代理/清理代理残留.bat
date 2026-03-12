@echo off
setlocal EnableExtensions
chcp 65001 >nul

echo ==============================================
echo            一键清理代理残留脚本
echo ==============================================
echo 正在检测管理员权限...

net session >nul 2>&1
if %errorlevel% NEQ 0 (
  echo 需要管理员权限，正在请求提升...
  goto UACPrompt
) else (
  goto gotAdmin
)

:UACPrompt
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b

:gotAdmin
  echo.
  echo 1. 清空系统代理（当前用户）
  :: 避免代理客户端退出后，系统仍指向本地端口
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /t REG_SZ /d "" /f >nul
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyOverride /t REG_SZ /d "" /f >nul
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoConfigURL /t REG_SZ /d "" /f >nul
  reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v AutoDetect /t REG_DWORD /d 0 /f >nul

  echo 2. 重置 Winsock 网络栈
  netsh winsock reset >nul

  echo 3. 重置 WinHTTP 代理
  netsh winhttp reset proxy >nul

  echo 4. 清空 DNS 缓存
  ipconfig /flushdns >nul

  echo 5. 检查 7890 端口占用
  echo --------------------------
  netstat -ano | findstr :7890
  if %errorlevel% equ 0 (
    echo 发现 7890 端口被占用，请确认是否仍有代理或 VPN 进程在运行
  ) else (
    echo 7890 端口未占用，代理客户端可能已退出
  )
  echo --------------------------

  echo.
  echo 操作完成。建议重启电脑后再测试访问
  echo 若公司网络要求代理，请按 IT 提供的配置恢复
  pause