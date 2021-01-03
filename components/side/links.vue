<template>
  <Box title="Code">
    <div class="display-flex">
      <a
        title="Github"
        href="https://github.com/ffx0s"
        target="_blank"
        class="icon-github-circled"
        :class="$style.link"
      />
      <a
        title="JSrun"
        href="https://jsrun.net/u/ffx0s"
        target="_blank"
        class="item-center"
        :class="$style.link"
      >
        <img src="../../assets/images/jsrun-logo.png" alt="jsrun-logo" />
      </a>
    </div>
  </Box>
</template>

<script>
import Box from '@/components/box'

export default {
  components: {
    Box,
  },
}
</script>

<style lang="postcss" module>
.link {
  margin-right: 10px;
  color: var(--textPrimary);
  font-size: 24px;
  & img {
    width: 26px;
  }
}
</style>
