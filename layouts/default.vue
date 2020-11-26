<template>
  <div>
    <div class="layout">
      <AppHeader />
      <div class="wrapper columns">
        <div class="container">
          <AnimatedRoute router-view-class="main" />
        </div>
        <div :class="{ active: leftSideActive }" class="left-side">
          <div class="left-side__scroll">
            <Tools />
          </div>
          <div
            @click="leftSideActive = !leftSideActive"
            class="left-side__toggle"
          >
            <i class="icon-right-open-big"></i>
          </div>
          <div @click="leftSideActive = false" class="left-side__layer"></div>
        </div>
      </div>
    </div>
    <Drawer />
  </div>
</template>

<script>
import AnimatedRoute from 'lvan/route/nuxt'
import AppHeader from '@/components/header'
import Tools from '@/components/side/tools'
import Drawer from '@/components/drawer'

export default {
  components: {
    AnimatedRoute,
    AppHeader,
    Tools,
    Drawer
  },
  data() {
    return {
      leftSideActive: false
    }
  }
}
</script>
