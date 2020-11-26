<template>
  <div>
    <Box title="标签" fill>
      <Tags :tags="tags.docs" />
    </Box>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { transition } from '@/plugins/transition'
import { beforeAsyncData } from '@/utils/shared'
import Box from '@/components/box'
import Tags from '@/components/tags'

const TAGS_QUERY = gql`
  query tags($page: Int, $limit: Int) {
    tags(page: $page, limit: $limit) {
      docs {
        name
      }
    }
  }
`

export default {
  head() {
    return {
      title: '标签 | hiweb',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '标签' },
        { hid: 'description', name: 'description', content: '标签' }
      ]
    }
  },
  transition,
  components: {
    Box,
    Tags
  },
  asyncData: beforeAsyncData(({ app, route }) => {
    return app.apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: TAGS_QUERY,
        variables: {
          page: 1,
          limit: 100
        }
      })
      .then((result) => {
        return { tags: result.data.tags }
      })
  })
}
</script>
