<template>
  <div :class="$style.autocomplete">
    <slot :input="input" name="input">
      <input
        v-bind="$attrs"
        @input="input"
        @blur="$emit('blur', $event)"
        v-model="currentValue"
        :class="inputClass || $style.inputClass"
        type="text"
      />
    </slot>

    <div :class="[$style.content, show && $style.show]">
      <div :class="[$style.status, 'v-text-regular']" v-if="loading">
        <Loading size="18" />
      </div>
      <div :class="[$style.status, 'v-color-error']" v-else-if="errorMessage">
        <i class="icon-attention-circled" />
        {{ errorMessage }}
      </div>
      <div :class="[$style.status, 'v-text-regular']" v-else-if="empty">
        <slot name="empty">
          <i class="icon-attention-circled" />&nbsp;无结果
        </slot>
      </div>
      <slot v-else :list="list" name="list">
        <ul :class="$style.list">
          <li
            v-for="(item, i) in list"
            :key="i"
            :class="$style.item"
            @click="select(item, i)"
          >
            {{ item.value }}
          </li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
import Loading from 'lvan/loading/index.vue'

export default {
  components: {
    Loading
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    delay: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      show: false,
      errorMessage: '',
      loading: false,
      list: []
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    empty() {
      return !this.list.length
    }
  },
  mounted() {
    document.addEventListener('click', this.close)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close)
  },
  methods: {
    input(event) {
      clearTimeout(this.inputTimer)
      this.inputTimer = setTimeout(() => {
        const value = event.target.value.trim()
        if (value) {
          this.loading = true
          this.show = true
          this.$emit('search', event.target.value, this.callback)
        } else {
          this.close()
        }
      }, this.delay)
    },
    select(item, i) {
      this.$emit('select', item, i)
      this.$emit('input', item.value)
    },
    callback(result, error) {
      if (error) {
        this.errorMessage = error.message
      } else {
        this.errorMessage = ''
        this.list = result
      }
      this.loading = false
      this.show = true
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style lang="postcss" module>
.autocomplete {
  position: relative;
}
.content {
  position: absolute;
  z-index: 5;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: 0.3s;
  box-shadow: var(--shadow);
  background-color: var(--themeBackground);
  border-radius: 4px;
}
.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.item {
  padding: 5px 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--textPrimary);
  transition: background 0.3s;
  &:hover {
    background-color: var(--background);
  }
}
.status {
  padding: 5px 8px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
