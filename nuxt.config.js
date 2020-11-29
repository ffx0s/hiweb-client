import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',
      },
      {
        name: 'format-detection',
        content: 'telephone=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      // 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏
      // { name: 'apple-mobile-web-app-capable', content: 'yes' },
      // // 顶部状态栏：黑色
      // {
      //   name: 'apple-mobile-web-app-status-bar-style',
      //   content: 'black'
      // }
    ],
    link: [],
  },

  loading: {
    color: '#2196f3',
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/app.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/analytics.client.js',
    '~/plugins/global.client.js',
    '~/plugins/transition.client.js',
    '~/plugins/apolloMixins.js',
    '~/plugins/global.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  // 非常消耗编译时间，取消使用
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
  ],

  apollo: {
    clientConfigs: {
      default: '~/config/apollo',
    },
    includeNodeModules: true,
    // defaultOptions: {
    //   // See 'apollo' definition
    //   // For example: default query options
    //   $query: {
    //     // fetchPolicy: 'no-cache'
    //     fetchPolicy: 'network-only'
    //   }
    // }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [/lvan\/(?!node_modules)/],
    splitChunks: {
      layouts: false,
      pages: true,
      commons: false,
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient, loaders }) {
      if (isDev && isClient) {
        config.resolve.symlinks = false
      }
    },
    postcss: {
      plugins: {
        'postcss-preset-env': {
          stage: 2,
          features: {
            'nesting-rules': true,
          },
          importFrom: 'assets/css/variables.css',
        },
      },
    },
  },

  ignore: ['pages/**/modules/*'],

  render: {
    resourceHints: false,
  },

  router: {
    trailingSlash: true,
    prefetchLinks: false,
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
  },

  hooks: {
    generate: {
      async before(nuxt, generateOptions) {
        // 通过将第一次apollo请求返回的内容存储本地缓存（不包含设置了no-cache的请求），防止生成器重复请求相同的Api
        // 主要缓存分类、标签、存档等页面公共数据
        const LocalStorage = require('node-localstorage').LocalStorage
        const localStorage = new LocalStorage('./scratch')
        const cache = new InMemoryCache()

        localStorage.clear()

        process.___cache = cache

        await persistCache({
          cache,
          storage: localStorage,
        })
      },
    },
  },

  generate: {
    interval: 800,
    exclude: [/^\/edit/, /^\/manage/],
  },
}
