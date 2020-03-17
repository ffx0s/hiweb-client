export default function({ app }) {
  // https://github.com/apollographql/apollo-feature-requests/issues/1
  // 阻止 readQuery 没有读取到数据时抛出错误，没有数据时仅返回 undefined
  const cache = app.apolloProvider.clients.defaultClient.cache
  cache.originalReadQuery = cache.readQuery
  cache.readQuery = (...args) => {
    try {
      return cache.originalReadQuery(...args)
    } catch (err) {
      return undefined
    }
  }

  // https://github.com/nuxt-community/apollo-module/issues/251
  // server 端渲染不清除缓存
  cache.originalReset = cache.reset
  cache.reset = (...args) => {
    if (!process.server) {
      cache.originalReset(...args)
    }
  }
}
