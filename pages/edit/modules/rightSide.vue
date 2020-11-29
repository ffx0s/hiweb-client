<template>
  <VAuth>
    <Toolbar>
      <VButton :loading="saveLoading" type="icon" title="保存" @click="save">
        <i class="icon-floppy"></i>
      </VButton>
      <VButton
        :loading="changePosterLoading"
        type="icon"
        title="更换图片"
        @click="changePoster"
      >
        <i class="icon-picture"></i>
      </VButton>
    </Toolbar>
  </VAuth>
</template>

<script>
import VButton from 'lvan/button'
import VAuth from '@/components/auth'
import Toolbar from '@/components/toolbar'

export default {
  components: {
    VAuth,
    Toolbar,
    VButton,
  },
  props: {
    saveLoading: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Function,
      default: () => {},
    },
    changePosterLoading: {
      type: Boolean,
      default: false,
    },
    changePoster: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
