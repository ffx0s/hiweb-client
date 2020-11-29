<template>
  <div :class="[$style.search, active && $style.active]">
    <input
      ref="input"
      v-bind="$attrs"
      :value="value"
      type="text"
      placeholder=""
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    />
    <div>
      <svg>
        <use xlink:href="#search-icon-path" />
      </svg>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <symbol
        id="search-icon-path"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 26"
      >
        <path
          d="M32.9418651,-20.6880772 C37.9418651,-20.6880772 40.9418651,-16.6880772 40.9418651,-12.6880772 C40.9418651,-8.68807717 37.9418651,-4.68807717 32.9418651,-4.68807717 C27.9418651,-4.68807717 24.9418651,-8.68807717 24.9418651,-12.6880772 C24.9418651,-16.6880772 27.9418651,-20.6880772 32.9418651,-20.6880772 L32.9418651,-29.870624 C32.9418651,-30.3676803 33.3448089,-30.770624 33.8418651,-30.770624 C34.08056,-30.770624 34.3094785,-30.6758029 34.4782612,-30.5070201 L141.371843,76.386562"
          transform="translate(83.156854, 22.171573) rotate(-225.000000) translate(-83.156854, -22.171573)"
        ></path>
      </symbol>
    </svg>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleFocus(event) {
      this.$emit('active', true)
      this.$emit('focus', event)
    },
    handleBlur(event) {
      setTimeout(() => {
        const value = this.value
        if (!value || !value.trim()) {
          this.$emit('active', false)
        }
      }, 100)
      this.$emit('blur', event)
    },
    handleInput(event) {
      this.$emit('input', event)
      this.$emit('change', event.target.value)
    },
    emitBlur() {
      this.$refs.input.blur()
    },
  },
}
</script>

<style lang="postcss" module>
.search {
  display: table;
}
.search input {
  background: none;
  border: none;
  outline: none;
  width: 26px;
  min-width: 0;
  padding: 0;
  z-index: 1;
  position: relative;
  line-height: 18px;
  margin: 2px 0 5px;
  font-size: 16px;
  -webkit-appearance: none;
  transition: all 0.6s ease;
  cursor: pointer;
  color: var(--textRegular);
}
.search input + div {
  position: relative;
  height: 26px;
  width: 100%;
  margin: -26px 0 0 0;
}
.search input + div svg {
  display: block;
  position: absolute;
  height: 26px;
  width: 160px;
  right: 0;
  top: 0;
  fill: none;
  stroke: var(--textRegular);
  stroke-width: 1.5px;
  stroke-dashoffset: 271.908;
  stroke-dasharray: 59 212.908;
  transition: all 0.6s ease;
}

.active {
  & input {
    width: 160px;
    padding: 0 4px;
    cursor: text;
    & + div svg {
      stroke-dasharray: 150 212.908;
      stroke-dashoffset: 300;
    }
  }
}
</style>
