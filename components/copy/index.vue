<template>
  <div :class="$style.copy">
    <span
      v-show="copySuccess === undefined"
      :class="$style.primary"
      @click="copyText"
    >
      {{ defaultMessage }}
    </span>
    <span v-show="copySuccess === false" :class="$style.error">
      {{ errorMessage }}
    </span>
    <span v-show="copySuccess" :class="$style.success">
      {{ successMessage }}
    </span>
  </div>
</template>

<script>
import { copy } from '@/utils/shared'

export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    defaultMessage: {
      type: String,
      default: '复制',
    },
    successMessage: {
      type: String,
      default: '复制成功',
    },
    errorMessage: {
      type: String,
      default: '复制失败',
    },
  },
  data() {
    return {
      copySuccess: undefined,
      message: this.defaultMessage,
    }
  },
  methods: {
    copyText() {
      copy(this.value)
        .then(() => {
          this.copySuccess = true
          this.message = this.successMessage
        })
        .catch(() => {
          this.copySuccess = false
          this.message = this.errorMessage
        })
        .finally(() => {
          setTimeout(() => {
            this.copySuccess = undefined
            this.message = this.defaultMessage
          }, 1000)
        })
    },
  },
}
</script>

<style module>
.copy {
  display: inline;
  cursor: pointer;
  white-space: nowrap;
}
.primary {
  color: var(--primary);
}
.success {
  color: var(--success);
}
.error {
  color: var(--error);
}
</style>
