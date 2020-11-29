<template>
  <div>
    <div :class="$style.inputColor">
      <div :class="$style.pickerWrap" @click="showColorPicker">
        <div :class="$style.color" :style="{ 'background-color': value }"></div>
        <div :class="$style.backgroundImage" />
      </div>
    </div>
    <div
      v-show="show"
      v-transfer-dom
      :class="$style.modal"
      @click.self="show = false"
    >
      <ColorPicker
        ref="picker"
        :class="$style.picker"
        :value="value"
        :style="position"
        @input="updateValue"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ColorPicker: () =>
      process.client ? import('vue-color').then((m) => m.Sketch) : {},
  },
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
  },
  data() {
    return {
      show: false,
      position: {
        left: 0 + 'px',
        top: 0 + 'px',
      },
    }
  },
  methods: {
    showColorPicker(event) {
      let { x, y } = event.target.getBoundingClientRect()
      const viewWidth = document.documentElement.clientWidth
      const viewHeight = document.documentElement.clientHeight
      const pickerWidth = 220
      const pickerHeight = 301

      y += 23

      if (x + pickerWidth > viewWidth) {
        x = viewWidth - pickerWidth
      }
      if (y + pickerHeight > viewHeight) {
        y = viewHeight - pickerHeight
      }

      this.position = {
        left: x + 'px',
        top: y + 'px',
      }
      this.show = true
    },
    updateValue(value) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('input', value)
      })
    },
  },
}
</script>

<style module>
.inputColor {
  display: flex;
  align-items: center;
}
.pickerWrap {
  position: relative;
  width: 40px;
  height: 22px;
}
.backgroundImage {
  width: 100%;
  height: 100%;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC');
}
.color {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.picker {
  position: fixed;
  z-index: 99;
  font-family: arial;
}
</style>
