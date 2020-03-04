import createRoutes from './config/routes'

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
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
    { src: '~/plugins/apolloMixins', ssr: false },
    { src: '~/plugins/nossr', ssr: false },
    { src: '~/plugins/universal' },
    { src: '~/plugins/analytics', ssr: false }
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
        blacklist: ['/edit', '/manage', '/404']
        // versioning: true
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
    transpile: ['lvan/utils'],
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

  // transition: {
  //   name: 'page-in',
  //   mode: 'in-out'
  // },

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

  generate: {
    interval: 800,
    exclude: [/^(?=.*\bedit\b).*$/, /^(?=.*\bmanage\b).*$/],
    // fallback: false,
    // subFolders: false,
    async routes() {
      const rIdx = process.argv.indexOf('-r')
      if (rIdx !== -1) {
        // it will never be 0 as that would be the node/nuxt command
        return [process.argv[rIdx + 1]]
      }
      // return default / all routes
      const routes = await createRoutes()

      return routes
    }
  }
}
