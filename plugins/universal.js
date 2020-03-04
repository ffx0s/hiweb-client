import Vue from 'vue'
import { ago, formatDate, upyImage } from '@/utils/filters'

Vue.filter('ago', ago)
Vue.filter('formatDate', formatDate)
Vue.filter('upyImage', upyImage)
