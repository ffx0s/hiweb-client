import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import Toast from 'lvan/toast/plugin'
import Modal from 'lvan/modal/plugin'
import transferDom from 'lvan/directives/transferDom'
import CommentItem from '@/components/comment/item'
import { githubLogin } from '@/utils/directives'
import { upyImage } from '@/utils/filters'

Vue.use(VueLazyload, {
  error: require('@/assets/images/broken.svg'),
  attempt: 1,
  filter: {
    progressive(listener, options) {
      listener.src = upyImage(listener.src)
    },
  },
  listenEvents: ['scroll', 'resize', 'animationend', 'transitionend'],
  // throttleWait: 200,
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1,
  },
})
Vue.use(Toast)
Vue.use(Modal)

Vue.directive('github-login', githubLogin)
Vue.directive('transfer-dom', transferDom)

Vue.component('CommentItem', CommentItem)

// 解决 generate 生成的 200.html 无 apollo.defaultClient 对象导致报错的问题
if (process.client) {
  if (window.__NUXT && !window.__NUXT__.apollo) {
    window.__NUXT__.apollo = { defaultClient: {} }
  }
}
