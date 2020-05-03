<template>
  <div class="columns">
    <div class="column1">
      <Card :data="post" />

      <Comment :typeId="$route.params.id" type="POST" />

      <Auth :showError="false">
        <Toolbar>
          <VButton @click="edit" type="icon" title="编辑这篇文章">
            <i class="icon-edit"></i>
          </VButton>
          <VButton @click="remove" type="icon" title="删除这篇文章">
            <i class="icon-trash-empty"></i>
          </VButton>
        </Toolbar>
      </Auth>
    </div>
    <div class="column2">
      <AdjacentPosts :post="adjacentPosts" />
      <client-only>
        <Toc :tocs="post.toc" />
      </client-only>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import VButton from 'lvan/button/index.vue'
import Card from '@/components/cards/c1'
import Comment from '@/components/comment'
import Toolbar from '@/components/toolbar'
import Auth from '@/components/auth'
import Toc from '@/components/side/toc'
import AdjacentPosts from '@/components/side/adjacentPosts'
import { beforeAsyncData } from '@/utils/shared'

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
  layout: 'base',
  components: {
    Card,
    Comment,
    Toolbar,
    VButton,
    Auth,
    Toc,
    AdjacentPosts
  },
  head() {
    return {
      title: this.post.title + ' | hiweb',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.post.keywords
        },
        {
          hid: 'description',
          name: 'description',
          content: this.post.summary
        }
      ]
    }
  },
  // 使用 apollo 选项加载数据在客户端会先渲染该路由后再加载数据，所以改用 asyncData
  asyncData: beforeAsyncData(({ params, app }) => {
    return app.apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: postQuery,
        variables: { id: params.id }
      })
      .then(({ data }) => {
        return {
          post: data.post,
          adjacentPosts: data.adjacentPosts
        }
      })
  }),
  methods: {
    edit() {
      this.$router.push({ name: 'edit', query: { id: this.post.id } })
    },
    remove() {
      const vm = this
      this.$modal({
        content: '是否删除这篇文章？',
        showCancelButton: true,
        overlayClick: false,
        confirm(instance) {
          instance.confirmLoading = true
          vm.$apollo
            .mutate({
              fetchPolicy: 'no-cache',
              mutation: require('@/graphql/deletePost'),
              variables: {
                id: vm.post.id
              }
            })
            .then(({ data }) => {
              instance.confirmLoading = false
              instance.done()
              vm.$toast({ type: 'success' })
              vm.$router.go(-1)
            })
            .catch((err) => {
              vm.$toast({ type: 'error', title: err.message })
              instance.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="postcss" module></style>
