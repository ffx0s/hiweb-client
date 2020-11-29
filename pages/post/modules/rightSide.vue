<template>
  <div>
    <AdjacentPosts :post="adjacentPosts" />
    <client-only>
      <Toc :tocs="toc" />
    </client-only>
    <VAuth :show-error="false">
      <Toolbar :class="$style.toolbar">
        <VButton type="icon" title="编辑" @click="edit">
          <i class="icon-edit"></i>
        </VButton>
        <VButton type="icon" title="删除" @click="remove">
          <i class="icon-trash-empty"></i>
        </VButton>
      </Toolbar>
    </VAuth>
  </div>
</template>

<script>
import VButton from 'lvan/button'
import Toc from '@/components/side/toc'
import AdjacentPosts from '@/components/side/adjacentPosts'
import VAuth from '@/components/auth'
import Toolbar from '@/components/toolbar'

export default {
  components: {
    Toc,
    AdjacentPosts,
    Toolbar,
    VButton,
    VAuth,
  },
  props: {
    adjacentPosts: {
      type: Object,
      required: true,
    },
    toc: {
      type: Array,
      required: true,
    },
  },
  methods: {
    edit() {
      this.$router.push({ name: 'edit', query: { id: this.$route.params.id } })
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
                id: vm.$route.params.id,
              },
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
        },
      })
    },
  },
}
</script>

<style lang="postcss" module>
.toolbar {
  margin-top: var(--gap);
}
</style>
