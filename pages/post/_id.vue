<template>
  <div>
    <Card :data="post" />

    <ul :class="[$style.next, 'row-between']">
      <li v-if="adjacentPosts.prev" :class="[$style.item, 'text-hidden']">
        <span class="v-text-primary">上一篇：</span>
        <nuxt-link
          :title="adjacentPosts.prev.title"
          :class="$style.link"
          :to="`/post/${adjacentPosts.prev.id}/`"
        >
          {{ adjacentPosts.prev.title }}
        </nuxt-link>
      </li>
      <li v-if="adjacentPosts.next" :class="[$style.item, 'text-hidden']">
        <span class="v-text-primary">下一篇：</span>
        <nuxt-link
          :title="adjacentPosts.next.title"
          :class="$style.link"
          :to="`/post/${adjacentPosts.next.id}/`"
        >
          {{ adjacentPosts.next.title }}
        </nuxt-link>
      </li>
    </ul>

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
</template>

<script>
import gql from 'graphql-tag'
import VButton from 'lvan/button/index.vue'
import Card from '@/components/cards/c1'
import Comment from '@/components/comment'
import Toolbar from '@/components/toolbar'
import Auth from '@/components/auth'
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
  components: {
    Card,
    Comment,
    Toolbar,
    VButton,
    Auth
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
  mounted() {
    this.$apollo.provider.clients.defaultClient.writeQuery({
      query: gql`
        query {
          tocs
        }
      `,
      data: {
        tocs: JSON.parse(JSON.stringify(this.post.toc)),
        __typename: 'Tocs'
      }
    })
  },
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

<style lang="postcss" module>
.next {
  padding: 0;
  margin: var(--gap) 0;
  text-align: left;
}
.item {
  max-width: 45%;
  line-height: 20px;
  font-size: 14px;
  & a {
    color: var(--textPrimary);
  }
}
@media (max-width: 414px) {
  .next {
    margin: 20px 10px;
    flex-direction: column;
  }
  .item {
    padding-bottom: 10px;
    max-width: 100%;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
