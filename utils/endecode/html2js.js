// from https://github.com/zxlie/FeHelper/blob/master/apps/en-decode/endecode-lib.js

/**
 * html代码转换成js
 * @param txt
 * @returns {string}
 */
export function html2js(txt) {
  const htmlArr = txt
    .replace(/\\/g, '\\\\')
    .replace(/\\/g, '\\/')
    .replace(/'/g, "\\'")
    .split('\n')
  const len = htmlArr.length
  const outArr = []
  outArr.push('let htmlCodes = [\n')
  htmlArr.forEach((value, index) => {
    if (value !== '') {
      if (index === len - 1) {
        outArr.push("'" + value + "'")
      } else {
        outArr.push("'" + value + "',\n")
      }
    }
  })
  outArr.push('\n].join("");')
  return outArr.join('')
}
