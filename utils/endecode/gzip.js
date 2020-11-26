import pako from 'pako'

// from https://github.com/zxlie/FeHelper/blob/master/apps/en-decode/endecode-lib.js

/**
 * gzip加密
 * @param str
 * @returns {*}
 */
export const gzipEncode = (str) => {
  try {
    return window.btoa(pako.gzip(escape(str), { to: 'string' }))
  } catch (e) {
    return 'Error: 当前字符串不能被Gzip加密'
  }
}

/**
 * gzip解密
 * @param str
 * @returns {string}
 */
export const gzipDecode = (str) => {
  try {
    const charData = window
      .atob(str)
      .split('')
      .map((x) => x.charCodeAt(0))
    const data = pako.inflate(new Uint8Array(charData))
    const result = String.fromCharCode.apply(null, new Uint16Array(data))
    try {
      return unescape(result)
    } catch (ee) {
      return result
    }
  } catch (e) {
    return 'Error: 当前字符串不能被Gzip解密'
  }
}
