<template>
  <SideView style="padding-top: 0">
    <Card :data="post" />
    <Comment :type-id="$route.params.id" type="POST" />
    <RightSide slot="side" :adjacent-posts="adjacentPosts" :toc="post.toc" />
  </SideView>
</template>

<script>
import gql from 'graphql-tag'
import SideView from '@/components/sideView'
import Card from '@/components/cards/c1'
import Comment from '@/components/comment'
import { transition } from '@/plugins/transition.client'
import RightSide from './modules/rightSide'

const postQuery = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      poster
      title
      keywords
      created
      summary
      content
      tags
      category {
        id
        name
      }
      toc {
        lvl
        slug
        content
      }
    }

    adjacentPosts(id: $id) {
      prev {
        id
        title
      }
      next {
        id
        title
      }
    }
  }
`

export default {
  components: {
    Card,
    Comment,
    SideView,
    RightSide,
  },
  transition,
  // 使用 apollo 选项加载数据在客户端会先渲染该路由后再加载数据，所以改用 asyncData
  asyncData({ params, app }) {
    return app.apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: postQuery,
        variables: { id: params.id },
      })
      .then(({ data }) => {
        data.post.content = data.post.content.replace(
          /<pre/g,
          '<pre ignore-no-bounce'
        )
        return {
          post: data.post,
          adjacentPosts: data.adjacentPosts,
        }
      })
  },
  head() {
    return {
      title: this.post.title + ' | hiweb',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.post.keywords,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.post.summary,
        },
      ],
    }
  },
}
</script>
