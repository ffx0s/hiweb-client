<template>
  <div :class="$style.footer">
    <a href="http://www.miibeian.gov.cn/" target="_blank">
      粤ICP备15009058号-1
    </a>
    &nbsp;
    <a
      href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral"
      target="_blank"
    >
      <img
        src="https://static.webfed.cn/FhE1nMKn4F-CKlMhoyMqvHSDEUMz"
        style="width: 50px; vertical-align: -3px"
      />
    </a>
  </div>
</template>

<style lang="postcss" module>
.footer {
  padding: var(--gap);
  font-size: 12px;
  color: var(--textRegular);
  & a {
    color: var(--textRegular);
  }
}
</style>
