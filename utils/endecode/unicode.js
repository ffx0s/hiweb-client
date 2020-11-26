/* eslint-disable */

// from: https://github.com/zxlie/FeHelper/blob/master/apps/en-decode/endecode-lib.js

export { uniEncode, uniDecode }

/**
 * 此方法实现中文向Unicode的转码，与Jre中的"native2ascii"命令一样
 * @param {String} text 需要进行转码的字符串
 * @return {String} Unicode码
 */
let uniEncode = function(text) {
  let res = []
  for (let i = 0; i < text.length; i++) {
    res[i] = ('00' + text.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}

/**
 * 此方法用于将Unicode码解码为正常字符串
 * @param {Object} text
 */
let uniDecode = function(text) {
  text = text.replace(/(\\)?\\u/gi, '%u').replace('%u0025', '%25')
  text = unescape(text.toString().replace(/%2B/g, '+'))

  let matches = text.match(/(%u00([0-9A-F]{2}))/gi)
  if (matches) {
    for (let matchid = 0; matchid < matches.length; matchid++) {
      let code = matches[matchid].substring(1, 3)
      let x = Number('0x' + code)
      if (x >= 128) {
        text = text.replace(matches[matchid], code)
      }
    }
  }
  text = unescape(text.toString().replace(/%2B/g, '+'))

  return text
}
