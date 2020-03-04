<template>
  <div :class="[$style.card, 'box']">
    <div :class="$style.header" v-if="data.poster">
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component :is="tag" :class="$style.imageLink" :to="to">
        <client-only>
          <img :class="$style.image" v-lazy="data.poster" />
        </client-only>
      </component>
    </div>

    <div :class="$style.content">
      <div :class="$style.meta">
        <span>
          <i class="icon-clock"></i>
          {{ data.created | ago }}
        </span>
        &nbsp;
        <nuxt-link
          :class="$style.tag"
          :to="'/category/' + data.category.name + '/'"
          active-class=""
        >
          <i class="icon-th-large"></i>
          {{ data.category.name }}
        </nuxt-link>
        &nbsp;
        <nuxt-link
          v-for="tagItem in data.tags"
          :key="tagItem"
          :class="$style.tag"
          :to="/tag/ + tagItem + '/'"
          active-class=""
        >
          <i class="icon-tag"></i>
          {{ tagItem }}
        </nuxt-link>
      </div>

      <template v-if="to">
        <h4 :class="$style.title">
          <nuxt-link :to="to" :title="data.title">
            {{ data.title }}
          </nuxt-link>
        </h4>
        <div :class="$style.body">{{ data.summary }}...</div>
      </template>
      <div
        :class="[$style.body, 'markdown-body']"
        v-else-if="data.content"
        v-html="data.content"
      />

      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '',
        poster: '',
        summary: '',
        content: '',
        category: { id: null, name: '' },
        created: '',
        tags: []
      })
    },
    to: {
      type: [Object, null],
      default: null
    }
  },
  data() {
    return {
      tag: this.to ? 'nuxt-link' : 'div'
    }
  }
}
</script>

<style lang="postcss" module>
@import './style.css';
</style>
