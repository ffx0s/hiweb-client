<template>
  <Box title="辅助工具">
    <nuxt-link
      v-for="tool in internalTools"
      :key="tool.to"
      :class="$style.item"
      :to="tool.to"
    >
      {{ tool.name }}
    </nuxt-link>
    <a
      v-for="tool in externalTools"
      :key="tool.href"
      :class="$style.item"
      :href="tool.href"
      target="__blank"
    >
      {{ tool.name }}
    </a>
  </Box>
</template>

<script>
import Box from '@/components/box'

export default {
  components: {
    Box
  },
  data() {
    return {
      internalTools: [
        {
          name: '🦊 字符串编解码',
          to: '/tools/transcode/'
        },
        {
          name: '🐧 二维码编解码',
          to: '/tools/qrcode/'
        }

        // {
        //   name: '🐹 图片转Base64',
        //   to: '/edit/'
        // },
        // {
        //   name: '🐰 随机密码生成',
        //   to: '/tags/'
        // },
      ],
      externalTools: [
        {
          name: '🐱 GIF编辑器',
          href: 'https://gif.webfed.cn'
        },
        {
          name: '🐭 可视化布局编辑器',
          href: 'https://ffx0s.github.io/blocks/dist'
        }
      ]
    }
  }
}
</script>

<style lang="postcss" module>
.item {
  display: block;
  color: var(--textPrimary);
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
