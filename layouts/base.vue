<template>
  <div class="layout">
    <AppHeader :class="$style.header" />
    <div class="wrapper">
      <nuxt />
    </div>
    <client-only>
      <BackToTop v-if="!isMobile" />
    </client-only>
  </div>
</template>

<script>
import BackToTop from 'lvan/backToTop/index.vue'
import AppHeader from '@/components/header/index2'

export default {
  components: {
    BackToTop,
    AppHeader
  },
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    this.isMobile = 'ontouchstart' in document
  }
}
</script>

<style lang="postcss" module>
@media (max-width: 414px) {
  .header {
    display: none;
  }
}
</style>
