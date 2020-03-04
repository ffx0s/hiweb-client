import * as timeago from 'timeago.js'
import { cdn } from '../config'

export function ago(time) {
  return timeago.format(time, 'zh_CN')
}

export function formatDate(date, template) {
  const specs = 'YYYY:MM:DD:HH:mm:ss'.split(':')
  date = new Date(+date || Date.now() - new Date().getTimezoneOffset() * 6e4)
  return date
    .toISOString()
    .split(/[-:.TZ]/)
    .reduce(function(template, item, i) {
      return template.split(specs[i]).join(item)
    }, template)
}

export function upyImage(key, params = '') {
  const isImageKey =
    !key.includes('blob:') && !key.includes('http') && !key.includes(';base64,')

  return isImageKey ? cdn + key + params : key
}
