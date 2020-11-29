import { githubLoginUrl } from '../config'

export const githubLogin = {
  inserted(el) {
    el.setAttribute(
      'href',
      githubLoginUrl + '?callback=' + encodeURIComponent(location.href)
    )
  },
}
