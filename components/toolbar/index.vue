<template>
  <div :class="[$style.toolbar, 'box']">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="postcss" module>
.toolbar {
  position: fixed;
  top: 30%;
  width: 46px;
  margin-left: -65px;
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
