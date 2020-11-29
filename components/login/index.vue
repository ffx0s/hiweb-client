<template>
  <client-only>
    <Dropdown v-if="!me" class="v-color-primary" align="right">
      <strong slot="title">登录</strong>
      <DropdownItem v-github-login tag="a">
        <i class="icon-github-circled" />&nbsp;Github
      </DropdownItem>
    </Dropdown>
    <Dropdown v-else class="v-color-primary" align="right">
      <strong slot="title">{{ me.name }}</strong>
      <DropdownItem @click.native="loginOut">退出登录</DropdownItem>
    </Dropdown>
  </client-only>
</template>
<script>
import Dropdown from '@/components/dropdown'
import DropdownItem from '@/components/dropdown/item'

const meQuery = require('@/graphql/me')

export default {
  components: {
    Dropdown,
    DropdownItem,
  },
  props: {
    skipQuery: {
      type: Boolean,
      default: true,
    },
  },
  apollo: {
    me: {
      query: meQuery,
      skip() {
        return this.skipQuery
      },
    },
  },
  methods: {
    loginOut() {
      this.$apollo.mutate({
        mutation: require('@/graphql/loginout'),
        update: (store) => {
          store.writeQuery({
            query: meQuery,
            data: { me: null },
          })
        },
      })
    },
  },
}
</script>
