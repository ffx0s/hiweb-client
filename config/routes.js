/**
 * 构建静态化页面时生成动态路由
 */

import axios from 'axios'
import { formatDate } from '../utils/filters'
import { apiUrl } from './index'

function createListRoutes({ routePath, name, limit, query = '' }) {
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

  // postRoutes
  const postRoutes = await axios
    .post(apiUrl, { query: 'query {postIds}' })
    .then(({ data }) => {
      return data.data.postIds.map((id) => '/post/' + id + '/')
    })

  // categories
  const categories = await axios
    .post(apiUrl, {
      query: 'query {categories {name}}'
    })
    .then(({ data }) => {
      return data.data.categories.map(({ name }) => name)
    })

  // categoryRoutes
  let categoryRoutes = []
  await Promise.all(
    categories.map((name) => {
      return createListRoutes({
        routePath: '/category/' + name + '/',
        name: 'posts',
        limit: 8,
        query: `category: "${name}"`
      }).then((routes) => {
        categoryRoutes.push('/category/' + name + '/')
        categoryRoutes = categoryRoutes.concat(routes)
      })
    })
  )

  // archiveListRoutes
  const archiveLimit = 5
  const archiveListRoutes = await createListRoutes({
    routePath: '/archives/page/',
    name: 'archives',
    limit: archiveLimit
  })

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

  // tagListRoutes
  const tags = await axios
    .post(apiUrl, {
      query: 'query {tags(page: 1, limit: 100) { docs { name } }}'
    })
    .then(({ data }) => {
      return data.data.tags.docs.map(({ name }) => name)
    })

  let tagListRoutes = []
  await Promise.all(
    tags.map((name) => {
      return createListRoutes({
        routePath: '/tag/' + name + '/',
        name: 'posts',
        limit: 8,
        query: `tag: "${name}"`
      }).then((routes) => {
        tagListRoutes.push('/tag/' + name + '/')
        tagListRoutes = tagListRoutes.concat(routes)
      })
    })
  )

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
