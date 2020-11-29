<template>
  <div>
    <AppHeader />
    <div class="wrapper">
      <nuxt />
    </div>
    <client-only>
      <BackToTop v-if="!isMobile" />
    </client-only>
  </div>
</template>

<script>
import BackToTop from 'lvan/backToTop'
import AppHeader from '@/components/header'

export default {
  components: {
    BackToTop,
    AppHeader,
  },
  data() {
    return {
      isMobile: false,
    }
  },
  mounted() {
    this.isMobile = 'ontouchstart' in document
  },
}
</script>

<style lang="postcss" module></style>
