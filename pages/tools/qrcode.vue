<template>
  <div>
    <Box title="二维码编/解码" fill big-title>
      <client-only>
        <VRadioGroup
          v-model="type"
          class="gap-margin-top gap-margin-bottom font16"
        >
          <VRadio label="encode" name="type">编码</VRadio>
          <VRadio label="decodeUpload" name="type">上传解码</VRadio>
          <VRadio label="decodeStream" name="type">拍照解码</VRadio>
        </VRadioGroup>

        <!-- 编码 -->
        <div v-show="type === 'encode'">
          <div class="font16">
            <div class="item-center gap-margin-bottom">
              <span>内容：</span>
              <VTextarea
                v-model="encodeContent"
                class="input flex1"
                placeholder="填写二维码内容"
              />
            </div>
            <div class="item-center gap-margin-bottom">
              <span>大小：</span>
              <input
                v-model.number="encodeOptions.width"
                class="input flex1"
                type="number"
                placeholder="大小(px)"
              />
            </div>
            <div class="item-center gap-margin-bottom">
              <span>颜色：</span>
              <InputColor
                :value="encodeOptions.color.dark"
                @input="updateColor"
                class="flex1"
              />
            </div>
            <VButton
              @click="onEncode"
              :disabled="!encodeContent.trim()"
              type="primary"
            >
              生成二维码
            </VButton>
          </div>
          <br />
          <div class="row-center">
            <img v-if="encodeImg" :src="encodeImg" :class="$style.encodeImg" />
          </div>
        </div>

        <!-- 上传解码 -->
        <QrcodeDropZone
          ref="qrcodeDropZone"
          v-show="type === 'decodeUpload'"
          @detect="onDetect"
          @dragover="onDragOver"
          @init="logErrors"
          @mouseenter.native="disablePaste = false"
          @mouseleave.native="disablePaste = true"
          :worker="Worker"
        >
          <div
            :class="[
              $style.dropArea,
              dragover && $style.dragover,
              uploaded && $style.uploaded
            ]"
          >
            <canvas ref="canvas" :class="$style.uploadImg" />
            <i :class="[$style.iconPicture, 'icon-picture']"></i>

            <div :class="$style.uploadHelp">
              <p>
                <i class="icon-attention-circled" />
                支持拖拽图片到此处或Ctrl+V粘贴图片/地址到此处解码
              </p>
            </div>

            <QrcodeCapture
              @detect="onDetect"
              :class="$style.uploadInupt"
              :capture="false"
              :multiple="false"
              :worker="Worker"
              title="点击上传"
            />
          </div>
        </QrcodeDropZone>

        <!-- 拍照解码 -->
        <QrcodeStream
          v-if="type === 'decodeStream'"
          @decode="onDecode"
          @init="onInit"
          style="height:300px"
        />

        <br />

        <!-- 解码状态 -->
        <div :class="$style.decodeState">
          <div v-show="parsing">解析中...</div>
          <p v-show="decodeError" :class="$style.dropError">
            {{ decodeError }}
          </p>
          <div v-show="decodeResult && !decodeError">
            {{ decodeResult }}
            &nbsp;
            <Copy v-model="decodeResult" />
          </div>
        </div>
      </client-only>
    </Box>
  </div>
</template>

<script>
import VRadio from 'lvan/radio'
import VRadioGroup from 'lvan/radio/group.vue'
import VButton from 'lvan/button'
import VTextarea from 'lvan/textarea'
import Worker from './modules/worker'
import { transition } from '@/plugins/transition'
import { urlToBlob } from '@/utils/shared'
import Box from '@/components/box'
import Copy from '@/components/copy'
import Skeleton from '@/components/skeleton'
import InputColor from '@/components/color'

let QRCode = null

if (process.client) {
  QRCode = require('qrcode')
}

export default {
  head() {
    return {
      title: '二维码编/解码 | hiweb',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: '二维码,编码,解码'
        },
        {
          hid: 'description',
          name: 'description',
          content: '在线二维码编/解码'
        }
      ]
    }
  },
  transition,
  components: {
    Box,
    VRadio,
    VRadioGroup,
    VButton,
    VTextarea,
    Copy,
    InputColor,
    QrcodeDropZone: () =>
      process.client
        ? {
            component: import('vue-qrcode-reader').then(
              (m) => m.QrcodeDropZone
            ),
            loading: Skeleton
          }
        : {},
    QrcodeCapture: () =>
      process.client
        ? {
            component: import('vue-qrcode-reader').then((m) => m.QrcodeCapture),
            loading: Skeleton
          }
        : {},
    QrcodeStream: () =>
      process.client
        ? {
            component: import('vue-qrcode-reader').then((m) => m.QrcodeStream),
            loading: Skeleton
          }
        : {}
  },
  data() {
    return {
      Worker,
      type: 'encode',
      decodeResult: '',
      decodeError: null,
      dragover: false,
      uploaded: false,
      parsing: false,
      disablePaste: true,

      colors: {},
      encodeContent: '',
      encodeOptions: {
        // errorCorrectionLevel: 'H',
        // type: 'image/jpeg',
        margin: 1.5,
        color: {
          dark: '#000000',
          light: ''
        },
        width: 200
      },
      encodeImg: ''
    }
  },
  watch: {
    type() {
      this.resetState()
    }
  },
  mounted() {
    document.body.addEventListener('paste', this.onPaste)
  },
  beforeDestroy() {
    document.body.removeEventListener('paste', this.onPaste)
  },
  methods: {
    async onDetect(promise) {
      this.resetState()
      this.parsing = true

      try {
        const { content, imageData } = await promise

        this.renderImg(imageData)
        this.uploaded = true
        this.decodeResult = content
        this.decodeError = content ? null : '解码失败'
      } catch (error) {
        if (error.name === 'DropImageFetchError') {
          this.decodeError = '无法加载图片'
        } else if (error.name === 'DropImageDecodeError') {
          this.decodeError = '该文件不是图片，不能被解码'
        } else {
          this.decodeError = '未知错误：' + (error.message || 'Error')
        }
      }

      this.parsing = false
    },

    logErrors(promise) {
      // promise.catch(console.error)
    },

    onDragOver(isDraggingOver) {
      this.dragover = isDraggingOver
    },

    renderImg(imageData) {
      const canvas = this.$refs.canvas
      canvas.width = imageData.width
      canvas.height = imageData.height
      const ctx = canvas.getContext('2d')
      ctx.putImageData(imageData, 0, 0)
    },

    onDecode(result) {
      this.decodeResult = result
    },

    onPaste(event) {
      if (this.disablePaste) return

      const file = event.clipboardData.files[0]
      let url = ''

      if (file) {
        this.emitDecode(file)
      } else if ((url = event.clipboardData.getData('text'))) {
        if (url.startsWith('http')) {
          this.parsing = true
          urlToBlob(url)
            .then((res) => {
              this.emitDecode(res)
            })
            .catch((err) => {
              this.decodeError = err.message
              this.parsing = false
            })
        }
      }
    },

    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.decodeError = 'ERROR: you need to grant camera access permisson'
        } else if (error.name === 'NotFoundError') {
          this.decodeError = 'ERROR: no camera on this device'
        } else if (error.name === 'NotSupportedError') {
          this.decodeError = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.decodeError = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.decodeError = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.decodeError =
            'ERROR: Stream API is not supported in this browser'
        }
      }
    },

    resetState() {
      this.parsing = false
      this.uploaded = false
      this.decodeError = null
      this.decodeResult = null
    },

    emitDecode(file) {
      const qrcodeDropZone = this.$refs.qrcodeDropZone
      qrcodeDropZone.onDetect(qrcodeDropZone.processFile(file))
    },

    onEncode() {
      const maxWidth = 800
      this.encodeOptions.width = Math.min(this.encodeOptions.width, maxWidth)
      QRCode.toDataURL(this.encodeContent, this.encodeOptions, (err, url) => {
        if (err) throw err
        this.encodeImg = url
      })
    },

    updateColor(colors) {
      this.encodeOptions.color.dark = colors.hex8
    }
  }
}
</script>

<style lang="postcss" module>
.dropArea {
  position: relative;
  height: 300px;
  color: var(--textRegular);
  text-align: center;
  font-weight: bold;
  padding: var(--gap);
  border: 2px dashed var(--border);
}

.dragover {
  background-color: rgba(0, 0, 0, 0.1);
  & .uploadHelp,
  & .uploadImg {
    opacity: 0.2;
  }
}

.dropError {
  color: var(--error);
  font-weight: bold;
}

.uploadInupt {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
  font-size: 0;
}

.uploadHelp {
  position: absolute;
  left: 0;
  bottom: var(--gap);
  padding: 0 var(--gap);
  width: 100%;
  text-align: center;
  text-align: left;
  font-size: 14px;
}

.uploadImg {
  display: none;
  max-width: 180px;
  max-height: 180px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 50px;
  right: 0;
  margin: auto;
}

.iconPicture {
  margin-top: 60px;
  display: block;
  color: var(--textSecondary);
  font-size: 70px;
}

.uploaded {
  & .uploadImg {
    display: inline;
  }
  & .iconPicture {
    display: none;
  }
}

.decodeState {
  font-size: 16px;
}

/* 编码 */
.encodeImg {
  border: 1px solid var(--border);
  user-select: none;
}
</style>
