<template>
  <div>
    <nuxt-link
      v-for="(tag, i) in tags"
      :key="i"
      :to="`/tag/${encodeURIComponent(tag.name)}/`"
      :class="$style.item"
      :active-class="$style.active"
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
      required: true,
    },
  },
}
</script>

<style lang="postcss" module>
.item {
  display: inline-block;
  margin: 6px 14px 6px 0;
  font-size: 14px;
  border-radius: 2px;
  color: var(--textPrimary);
  background-color: var(--background);
  transition: 0.3s;
}
</style>
