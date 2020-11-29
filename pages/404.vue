<template>
  <!-- 主要提供给 CDN 404 页面 -->
  <Error :error="{ statusCode: 404 }" />
</template>

<script>
import Error from '@/layouts/error'

export default {
  components: {
    Error,
  },
}
</script>
