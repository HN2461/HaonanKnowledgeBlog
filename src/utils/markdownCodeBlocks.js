export const CODE_BLOCK_COLLAPSE_LINES = 10

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  jsx: 'JSX',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  vue: 'Vue',
  html: 'HTML',
  xml: 'XML',
  css: 'CSS',
  scss: 'SCSS',
  less: 'Less',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  sql: 'SQL',
  markdown: 'Markdown',
  md: 'Markdown',
  plaintext: '纯文本',
  text: '纯文本'
}

export function normalizeCodeLanguage(info = '') {
  const firstToken = String(info).trim().split(/\s+/)[0] || ''
  return firstToken.toLowerCase().replace(/[^\w#+.-]/g, '')
}

export function getCodeLanguageLabel(language = '') {
  if (!language) {
    return '纯文本'
  }

  return LANGUAGE_LABELS[language] || language
}

export function countCodeLines(content = '') {
  const normalizedContent = String(content).replace(/\r\n?/g, '\n')

  if (!normalizedContent) {
    return 1
  }

  const lines = normalizedContent.split('\n')

  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  return Math.max(lines.length, 1)
}

export function buildCodeLineNumbers(lineCount = 1) {
  const safeLineCount = Math.max(Number(lineCount) || 1, 1)

  return Array.from({ length: safeLineCount }, (_, index) => index + 1).join('\n')
}
