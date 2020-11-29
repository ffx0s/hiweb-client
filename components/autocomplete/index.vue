<template>
  <div :class="$style.autocomplete">
    <slot
      :input="input"
      :keyup="keyup"
      :focus="focus"
      :blur="blur"
      name="input"
    >
      <input
        v-model="currentValue"
        v-bind="$attrs"
        :class="inputClass || $style.inputClass"
        type="text"
        @input="input"
        @keyup="keyup"
        @focus="focus"
        @blur="blur"
      />
    </slot>

    <div :class="[$style.content, show && $style.show, listClass]">
      <div v-if="loading" :class="[$style.status, 'v-text-regular']">
        <Loading size="18" />
      </div>
      <div v-else-if="errorMessage" :class="[$style.status, 'v-color-error']">
        <i class="icon-attention-circled" />
        {{ errorMessage }}
      </div>
      <div v-else-if="empty" :class="[$style.status, 'v-text-regular']">
        <slot name="empty">
          <i class="icon-attention-circled" />&nbsp;无结果
        </slot>
      </div>
      <slot v-else :list="list" name="list">
        <ul :class="$style.list">
          <li
            v-for="(item, i) in list"
            :key="i"
            :class="[$style.item, index === i && $style.active]"
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
import Loading from 'lvan/loading'

export default {
  components: {
    Loading,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    inputClass: {
      type: String,
      default: '',
    },
    delay: {
      type: Number,
      default: 300,
    },
    listClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
      errorMessage: '',
      loading: false,
      list: [],
      index: null,
    }
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    empty() {
      return !this.list.length
    },
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
          this.show = false
        }
      }, this.delay)
    },
    keyup(event) {
      const length = this.list.length

      if (length && this.show) {
        let index = this.index

        switch (event.keyCode) {
          // up
          case 38:
            index--
            if (index < 0) index = length - 1
            this.index = index
            break
          // down
          case 40:
            index++
            index %= length
            this.index = index
            break
          // enter
          case 13:
            this.select(this.list[index], index)
            this.show = false
            break
        }
      }
    },
    select(item, i) {
      this.$emit('select', item, i)
      this.$emit('input', item.value)
    },
    callback(result, error) {
      if (error) {
        this.errorMessage = error.message
      } else {
        if (result.length) {
          this.index = 0
        }
        this.errorMessage = ''
        this.list = result
      }
      this.loading = false
      this.show = true
    },
    focus(event) {
      if (event.target.value.trim()) {
        this.show = true
      }
      this.$emit('focus', event)
    },
    blur(event) {
      this.show = false
      this.$emit('blur', event)
    },
  },
}
</script>

<style lang="postcss" module>
.autocomplete {
  position: relative;
}
.content {
  position: absolute;
  right: 0;
  z-index: 5;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: 0.3s;
  box-shadow: var(--shadow);
  background-color: var(--lightBackground);
  border-radius: 4px;
}
.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.list {
  margin: 0;
  padding: 10px 0;
  list-style: none;
}
.item {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  color: var(--textPrimary);
  transition: color 0.3s;
  &:hover {
    color: var(--primary);
  }
  &.active {
    background-color: var(--lightBackgroundActive);
  }
}
.status {
  padding: 10px 16px;
  font-size: 16px;
  white-space: nowrap;
}
</style>
