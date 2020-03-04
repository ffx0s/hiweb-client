<template>
  <!-- 主要提供给 CDN 404 页面 -->
  <div>
    <Error :error="{ statusCode: 404 }" />
  </div>
</template>

<script>
import Error from '@/layouts/error'

export default {
  components: {
    Error
  }
}
</script>
