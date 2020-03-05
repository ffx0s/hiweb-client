/**
 * 构建静态化页面时生成动态路由
 */

import axios from 'axios'
import { formatDate } from '../utils/filters'
import { sleep } from '../utils/shared'
import { apiUrl } from './index'

const delay = 1000

async function createListRoutes({ routePath, name, limit, query = '' }) {
  await sleep(delay)
  return axios
    .post(apiUrl, {
      query: `query {${name}(page: 1, limit: ${limit}, ${query}) { pages }}`
    })
    .then(({ data }) => {
      const routes = []
      let pages = data.data[name].pages
      while (pages > 0) {
        routes.push(routePath + pages + '/')
        pages--
      }
      return routes
    })
}

export default async function createRoutes() {
  // postListRoutes
  const postListRoutes = await createListRoutes({
    routePath: '/list/',
    name: 'posts',
    limit: 8
  })

  await sleep(delay)

  // postRoutes
  const postRoutes = await axios
    .post(apiUrl, { query: 'query {postIds}' })
    .then(({ data }) => {
      return data.data.postIds.map((id) => '/post/' + id + '/')
    })

  await sleep(delay)

  // categories
  const categories = await axios
    .post(apiUrl, {
      query: 'query {categories {name}}'
    })
    .then(({ data }) => {
      return data.data.categories.map(({ name }) => name)
    })

  await sleep(delay)

  // categoryRoutes
  const categoryRoutes = await (async function() {
    let allRoutes = []
    for (let i = 0; i < categories.length; i++) {
      const name = categories[i]
      const routes = await createListRoutes({
        routePath: '/category/' + name + '/',
        name: 'posts',
        limit: 8,
        query: `category: "${name}"`
      })
      allRoutes.push('/category/' + name + '/')
      allRoutes = allRoutes.concat(routes)
    }
    return allRoutes
  })()

  // archiveListRoutes
  const archiveLimit = 5
  const archiveListRoutes = await createListRoutes({
    routePath: '/archives/page/',
    name: 'archives',
    limit: archiveLimit
  })

  await sleep(delay)

  // archiveRoutes
  const archiveTotal = archiveListRoutes.length * archiveLimit
  const archiveRoutes = await axios
    .post(apiUrl, {
      query: `query {archives(page: 1, limit: ${archiveTotal}) { docs { date } }}`
    })
    .then(({ data }) => {
      return data.data.archives.docs.map(
        ({ date }) => '/archives/' + formatDate(date, 'YYYY-MM') + '/'
      )
    })

  await sleep(delay)

  // tagListRoutes
  const tags = await axios
    .post(apiUrl, {
      query: 'query {tags(page: 1, limit: 100) { docs { name } }}'
    })
    .then(({ data }) => {
      return data.data.tags.docs.map(({ name }) => name)
    })

  await sleep(delay)

  const tagListRoutes = await (async function() {
    let allRoutes = []
    for (let i = 0; i < tags.length; i++) {
      const name = tags[i]
      const routes = await createListRoutes({
        routePath: '/tag/' + name + '/',
        name: 'posts',
        limit: 8,
        query: `tag: "${name}"`
      })
      allRoutes.push('/tag/' + name + '/')
      allRoutes = allRoutes.concat(routes)
    }
    return allRoutes
  })()

  const pageRoutes = [].concat(
    categoryRoutes,
    postRoutes,
    postListRoutes,
    archiveRoutes,
    archiveListRoutes,
    tagListRoutes
  )

  return pageRoutes
}
