<template>
  <div :class="$style.toolbar">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="postcss" module>
.toolbar {
  width: 46px;
  & button {
    width: 100%;
    padding: 10px;
    margin-left: 0 !important;
    color: var(--textPrimary);
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
