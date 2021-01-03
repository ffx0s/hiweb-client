<template>
  <div>
    <div class="layout">
      <AppHeader />
      <div class="wrapper columns">
        <div class="container">
          <AnimatedRoute router-view-class="main" />
        </div>
        <div :class="{ active: leftSideActive }" class="side left-side">
          <div class="left-side__scroll">
            <Tools />
            <Links />
          </div>
          <div
            class="left-side__toggle"
            @click="leftSideActive = !leftSideActive"
          >
            <i class="icon-right-open-big"></i>
          </div>
          <div class="left-side__layer" @click="leftSideActive = false"></div>
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
import Links from '@/components/side/Links'
import Drawer from '@/components/drawer'

export default {
  components: {
    AnimatedRoute,
    AppHeader,
    Tools,
    Links,
    Drawer,
  },
  data() {
    return {
      leftSideActive: false,
    }
  },
}
</script>
