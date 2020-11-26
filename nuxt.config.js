import axios from 'axios'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { apiUrl } from './config'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
      // 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏
      // { name: 'apple-mobile-web-app-capable', content: 'yes' },
      // // 顶部状态栏：黑色
      // {
      //   name: 'apple-mobile-web-app-status-bar-style',
      //   content: 'black'
      // }
    ],
    link: []
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2196f3' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/app.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/apolloMixins', ssr: true },
    { src: '~/plugins/nossr', ssr: false },
    { src: '~/plugins/universal' },
    { src: '~/plugins/analytics', ssr: false },
    { src: '~/plugins/transition', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    [
      'nuxt-payload-extractor',
      {
        blacklist: ['/edit', '/manage', '/404'],
        versioning: false
      }
    ]
  ],
  apollo: {
    clientConfigs: {
      default: '~/config/apollo'
    },
    includeNodeModules: true
    // defaultOptions: {
    //   // See 'apollo' definition
    //   // For example: default query options
    //   $query: {
    //     // fetchPolicy: 'no-cache'
    //     fetchPolicy: 'network-only'
    //   }
    // }
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/lvan\/(?!node_modules)/],
    splitChunks: {
      layouts: false,
      pages: true,
      commons: false
    },
    // analyze: true,
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
          stage: 3,
          features: {
            'nesting-rules': true
          }
        }
      }
    }
  },

  ignore: ['pages/**/modules/*'],

  render: {
    resourceHints: false
  },

  router: {
    extendRoutes(routes) {
      for (const route of routes) {
        route.pathToRegexpOptions = { strict: true }
        const re = /\/$/
        if (!re.test(route.path)) {
          route.path += '/'
        }
      }
    },
    trailingSlashes: true,
    prefetchLinks: false,
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
  },

  hooks: {
    generate: {
      async before(nuxt, generateOptions) {
        const LocalStorage = require('node-localstorage').LocalStorage
        const localStorage = new LocalStorage('./scratch')
        const cache = new InMemoryCache()

        localStorage.clear()

        process.___cache = cache

        await persistCache({
          cache,
          storage: localStorage
        })
      }
    }
  },

  generate: {
    interval: 800,
    exclude: [/^(?=.*\bedit\b).*$/, /^(?=.*\bmanage\b).*$/],
    // fallback: false,
    // subFolders: false,
    async routes() {
      const rIdx = process.argv.indexOf('-r')
      if (rIdx !== -1) {
        // it will never be 0 as that would be the node/nuxt command
        const routes = process.argv[rIdx + 1].split(',')
        return routes
      }

      const result = await axios.post(apiUrl, {
        query: 'query{routes(postLimit: 8, archiveLimit: 5, tagLimit: 8)}'
      })

      // return default / all routes
      return result.data.data.routes
    }
  }
}
