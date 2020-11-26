<template>
  <div>
    <Archive :date="archive.date" :posts="archive.posts" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { transition } from '@/plugins/transition'
import Archive from '@/components/archive'
import { beforeAsyncData } from '@/utils/shared'

const archiveQuery = gql`
  query archive($date: String!) {
    archive(date: $date) {
      id
      date
      posts {
        id
        title
        created
        poster
      }
    }
  }
`

export default {
  transition,
  components: {
    Archive
  },
  head() {
    return {
      title: this.$route.params.date + ' - 存档 | hiweb',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '存档' },
        { hid: 'description', name: 'description', content: '文章存档' }
      ]
    }
  },
  validate({ params }) {
    // 匹配年月：2020-01
    return /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]$/.test(params.date)
  },
  asyncData: beforeAsyncData(({ params, app }) => {
    return app.apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: archiveQuery,
        variables: { date: params.date }
      })
      .then(({ data }) => {
        return {
          archive: data.archive
        }
      })
  })
}
</script>
