<template>
  <div :class="$style.archive">
    <TimeLine :title="date | formatDate('YYYY年MM月')">
      <TimeLineItem v-for="post in posts" :key="post.id" :class="$style.item">
        <nuxt-link
          v-if="post.poster"
          :to="'/post/' + post.id + '/'"
          :class="$style.left"
        >
          <client-only>
            <img v-lazy="post.poster + '!/sq/100'" />
          </client-only>
        </nuxt-link>
        <div :class="$style.right">
          <p :class="$style.date">
            {{ post.created | formatDate('YYYY-MM-DD') }}
          </p>
          <nuxt-link
            :to="'/post/' + post.id + '/'"
            :title="post.title"
            class="v-text-primary"
          >
            {{ post.title }}
          </nuxt-link>
        </div>
      </TimeLineItem>
    </TimeLine>
  </div>
</template>

<script>
import TimeLine from 'lvan/timeline'
import TimeLineItem from 'lvan/timeline/item.vue'

export default {
  components: {
    TimeLine,
    TimeLineItem,
  },
  props: {
    date: {
      type: String,
      required: true,
    },
    posts: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="postcss" module>
.archive {
  padding: var(--gap);
  &:last-child {
    margin-bottom: 0;
  }
}
.date {
  padding: 4px 0;
  font-size: 12px;
  color: var(--textRegular);
}
.item {
  display: flex;
  overflow: hidden;
  margin-top: -5px;
}
.left {
  margin-top: 5px;
  margin-right: 10px;
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: var(--background);
  overflow: hidden;
  & img {
    border-radius: inherit;
  }
}
.right {
  flex: 1;
  font-size: 16px;
}
</style>
