$ErrorActionPreference = 'Stop'

function Invoke-ExternalCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [string[]]$Arguments = @()
  )

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $FilePath
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true

  foreach ($argument in $Arguments) {
    $psi.ArgumentList.Add($argument)
  }

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  $null = $process.Start()
  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  return [PSCustomObject]@{
    ExitCode = $process.ExitCode
    StdOut = $stdout.Trim()
    StdErr = $stderr.Trim()
  }
}

function Write-Section {
  param(
    [string]$Title
  )

  Write-Output ''
  Write-Output "=== $Title ==="
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCommand) {
  Write-Error '未找到 node 命令，请先确认 Node.js 已安装并已加入 PATH。'
  exit 1
}

$nodePath = $nodeCommand.Source

Write-Section '环境信息'
Write-Output "pwsh: $($PSVersionTable.PSVersion)"
Write-Output "node path: $nodePath"

$versionCheck = Invoke-ExternalCommand -FilePath $nodePath -Arguments @('-v')

Write-Section 'node -v'
Write-Output "exitCode: $($versionCheck.ExitCode)"
if ($versionCheck.StdOut) {
  Write-Output $versionCheck.StdOut
}
if ($versionCheck.StdErr) {
  Write-Output $versionCheck.StdErr
}

$scriptCheck = Invoke-ExternalCommand -FilePath $nodePath -Arguments @('-e', "console.log('node-runtime-ok')")

Write-Section 'node -e'
Write-Output "exitCode: $($scriptCheck.ExitCode)"
if ($scriptCheck.StdOut) {
  Write-Output $scriptCheck.StdOut
}
if ($scriptCheck.StdErr) {
  Write-Output $scriptCheck.StdErr
}

if ($scriptCheck.ExitCode -eq 0 -and $scriptCheck.StdOut -match 'node-runtime-ok') {
  Write-Section '结论'
  Write-Output 'Node 运行时预检通过，可以继续执行 npm / node 脚本。'
  exit 0
}

$combinedOutput = @($scriptCheck.StdOut, $scriptCheck.StdErr) -join "`n"

Write-Section '诊断'

if ($combinedOutput -match 'ncrypto::CSPRNG\(nullptr, 0\)' -or $combinedOutput -match 'NTE_PROVIDER_DLL_FAIL' -or $combinedOutput -match '8009001d') {
  Write-Output '检测到 Node 在初始化安全随机数时失败。'
  Write-Output '这通常不是仓库代码问题。'
  Write-Output '如果主人自己开的 PowerShell / CMD 里 `node -e` 正常，而这里失败，就应优先判定为 Codex 当前命令执行环境与外部终端不一致。'
  Write-Output '在这种情况下，可把问题归类为“Codex 终端环境里的加密提供程序初始化异常”，而不是本机 Node 安装损坏。'
  Write-Output '建议：'
  Write-Output '1. 先不要重复尝试 npm / node 命令。'
  Write-Output '2. 在你自己的外部终端手动运行 `node -e "console.log(''node-runtime-ok'')"` 做对照。'
  Write-Output '3. 如果外部终端正常，而当前代理终端失败，则按“当前代理终端 Node 不可用”处理，改用主人本机终端执行脚本，或由 Codex 走手动同步生成文件方案。'
  Write-Output '4. 只有当外部终端也失败时，才继续排查系统加密提供程序、PowerShell 5.1、网络请求组件或用户配置文件问题。'
  exit 2
}

Write-Output 'Node 运行时预检失败，但未命中已知的 CSPRNG / 加密提供程序特征。'
Write-Output '请先查看上面的 stderr，再决定是否继续执行 npm / node 脚本。'
exit 3
