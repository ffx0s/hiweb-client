export function beforeAsyncData(asyncDataFn) {
  return function asyncData(context) {
    if (process.static && process.client && context.$payloadURL) {
      return context.$axios.$get(context.$payloadURL(context.route))
    } else {
      return asyncDataFn(context)
    }
  }
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time))

// 解决 ios 不支持 select 方法
function selectText(textbox, startIndex, stopIndex) {
  if (textbox.createTextRange) {
    const range = textbox.createTextRange()
    range.collapse(true)
    range.moveStart('character', startIndex)
    range.moveEnd('character', stopIndex - startIndex)
    range.select() // ios 无效
  } else {
    // firefox / chrome
    textbox.setSelectionRange(startIndex, stopIndex)
    textbox.focus()
  }
}

/**
 * 复制内容到粘贴板
 * @param {String} text 复制的文字
 * @returns {Promise} promise
 */
export async function copy(text) {
  text = text.toString()

  try {
    return await navigator.clipboard.writeText(text)
  } catch (error) {}

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = 0
  document.body.appendChild(textArea)

  selectText(textArea, 0, text.length)

  let err = null

  try {
    if (!document.execCommand('copy')) {
      err = new Error('复制失败')
    }
  } catch (error) {
    err = error
  }

  document.body.removeChild(textArea)

  if (err) return Promise.reject(err)
}

export function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest()
    http.open('GET', url, true)
    http.responseType = 'blob'
    http.onload = function(event) {
      if (http.status === 200 || http.status === 0) {
        resolve(http.response)
      } else {
        reject(new Error('网络错误：' + http.status))
      }
    }
    http.onerror = () => reject(new Error('加载失败'))
    http.send()
  })
}
