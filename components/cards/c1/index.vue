<template>
  <div :class="$style.card">
    <div v-if="data.poster" :class="$style.header">
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component :is="tag" :class="$style.imageLink" :to="to">
        <client-only>
          <img v-lazy="data.poster" :class="$style.image" />
        </client-only>
      </component>
    </div>

    <div :class="$style.content">
      <div :class="$style.meta">
        <span>
          <i class="icon-clock"></i>
          {{ data.created | ago }}
        </span>
        <!-- category -->
        <nuxt-link
          :class="$style.tag"
          :to="'/category/' + data.category.name + '/'"
          active-class=""
        >
          <i class="icon-th-large"></i>
          {{ data.category.name }}
        </nuxt-link>
        <!-- tag -->
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
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-else-if="data.content"
        :class="[$style.body, 'markdown-body']"
        @click="showImageViewer"
        v-html="data.content"
      />

      <slot />
    </div>

    <client-only>
      <ImageViewer ref="viewer" v-transfer-dom :images="images" />
    </client-only>
  </div>
</template>

<script>
import ImageViewer from 'lvan/imageViewer'

export default {
  components: {
    ImageViewer,
  },
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
        tags: [],
      }),
    },
    to: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      tag: this.to ? 'nuxt-link' : 'div',
      images: [],
    }
  },
  methods: {
    showImageViewer({ target }) {
      const tagName = target.tagName.toLowerCase()
      const selector = '.markdown-body img'

      if (tagName === 'img' && target.complete) {
        if (!this.images.length) {
          const images = []
          const imgs = document.querySelectorAll(selector)

          imgs.forEach((el) => {
            images.push({
              src: el.src,
              alt: el.alt,
              thumbnail: el.src,
              w: el.naturalWidth,
              h: el.naturalHeight,
            })
          })

          this.images = images
        }

        const index = this.images.findIndex((img) => img.src === target.src)

        this.$nextTick(() => {
          this.$refs.viewer.show({ index, selector })
        })
      }
    },
  },
}
</script>

<style lang="postcss" module>
@import './style.css';
</style>
