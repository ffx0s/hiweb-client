<template>
  <div :class="$style.avatar">
    <img v-lazy="src || defaultSrc" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      defaultSrc: '/user/default-user-image.png!/fw/100',
    }
  },
}
</script>

<style lang="postcss" module>
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-color: var(--background);
  & img {
    width: 100%;
    border-radius: inherit;
  }
}
</style>
