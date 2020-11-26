<template>
  <Upload
    ref="uploader"
    :immediately="false"
    :maxProgress="76"
    :formData="formData"
    :beforeUpload="setUploadSign"
    @change="uploadChange"
    @success="uploadSuccess"
    @error="uploadError"
    :url="uploadUrl"
  >
    <template v-slot:input="{ onChange }">
      <div :class="$style.uploadButton">
        <p class="icon-upload-cloud">
          上传图片
        </p>
        <input
          :class="$style.fileInput"
          @change="onChange"
          accept="image/*"
          type="file"
        />
      </div>
      <img
        :class="imageClass"
        v-if="localSrc || value"
        :src="(localSrc || value) | upyImage"
      />
    </template>
    <template v-slot:list="{ list, upload }">
      <div v-if="list[0]" :class="$style.progress">
        <div
          :class="$style.layer"
          :style="{ height: 100 - list[0].progress + '%' }"
        />
        <div :class="$style.handler">
          <span v-if="list[0].uploading"> {{ list[0].progress }}% </span>
          &nbsp;
          <template v-if="list[0].error">
            <span class="v-color-error">{{ errorMessage }}</span>
            <VButton @click="upload(0)" type="warning" small>
              重新上传
            </VButton>
          </template>
          <VButton @click="removeImage" type="error" small>
            删除
          </VButton>
        </div>
      </div>
    </template>
    <client-only>
      <Crop
        :options="{ border: clipSize }"
        :file="cropFile"
        @on-cancle="cancleCrop"
        @on-confirm="confirmCrop"
        @on-error="cropError"
        :class="$style.crop"
      />
    </client-only>
  </Upload>
</template>

<script>
import Upload from 'lvan/upload'
import VButton from 'lvan/button'
import gql from 'graphql-tag'
import { uploadUrl } from '@/config'

const uploadSignQuery = gql`
  query authorization {
    authorization {
      policy
      sign
    }
  }
`

export default {
  components: {
    Upload,
    VButton,
    Crop: () => import('xcrop/src/components/VueCrop.vue')
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    imageClass: {
      type: String,
      default: ''
    },
    clipSize: {
      type: Object,
      default: () => ({
        width: 868,
        height: 260
      })
    }
  },
  data() {
    return {
      uploadUrl,
      localSrc: '',
      errorMessage: '',
      formData: {},
      cropFile: null
    }
  },
  methods: {
    uploadChange(list) {
      this.cropFile = list[0].file
    },
    uploadSuccess(req, current, index) {
      const url = JSON.parse(req.response).url
      this.$emit('input', url)
      this.$refs.uploader.remove(0)
    },
    uploadError(req, current, index) {
      if (req.status === 403) {
        this.formData.authorization = null
        this.errorMessage = '上传出错, Authorization 已过期！'
      } else {
        this.errorMessage = '上传出错！'
      }
    },
    removeImage() {
      URL.revokeObjectURL(this.localSrc)
      this.localSrc = ''
      this.$emit('input', '')
      this.$refs.uploader.remove(0)
    },
    cancleCrop(crop) {
      this.cropFile = null
      this.$refs.uploader.remove(0)
      crop.hide()
    },
    confirmCrop(crop) {
      const uploader = this.$refs.uploader
      const list = uploader.list
      let { width, height } = this.clipSize
      const scale = 1.5
      width *= scale
      height *= scale
      const src = crop.get({ format: 'objectUrl', width, height })
      const file = crop.get({ format: 'file', width, height })

      list[0].file = file
      this.localSrc = src
      this.cropFile = null
      crop.hide()

      uploader.upload(0).catch((err) => {
        this.$toast(err.message)
      })
    },
    cropError(error) {
      this.$emit('cropError', error)
    },
    async setUploadSign() {
      if (!this.formData.authorization) {
        const result = await this.$apollo.query({
          fetchPolicy: 'no-cache',
          query: uploadSignQuery
        })

        if (result) {
          const { sign, policy } = result.data.authorization
          this.formData.authorization = sign
          this.formData.policy = policy
        }
      }
    }
  }
}
</script>

<style lang="postcss" module>
.uploadButton {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  & p {
    color: var(--textRegular);
    font-size: 20px;
  }
}
.fileInput {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  background: transparent;
  z-index: 2;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 14px;
  text-align: right;
  z-index: 3;
}
.layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: height 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}
.handler {
  padding: 10px;
}
</style>
