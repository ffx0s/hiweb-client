<template>
  <div>
    <div :class="$style.title">
      <slot name="title" />
      <span>{{ title }}</span>
      <nuxt-link
        :class="$style.link"
        v-if="link"
        :to="link"
        active-class=""
        title="查看更多"
      >
        <i class="icon-right-open-big"></i>
      </nuxt-link>
    </div>
    <div :class="[$style.content, contentClass]">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    sticky: {
      type: Boolean,
      default: false
    },
    contentClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="postcss" module>
.title {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px 22px 0;
  font-size: 18px;
  color: var(--textPrimary);
  justify-content: space-between;
  &:before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    width: 7px;
    height: 25px;
    background-color: var(--background);
  }
}
.content {
  padding: 10px var(--gap) 20px;
}
.link {
  color: var(--textPrimary);
  font-size: 12px;
}
</style>
