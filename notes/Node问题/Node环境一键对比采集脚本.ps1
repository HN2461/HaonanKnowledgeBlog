# 生成一份可和站内笔记对照的 Node 环境排查报告，避免只看版本号误判问题。
[CmdletBinding()]
param(
  [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-CommandExists {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name
  )

  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-Capture {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [scriptblock]$ScriptBlock
  )

  try {
    $result = & $ScriptBlock 2>&1 | Out-String
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("### $Title")
    $lines.Add('')
    $lines.Add('```text')

    if ([string]::IsNullOrWhiteSpace($result)) {
      $lines.Add('<empty>')
    } else {
      $lines.Add($result.TrimEnd())
    }

    $lines.Add('```')
    return ($lines -join [Environment]::NewLine)
  } catch {
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("### $Title")
    $lines.Add('')
    $lines.Add('```text')
    $lines.Add("[ERROR] $($_.Exception.Message)")
    $lines.Add('```')
    return ($lines -join [Environment]::NewLine)
  }
}

function Get-NpmrcContent {
  $npmrcPath = Join-Path $HOME '.npmrc'
  if (-not (Test-Path $npmrcPath)) {
    return '<missing>'
  }

  $lines = Get-Content $npmrcPath
  $sanitized = foreach ($line in $lines) {
    if ($line -match '_authToken\s*=') {
      $name = $line.Split('=')[0]
      ($name + '=REDACTED')
    } else {
      $line
    }
  }

  return ($sanitized -join [Environment]::NewLine)
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$computerName = $env:COMPUTERNAME

if (-not $OutputPath) {
  $OutputPath = Join-Path $scriptDir "Node环境对比报告-$computerName-$timestamp.md"
}

$sections = New-Object System.Collections.Generic.List[string]

$sections.Add("# Node 环境对比报告（$computerName）")
$sections.Add('')
$sections.Add("生成时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')")
$sections.Add("用户名：$env:USERNAME")
$sections.Add("脚本位置：$($MyInvocation.MyCommand.Path)")
$sections.Add('')
$sections.Add('> 这份报告用于和站内那篇“Node 环境排查实录”逐项对照，重点看路径、命令命中、.npmrc、PATH、环境变量和加密初始化结果。')
$sections.Add('')

$sections.Add((Invoke-Capture -Title 'PowerShell 版本' -ScriptBlock { $PSVersionTable | Format-List * }))
$sections.Add((Invoke-Capture -Title '系统信息' -ScriptBlock { Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsBuildNumber,OsArchitecture | Format-List }))
$sections.Add((Invoke-Capture -Title 'Node 预检：node -v' -ScriptBlock { node -v }))
$sections.Add((Invoke-Capture -Title 'Node 预检：node -e' -ScriptBlock { node -e "console.log('node-runtime-ok')" }))
$sections.Add((Invoke-Capture -Title 'Node 运行时版本对象' -ScriptBlock { node -p "JSON.stringify(process.versions, null, 2)" }))
$sections.Add((Invoke-Capture -Title 'Node 运行时关键信息' -ScriptBlock {
  node -p "JSON.stringify({ platform: process.platform, arch: process.arch, execPath: process.execPath, argv0: process.argv0, release: process.release, features: process.features }, null, 2)"
}))
$sections.Add((Invoke-Capture -Title '加密能力检查' -ScriptBlock {
  node -e "const crypto=require('crypto'); const tls=require('tls'); console.log('randomBytes', crypto.randomBytes(16).toString('hex')); console.log('webcrypto', !!crypto.webcrypto); console.log('fips', crypto.getFips()); console.log('rootCertificates', tls.rootCertificates.length)"
}))
$sections.Add((Invoke-Capture -Title 'where node/npm/npx/corepack' -ScriptBlock {
  where.exe node
  where.exe npm
  where.exe npx
  where.exe corepack
}))
$sections.Add((Invoke-Capture -Title 'Get-Command node' -ScriptBlock { Get-Command node | Format-List * }))
$sections.Add((Invoke-Capture -Title 'Get-Command npm' -ScriptBlock { Get-Command npm | Format-List * }))
$sections.Add((Invoke-Capture -Title 'Get-Command npx' -ScriptBlock { Get-Command npx | Format-List * }))
$sections.Add((Invoke-Capture -Title 'Get-Command corepack' -ScriptBlock { Get-Command corepack | Format-List * }))

if (Test-CommandExists -Name 'npm') {
  $sections.Add((Invoke-Capture -Title 'npm -v' -ScriptBlock { npm -v }))
  $sections.Add((Invoke-Capture -Title 'npm config get registry/cache/prefix/strict-ssl' -ScriptBlock {
    npm config get registry
    npm config get cache
    npm config get prefix
    npm config get strict-ssl
  }))
  $sections.Add((Invoke-Capture -Title 'npm config ls -l' -ScriptBlock { npm config ls -l }))
  $sections.Add((Invoke-Capture -Title 'npm prefix -g / npm root -g' -ScriptBlock {
    npm prefix -g
    npm root -g
  }))
  $sections.Add((Invoke-Capture -Title 'npm ls -g --depth=0' -ScriptBlock { npm ls -g --depth=0 }))
  $sections.Add((Invoke-Capture -Title 'npm doctor' -ScriptBlock { npm doctor }))
}

$sections.Add((Invoke-Capture -Title '用户级 .npmrc（已脱敏）' -ScriptBlock { Get-NpmrcContent }))
$sections.Add((Invoke-Capture -Title '用户级 PATH' -ScriptBlock { [Environment]::GetEnvironmentVariable('Path', 'User') }))
$sections.Add((Invoke-Capture -Title '机器级 PATH' -ScriptBlock { [Environment]::GetEnvironmentVariable('Path', 'Machine') }))
$sections.Add((Invoke-Capture -Title '当前进程 PATH（分行）' -ScriptBlock { $env:PATH -split ';' }))
$sections.Add((Invoke-Capture -Title '关键环境变量' -ScriptBlock {
  Get-ChildItem Env: |
    Where-Object { $_.Name -match '^(NODE|NPM|PNPM|YARN|COREPACK|SSL|OPENSSL|HTTP|HTTPS|ALL_PROXY|NO_PROXY|PATH)$' } |
    Sort-Object Name |
    Format-Table -AutoSize
}))
$sections.Add((Invoke-Capture -Title 'PowerShell 执行策略' -ScriptBlock { Get-ExecutionPolicy -List | Format-Table -AutoSize }))
$sections.Add((Invoke-Capture -Title '注册表 HKLM\\Software\\Node.js' -ScriptBlock { reg query "HKLM\Software\Node.js" /s }))
$sections.Add((Invoke-Capture -Title '注册表 HKCU\\Software\\Node.js' -ScriptBlock { reg query "HKCU\Software\Node.js" /s }))

$content = $sections -join "`r`n"
Set-Content -Path $OutputPath -Value $content -Encoding utf8

Write-Host "报告已生成：$OutputPath"
