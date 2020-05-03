<template>
  <!-- eslint-disable-next-line vue/require-component-is -->
  <component v-bind="$attrs" :is="tag">
    <client-only>
      <slot v-if="isAdmin" />
      <Error
        v-else-if="showError && isAdmin === false"
        :error="{ statusCode: 401 }"
      />
    </client-only>
  </component>
</template>

<script>
import Error from '@/layouts/error'

export default {
  components: {
    Error
  },
  inheritAttrs: false,
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    showError: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isAdmin: null
    }
  },
  async mounted() {
    const result = await this.$apollo.query({
      query: require('@/graphql/me')
    })
    const me = result.data.me

    if (me) {
      this.isAdmin = me.role >= 1
      this.$emit('auth', this.isAdmin)
    } else {
      this.isAdmin = false
    }
  }
}
</script>
