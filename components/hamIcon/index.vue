<template>
  <svg
    :class="[active && $style.active, $style.ham, $style.hamRotate]"
    :width="size"
    viewBox="0 0 100 100"
  >
    <path
      :class="[$style.line, $style.top]"
      d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40"
    />
    <path :class="[$style.line, $style.middle]" d="m 30,50 h 40" />
    <path
      :class="[$style.line, $style.bottom]"
      d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40"
    />
  </svg>
</template>

<script>
export default {
  name: 'HamIcon',
  props: {
    size: {
      type: Number,
      default: 45
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss" module>
.ham {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 400ms;
  user-select: none;
}
.hamRotate.active {
  transform: rotate(45deg);
}
.line {
  fill: none;
  transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
  stroke: #7f7f7f;
  stroke-width: 4.5;
  stroke-linecap: round;
}
.ham .top {
  stroke-dasharray: 40 139;
}
.ham .bottom {
  stroke-dasharray: 40 180;
}
.ham.active .top {
  stroke-dashoffset: -98px;
}
.ham.active .bottom {
  stroke-dashoffset: -138px;
}
</style>
