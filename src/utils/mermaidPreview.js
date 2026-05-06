export function svgToDataUrl(svgMarkup = '') {
  const normalizedSvg = String(svgMarkup || '').trim()

  if (!normalizedSvg) {
    return ''
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(normalizedSvg)}`
}
