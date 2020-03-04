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

  // 设置为全局变量，以便获取数据时可以在组件外调用
  window.__defaultClient = app.apolloProvider.clients.defaultClient
}
