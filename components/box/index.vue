<template>
  <div :class="[{ [$style.fill]: fill }, $style.box]">
    <div :class="[$style.title, { [$style.bigTitle]: bigTitle }]">
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
    contentClass: {
      type: String,
      default: ''
    },
    fill: {
      type: Boolean,
      default: false
    },
    bigTitle: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss" module>
.box {
  padding: var(--gap);
}
.title {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: var(--textPrimary);
  justify-content: space-between;
}
.content {
  padding-top: 15px;
}
.link {
  color: var(--textPrimary);
  font-size: 12px;
}
.fill {
  min-height: 85vh;
}
.bigTitle {
  font-size: 22px;
}
</style>
