<template>
  <Box title="笔记" link="/category/笔记/">
    <nuxt-link
      v-for="post in posts.docs"
      :key="post.id"
      :title="post.title"
      :class="$style.link"
      :to="`/post/${post.id}/`"
    >
      {{ post.title }}
    </nuxt-link>
  </Box>
</template>

<script>
import gql from 'graphql-tag'
import Box from '@/components/box'

const POST_QUERY = gql`
  query getPosts($page: Int, $limit: Int, $category: String, $tag: String) {
    posts(page: $page, limit: $limit, category: $category, tag: $tag) {
      docs {
        id
        title
      }
    }
  }
`

export default {
  components: {
    Box,
  },
  data() {
    return {
      posts: {
        docs: [],
      },
    }
  },
  apollo: {
    posts: {
      query: POST_QUERY,
      variables: {
        limit: 5,
        category: '笔记',
      },
    },
  },
}
</script>

<style lang="postcss" module>
.link {
  display: block;
  padding: 7px 0;
  font-size: 16px;
  color: var(--textPrimary);
}
</style>
