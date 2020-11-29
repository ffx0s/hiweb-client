import gql from 'graphql-tag'
import { transition } from '@/plugins/transition.client'
import List from '@/components/list'
import { isFunction } from '@/utils/shared'

const POST_QUERY = gql`
  query getPosts($page: Int, $limit: Int, $category: String, $tag: String) {
    posts(page: $page, limit: $limit, category: $category, tag: $tag) {
      docs {
        id
        title
        summary
        tags
        pv
        created
        poster
        category {
          id
          name
        }
      }
      limit
      total
      page
      pages
    }
  }
`

export default function createList({
  title,
  description,
  keywords,
  routeOptions,
  slotComponent,
}) {
  return {
    transition,
    head() {
      return {
        title: this.getValue(title),
        meta: [
          {
            hid: 'keywords',
            name: 'keywords',
            content: this.getValue(keywords),
          },
          {
            hid: 'description',
            name: 'description',
            content: this.getValue(description),
          },
        ],
      }
    },
    asyncData({ params, app, route }) {
      return app.apolloProvider.defaultClient
        .query({
          fetchPolicy: 'no-cache',
          query: POST_QUERY,
          variables: {
            limit: 8,
            page: params.page ? +params.page : 1,
            category: params.category || '',
            tag: params.tag || '',
          },
        })
        .then((result) => {
          return { posts: result.data.posts }
        })
    },
    render(h) {
      return h(
        List,
        { props: { data: this.posts, routeOptions } },
        slotComponent && [h(slotComponent)]
      )
    },
    methods: {
      getValue(value) {
        return isFunction(value) ? value.call(this) : value
      },
    },
  }
}
