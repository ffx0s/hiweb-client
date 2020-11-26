<template>
  <Box title="推荐">
    <ul>
      <li v-if="post.prev" :class="$style.item">
        <nuxt-link
          :title="post.prev.title"
          :class="$style.link"
          :to="`/post/${post.prev.id}/`"
        >
          {{ post.prev.title }}
        </nuxt-link>
      </li>
      <li v-if="post.next" :class="$style.item">
        <nuxt-link
          :title="post.next.title"
          :class="$style.link"
          :to="`/post/${post.next.id}/`"
        >
          {{ post.next.title }}
        </nuxt-link>
      </li>
    </ul>
  </Box>
</template>

<script>
import Box from '@/components/box'

export default {
  components: {
    Box
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="postcss" module>
.item {
  margin-bottom: 10px;
  font-size: 14px;
  & a {
    color: var(--textPrimary);
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
