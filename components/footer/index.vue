<template>
  <div :class="$style.footer">
    <a href="http://www.miibeian.gov.cn/" target="_blank">
      粤ICP备15009058号-1
    </a>
    &nbsp;&nbsp;Copyright © 2016-{{ date }}
    <a href="https://www.upyun.com/" target="_blank">
      <img
        src="https://static.webfed.cn/FhE1nMKn4F-CKlMhoyMqvHSDEUMz"
        style="margin-left: 10px;width: 50px;"
      />
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().getFullYear()
    }
  }
}
</script>

<style lang="postcss" module>
.footer {
  margin: 30px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--textRegular);
  & a {
    color: var(--textRegular);
  }
}
</style>
