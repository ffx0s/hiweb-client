<template>
  <div :class="[$style.dropdown, toggleClass]" @click.stop="toggle">
    {{ title }}
    <slot name="title" />
    <i :class="[$style.icon, 'icon-angle-down']" />
    <div :class="[$style.items, $style[align]]">
      <slot />
    </div>
  </div>
</template>

<script>
import { isTouchDevice } from 'lvan/utils/shared'

export default {
  props: {
    click: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    align: {
      type: String,
      default: 'left',
    },
    value: {
      type: [Boolean, undefined],
      default: undefined,
    },
  },
  data() {
    return {
      isClick: this.click,
      clickValue: false,
    }
  },
  computed: {
    toggleClass() {
      return this.isClick
        ? this.currentValue
          ? this.$style.show
          : this.$style.hide
        : this.$style.hover
    },
    currentValue: {
      get() {
        return this.value === undefined ? this.clickValue : this.value
      },
      set(value) {
        if (this.value === undefined) {
          this.clickValue = value
        } else {
          this.$emit('input', value)
        }
      },
    },
  },
  mounted() {
    this.isClick = this.click || isTouchDevice()

    if (this.isClick) {
      document.addEventListener('click', this.close)
    }
  },
  beforeDestroy() {
    if (this.isClick) {
      document.removeEventListener('click', this.close)
    }
  },
  methods: {
    toggle() {
      if (this.isClick) {
        this.currentValue = !this.currentValue
      }
    },
    close() {
      this.currentValue = false
    },
  },
}
</script>

<style lang="postcss" module>
.dropdown {
  position: relative;
  cursor: pointer;
  display: inline-block;
  & .icon {
    display: inline-block;
    transition: transform 0.3s;
  }
}
.hover:hover,
.show {
  & .items {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  & .icon {
    transform: rotate(180deg);
  }
}
.items {
  position: absolute;
  top: 100%;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
  z-index: 99;
  background-color: var(--lightBackground);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: 0.3s;
  line-height: initial;
}
.left {
  left: 0;
}
.right {
  right: 0;
}
</style>
