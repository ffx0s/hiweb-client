<template>
  <div>
    <div v-if="data.docs.length" :class="$style.list" class="box">
      <Card
        v-for="post in data.docs"
        :key="post.id"
        :to="{ name: 'post-id', params: { id: post.id } }"
        :data="post"
      />
    </div>

    <Pagination
      v-if="data.pages > 1 && data.docs.length"
      :prev-text="'上一页'"
      :next-text="'下一页'"
      :pageCount="data.pages"
      :initial-page="data.page - 1"
      :routeOptions="routeOptions"
      position="center"
    />

    <Error
      v-else-if="!data.total || data.page > data.pages"
      :error="{ message: '太懒了，什么都没有！' }"
    />
  </div>
</template>

<script>
import Card from '@/components/cards/c2'
import Pagination from '@/components/pagination'
import Error from '@/layouts/error'

export default {
  name: 'List',
  components: {
    Card,
    Pagination,
    Error
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    routeOptions: {
      type: Function,
      default(page) {
        return {
          name: this.$route.name,
          params: { page }
        }
      }
    }
  }
}
</script>

<style lang="postcss" module>
.list {
  margin-bottom: var(--gap);
}
</style>
