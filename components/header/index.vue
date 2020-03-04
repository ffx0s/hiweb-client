<template>
  <div :class="$style.header">
    <div :class="$style.inner">
      <a :class="$style.logo" href="#">
        <img
          src="https://static.webfed.cn/o_1dcbbpm8510miv7h1b0i1qvn1tln9.jpeg?imageView2/0/w/500"
          alt="logo"
        />
      </a>
      <ul :class="$style.nav">
        <li><a href="#">首页</a></li>
        <li><a href="#">分类</a></li>
        <li><a href="#">存档</a></li>
        <li><a href="#">工具</a></li>
        <li><a href="#">关于</a></li>
      </ul>
      <div :class="$style.social">
        <a href="#" class="icon-github-circled"></a>
        <a href="#" class="icon-weibo"></a>
        <a href="#" class="icon-twitter"></a>
        <a href="#" class="icon-rss"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {}
}
</script>

<style lang="postcss" module>
.header {
  width: var(--headerWidth);
  height: 100%;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08);
  z-index: 9999;
}
.inner {
  padding: 78px 38px 28px;
}
.logo {
  display: block;
  margin: 0 auto 38px;
  width: 120px;
  height: 120px;
  text-align: center;
  & img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.nav {
  text-align: center;
  & li {
    margin: 14px 0;
  }
  & a {
    color: var(--textRegular);
  }
}
.social {
  margin-top: 70px;
  text-align: center;
  & a {
    margin: 0 10px;
    color: var(--textRegular);
  }
}
</style>
