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
