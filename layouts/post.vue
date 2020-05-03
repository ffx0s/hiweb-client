<template>
  <div class="layout">
    <AppHeader :class="$style.postHeader" />
    <div class="wrapper columns">
      <div class="column1">
        <nuxt class="main" />
      </div>
      <div class="column2">
        <Toc />
      </div>
    </div>
    <client-only>
      <BackToTop v-if="!isMobile" />
    </client-only>
  </div>
</template>

<script>
import BackToTop from 'lvan/backToTop/index.vue'
import AppHeader from '@/components/header/index2'
import Toc from '@/components/side/toc'

export default {
  components: {
    BackToTop,
    AppHeader,
    Toc
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
  .postHeader {
    display: none;
  }
}
</style>
