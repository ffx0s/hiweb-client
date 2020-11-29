<template>
  <div class="display-flex">
    <div class="flex1">
      <slot />
    </div>
    <div :class="['side', $style.rightSide]">
      <slot name="side" />
    </div>
  </div>
</template>

<style lang="postcss" module>
.rightSide {
  margin-left: var(--gap);
}

@media (max-width: 768px) {
  .rightSide {
    display: none;
  }
}
</style>
