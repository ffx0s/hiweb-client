<template>
  <div :class="[$style.skeleton, $style.animate]">
    <div :class="$style.item" style="margin-bottom: 20px; width:40%;"></div>
    <div :class="$style.item" style="width:100%;"></div>
    <div :class="$style.item" style="width:100%;"></div>
    <div :class="$style.item" style="width:60%;"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="postcss" module>
.skeleton {
  width: 100%;
}

.animate {
  animation: skeleton-animate 1.2s ease-in-out infinite;
}

.item {
  margin-bottom: 12px;
  height: 16px;
  background-color: #f2f3f5;
}

@keyframes skeleton-animate {
  50% {
    opacity: 0.6;
  }
}
</style>
