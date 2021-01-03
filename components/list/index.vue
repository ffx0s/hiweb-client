<template>
  <SideView>
    <div v-if="data.docs.length" class="gap-margin-bottom">
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
      :page-count="data.pages"
      :initial-page="data.page - 1"
      :route-options="routeOptions"
      position="center"
    />

    <Error
      v-else-if="!data.total || data.page > data.pages"
      :error="{ message: '太懒了，什么都没有！' }"
    />

    <div slot="side">
      <Notes />
      <Archive />
      <Tag />
      <AppFooter />
    </div>
  </SideView>
</template>

<script>
import Card from '@/components/cards/c2'
import Pagination from '@/components/pagination'
import Error from '@/layouts/error'
import Archive from '@/components/side/archive'
import Tag from '@/components/side/tag'
import Notes from '@/components/side/notes'
import AppFooter from '@/components/footer'
import SideView from '@/components/sideView'

export default {
  name: 'List',
  components: {
    Card,
    Pagination,
    Error,
    Archive,
    Tag,
    Notes,
    AppFooter,
    SideView,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    routeOptions: {
      type: Function,
      default(page) {
        return {
          name: this.$route.name,
          params: { page },
        }
      },
    },
  },
}
</script>
