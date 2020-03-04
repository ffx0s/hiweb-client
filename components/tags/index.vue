<template>
  <div>
    <nuxt-link
      v-for="(tag, i) in tags"
      :key="i"
      :to="`/tag/${encodeURIComponent(tag.name)}/`"
      :class="$style.item"
      :activeClass="$style.active"
    >
      {{ tag.name }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="postcss" module>
.item {
  display: inline-block;
  margin: 4px 4px 4px 0;
  padding: 4px 6px;
  font-size: 14px;
  border-radius: 2px;
  color: var(--textRegular);
  background-color: var(--background);
  transition: 0.3s;
  &.active,
  &:hover {
    color: var(--textRegular);
    background-color: var(--lightGray);
  }
}
</style>
