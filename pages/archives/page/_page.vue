<template>
  <div>
    <Box title="存档" big-title>
      <Archive
        v-for="archive in archives.docs"
        :key="archive.date"
        :date="archive.date"
        :posts="archive.posts"
      />
      <Pagination
        v-if="archives.pages > 1"
        :prev-text="'上一页'"
        :next-text="'下一页'"
        :pageCount="archives.pages"
        :initial-page="archives.page - 1"
        :routeOptions="routeOptions"
        position="center"
      />
    </Box>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { transition } from '@/plugins/transition'
import { beforeAsyncData } from '@/utils/shared'
import Box from '@/components/box'
import Pagination from '@/components/pagination'
import Archive from '@/components/archive'

const ARCHIVES_QUERY = gql`
  query archives($page: Int, $limit: Int) {
    archives(page: $page, limit: $limit) {
      docs {
        id
        date
        posts {
          id
          title
          poster
          created
        }
      }
      limit
      total
      page
      pages
    }
  }
`

export default {
  components: {
    Box,
    Pagination,
    Archive
  },
  transition,
  head() {
    return {
      title: '存档 | hiweb',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '存档' },
        { hid: 'description', name: 'description', content: '文章存档' }
      ]
    }
  },
  asyncData: beforeAsyncData(({ params, app, route }) => {
    return app.apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: ARCHIVES_QUERY,
        variables: {
          limit: 5,
          page: params.page ? +params.page : 1,
          category: params.name || ''
        }
      })
      .then((result) => {
        return { archives: result.data.archives }
      })
  }),
  methods: {
    routeOptions(page) {
      return {
        name: this.$route.name,
        params: { page }
      }
    }
  }
}
</script>
