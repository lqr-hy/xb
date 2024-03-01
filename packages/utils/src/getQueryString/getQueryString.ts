/**
 * 获取url参数
 *
 * @param {string} queryName 参数名
 * @returns {string} 参数值
 */
export function getQueryString (queryName: string): string {
  const reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  const result = window.location.search.slice(1).match(reg)
  return result !== null ? decodeURIComponent(result[2]) : null
}
