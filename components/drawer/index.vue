<template>
  <Drawer
    v-model="showDrawer"
    :class="$style.drawer"
    :width="180"
    direction="right"
    selector=".layout"
  >
    <div :class="$style.menu" @click="handleClick">
      <nuxt-link
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.name}/`"
        :active-class="$style.active"
      >
        {{ category.name }}
      </nuxt-link>
      <nuxt-link :active-class="$style.active" to="/archives/page/1/">
        存档
      </nuxt-link>
      <nuxt-link :active-class="$style.active" to="/tags/">标签</nuxt-link>
      <nuxt-link :active-class="$style.active" to="/about/">关于</nuxt-link>
    </div>
  </Drawer>
</template>

<script>
import Drawer from 'lvan/drawer'

export default {
  components: {
    Drawer,
  },
  computed: {
    showDrawer: {
      get() {
        return this.$store.state.showDrawer
      },
      set(value) {
        this.$store.commit('showDrawer', value)
      },
    },
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories'),
    },
  },
  methods: {
    handleClick(event) {
      if (event.target.tagName.toLowerCase() === 'a') {
        setTimeout(() => {
          this.showDrawer = false
        }, 500)
      }
    },
  },
}
</script>

<style lang="postcss" module>
.drawer {
  background-color: rgb(24, 25, 27);
}

.menu {
  padding-top: 20px;
  & a {
    padding: 0 20px 0 30px;
    display: block;
    font-size: 20px;
    color: #fff;
    height: 52px;
    line-height: 52px;
    transition: 0.3s ease;
    &.active {
      color: #fff;
      background-color: #000;
    }
  }
}

@media (hover: hover) {
  .menu {
    & a {
      &:hover {
        color: #fff;
        background-color: var(--textRegular);
      }
    }
  }
}
</style>
