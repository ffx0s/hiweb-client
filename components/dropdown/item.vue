<template>
  <!-- eslint-disable-next-line vue/require-component-is -->
  <component
    :is="tag"
    v-bind="$attrs"
    :class="[$style.item, $style[align], $style[size]]"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'DropdownItem',
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'large',
    },
    tag: {
      type: String,
      default: 'div',
    },
    align: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="postcss" module>
.item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  transition: 0.3s;
  color: var(--textPrimary);
  cursor: pointer;
  &:hover {
    color: var(--primary);
  }
}
.large {
  min-width: 120px;
  padding: 8px 10px;
  font-size: 14px;
}
.medium {
  min-width: 100px;
  padding: 5px 6px;
  font-size: 13px;
}
.center {
  justify-content: center;
}
.between {
  justify-content: space-between;
}
.right {
  justify-content: right;
}
</style>
