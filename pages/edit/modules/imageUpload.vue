<template>
  <Upload
    ref="uploader"
    :immediately="false"
    :max-progress="76"
    :form-data="formData"
    :before-upload="beforeUpload"
    :url="uploadUrl"
    @change="uploadChange"
    @success="uploadSuccess"
    @error="uploadError"
  >
    <template v-slot:input="{ onChange }">
      <div :class="$style.uploadButton">
        <p class="icon-upload-cloud">&nbsp;上传图片</p>
        <input
          :class="$style.fileInput"
          accept="image/*"
          type="file"
          @change="onChange"
        />
      </div>
      <img
        v-if="localSrc || value"
        :class="imageClass"
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
            <VButton type="warning" small @click="upload(0)">
              重新上传
            </VButton>
          </template>
          <VButton type="error" small @click="removeImage"> 删除 </VButton>
        </div>
      </div>
    </template>
    <client-only>
      <Crop
        :options="{ border: clipSize }"
        :file="cropFile"
        :class="$style.crop"
        @on-cancle="cancleCrop"
        @on-confirm="confirmCrop"
        @on-error="cropError"
      />
    </client-only>
  </Upload>
</template>

<script>
import Upload from 'lvan/upload'
import VButton from 'lvan/button'
import gql from 'graphql-tag'
import { uploadUrl } from '@/config'
import { urlToBlob } from '@/utils/shared'

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
    Crop: () => import('xcrop/src/components/VueCrop.vue'),
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    imageClass: {
      type: String,
      default: '',
    },
    clipSize: {
      type: Object,
      default: () => ({
        width: 868,
        height: 260,
      }),
    },
  },
  data() {
    return {
      uploadUrl,
      localSrc: '',
      errorMessage: '',
      formData: {},
      cropFile: null,
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
        this.errorMessage = '上传出错：Authorization 已过期！'
      } else {
        this.errorMessage = '上传出错！'
      }
    },
    async beforeUpload() {
      if (!this.formData.authorization) {
        const uploadSign = await this.$apollo
          .query({
            fetchPolicy: 'no-cache',
            query: uploadSignQuery,
          })
          .catch(() => {})

        if (uploadSign) {
          const { sign, policy } = uploadSign.data.authorization
          this.formData.authorization = sign
          this.formData.policy = policy
        } else {
          const err = new Error('上传出错：签名获取失败！')
          this.$toast(err.message)
          throw err
        }
      }
    },
    startUpload(file) {
      const uploader = this.$refs.uploader
      if (uploader.list.length) {
        uploader.list[0].file = file
      } else {
        uploader.add(file)
      }
      uploader.upload(0)
    },
    async uploadRemoteImage(url) {
      const blob = await urlToBlob(url)
      this.startUpload(blob)
    },
    removeImage() {
      URL.revokeObjectURL(this.localSrc)
      this.localSrc = ''
      this.$emit('input', '')
      this.$refs.uploader.remove(0)
    },
    cancleCrop(crop) {
      this.$refs.uploader.remove(0)
      this.cropFile = null
      crop.hide()
    },
    confirmCrop(crop) {
      let { width, height } = this.clipSize
      const scale = 1.5

      width *= scale
      height *= scale

      this.localSrc = crop.get({ format: 'objectUrl', width, height })
      this.cropFile = null
      crop.hide()

      this.startUpload(crop.get({ format: 'file', width, height }))
    },
    cropError(error) {
      this.$emit('cropError', error)
    },
  },
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
