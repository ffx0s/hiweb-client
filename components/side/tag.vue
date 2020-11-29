<template>
  <Box title="标签" link="/tags/">
    <Tags :tags="tags.docs" />
  </Box>
</template>

<script>
import gql from 'graphql-tag'
import Box from '@/components/box'
import Tags from '@/components/tags'

const TAGS_QUERY = gql`
  query tags($limit: Int) {
    tags(limit: $limit) {
      docs {
        id
        name
      }
    }
  }
`

export default {
  components: {
    Box,
    Tags,
  },
  data() {
    return {
      tags: {
        docs: [],
      },
    }
  },
  apollo: {
    tags: {
      query: TAGS_QUERY,
      variables: {
        limit: 20,
      },
    },
  },
}
</script>
