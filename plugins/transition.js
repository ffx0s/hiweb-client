import { transition as transitionWrap } from 'lvan/route/nuxt/transition'
import { view, noop } from 'lvan/utils/shared'

export const transition = transitionWrap('', () => {
  const viewWidth = view.width()
  const options = {
    effect: viewWidth >= 500 ? 'android' : 'ios'
  }
  // 页面超过 900px 宽度不使用路由动画
  if (viewWidth >= 900) {
    options.name = ''
    options.beforeEnter = noop
    options.beforeLeave = noop
    options.mode = 'out-in'
  }
  return options
})
