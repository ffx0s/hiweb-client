<template>
  <Auth>
    <Toolbar>
      <VButton :loading="loading" @click="save" type="icon" title="保存">
        <i class="icon-floppy"></i>
      </VButton>
    </Toolbar>
  </Auth>
</template>

<script>
import VButton from 'lvan/button'
import Auth from '@/components/auth'
import Toolbar from '@/components/toolbar'

export default {
  components: {
    Auth,
    Toolbar,
    VButton
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    save: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
