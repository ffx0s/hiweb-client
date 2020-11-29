<template>
  <div :class="$style.card">
    <div v-if="data.poster" :class="$style.left">
      <nuxt-link :class="$style.imageLink" :to="to">
        <client-only>
          <img v-lazy="data.poster + '!/both/186x129'" :class="$style.image" />
        </client-only>
      </nuxt-link>
    </div>
    <div :class="$style.right">
      <h4>
        <nuxt-link :class="$style.titleLink" :to="to" :title="data.title">
          {{ data.title }}
        </nuxt-link>
      </h4>
      <p :class="$style.summary">{{ data.summary }}...</p>
      <div :class="$style.info">
        <span>
          <i class="icon-clock"></i>
          {{ data.created | ago }}
        </span>
        <nuxt-link
          :class="$style.tag"
          :to="'/category/' + data.category.name + '/'"
          active-class=""
        >
          <i class="icon-th-large"></i>
          {{ data.category.name }}
        </nuxt-link>
        <!-- <nuxt-link
          v-for="tagItem in data.tags"
          :key="tagItem"
          :class="$style.tag"
          :to="/tag/ + tagItem + '/'"
          active-class=""
        >
          <i class="icon-tag"></i>
          {{ tagItem }}
        </nuxt-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: [Object, null],
      default: null,
    },
    data: {
      type: Object,
      default: () => ({
        title: '',
        poster: '',
        summary: '',
        content: '',
        category: { id: null, name: '' },
        created: '',
        tags: [],
      }),
    },
  },
}
</script>

<style lang="postcss" module>
.card {
  display: flex;
  padding: var(--gap);
}
.left {
  width: 7.75rem;
  height: 5.375rem;
  margin-right: 1.375rem;
  /* 缓解 safari 懒加载图片滚动到顶部或顶部页面抖动问题 */
  overflow: hidden;
}
.right {
  flex: 1;
}
.imageLink {
  display: block;
  background-color: var(--lightBackgroundActive);
  border-radius: 4px;
  height: 100%;
}
.image {
  display: block;
  border-radius: inherit;
}
.titleLink {
  font-size: 1.25rem;
  color: var(--textPrimary);
}
.summary {
  margin-top: 0.875rem;
  font-size: 0.875rem;
  color: var(--textRegular);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.info {
  margin-top: 1rem;
  font-size: 12px;
  color: var(--textRegular);
  line-height: 16px;
}
.tag {
  margin-left: 6px;
  color: var(--textRegular);
}

@media (max-width: 425px) {
  .card {
    border-bottom: 1px solid var(--background);
  }
  .left {
    margin-right: 0;
    order: 2;
  }
  .right {
    margin-right: 1.375rem;
  }
  .summary {
    display: none;
  }
}
</style>
