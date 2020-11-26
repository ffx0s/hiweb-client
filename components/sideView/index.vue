<template>
  <div class="display-flex">
    <div class="flex1">
      <slot />
    </div>
    <div class="right-side">
      <slot name="side" />
    </div>
  </div>
</template>
