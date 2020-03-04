<template>
  <div>
    <AppHeader />
    <div :class="['wrapper']">
      <nuxt :class="$style.main" />
      <AppFooter />
    </div>
    <BackToTop />
  </div>
</template>

<script>
import BackToTop from 'lvan/backToTop/index.vue'
import AppHeader from '@/components/header/index2'
import AppFooter from '@/components/footer'

export default {
  components: {
    BackToTop,
    AppHeader,
    AppFooter
  }
}
</script>

<style lang="postcss" module>
.main {
  margin-top: var(--gap);
  min-height: 100vh;
}
</style>
