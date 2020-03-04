<template>
  <div class="__error-page box">
    <i :class="iconClass"></i>

    <div class="title">
      {{ message[error.statusCode] || error.message }}
    </div>

    <p class="description">
      <Login :skipQuery="skipQuery" v-if="error.statusCode === 401" />
      <slot v-else>
        <nuxt-link :to="{ name: 'index' }" class="v-text-regular">
          返回首页
        </nuxt-link>
      </slot>
    </p>
  </div>
</template>

<script>
import Login from '@/components/login'

export default {
  components: {
    Login
  },
  props: {
    iconClass: {
      type: String,
      default: 'icon-attention-circled'
    },
    message: {
      type: Object,
      default: () => ({
        401: '无权限访问, 请登录/切换用户',
        404: '页面不存在或者已被删除'
      })
    },
    error: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      skipQuery: true
    }
  },
  mounted() {
    this.skipQuery = false
  }
}
</script>

<style lang="postcss">
.__error-page {
  height: 80vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.__error-page .icon-attention-circled {
  line-height: 0;
  margin-bottom: 14px;
  font-size: 70px;
  color: var(--lightGray);
  &:before {
    margin-left: 0;
    margin-right: 0;
  }
}

.__error-page .title {
  margin-bottom: 5px;
  font-size: 18px;
  color: var(--textPrimary);
}

.__error-page a {
  font-size: 14px;
  text-decoration: none;
}
</style>
