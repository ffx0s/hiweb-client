<template>
  <div :class="$style.layout">
    <AppHeader />
    <div :class="['wrapper', $style.columns]">
      <div :class="$style.column1">
        <nuxt :class="$style.main" />
      </div>
      <div :class="[$style.column2]">
        <div class="box">
          <Category />
          <Archive />
          <Tag />
        </div>
        <Toc :class="$style.toc" />
      </div>
    </div>
    <AppFooter />
    <client-only>
      <BackToTop :class="$style.totop" />
    </client-only>
  </div>
</template>

<script>
import BackToTop from 'lvan/backToTop/index.vue'
import AppHeader from '@/components/header/index2'
import AppFooter from '@/components/footer'
import Category from '@/components/side/category'
import Archive from '@/components/side/archive'
import Tag from '@/components/side/tag'
import Toc from '@/components/side/toc'

export default {
  components: {
    BackToTop,
    AppHeader,
    AppFooter,
    Category,
    Archive,
    Tag,
    Toc
  }
}
</script>

<style lang="postcss" module>
.columns {
  padding-top: var(--gap);
  padding-bottom: var(--gap);
  display: flex;
  min-height: 100vh;
}

.column1 {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.column2 {
  margin-left: var(--gap);
  width: var(--sideWidth);
}

.main {
  height: 100%;
  /* width: 100%; */
  /* background-color: var(--background); */
}

@media (max-width: 1000px) {
  .columns {
    flex-direction: column;
  }

  .column2 {
    margin-top: var(--gap);
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 414px) {
  .layout .columns {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }
  .totop {
    display: none;
  }
}
</style>
