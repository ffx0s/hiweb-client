<template>
  <div>
    <Box title="字符串编解码" fill big-title>
      <VRadioGroup
        v-model="type"
        class="gap-margin-top gap-margin-bottom font16"
      >
        <VRadio label="uniEncode" name="type">Unicode编码</VRadio>
        <VRadio label="uniDecode" name="type">Unicode解码</VRadio>
        <VRadio label="base64Encode" name="type">Base64编码</VRadio>
        <VRadio label="base64Decode" name="type">Base64解码</VRadio>
        <VRadio label="utf8Encode" name="type">UTF8编码</VRadio>
        <VRadio label="utf8Decode" name="type">UTF8解码</VRadio>
        <VRadio label="urlEncode" name="type">URL编码</VRadio>
        <VRadio label="urlDecode" name="type">URL解码</VRadio>
        <VRadio label="md5" name="type">MD5编码</VRadio>
        <VRadio label="gzipEncode" name="type">Gzip压缩</VRadio>
        <VRadio label="gzipDecode" name="type">Gzip解压</VRadio>
        <VRadio label="hexEncode" name="type">16进制编码</VRadio>
        <VRadio label="hexDecode" name="type">16进制解码</VRadio>
        <VRadio label="html2js" name="type">HTML转JS</VRadio>
      </VRadioGroup>

      <div class="font16">
        <div class="gap-margin-bottom">
          <VTextarea
            v-model="content"
            class="input flex1"
            placeholder="输入需要转换的内容"
          />
        </div>
        <div v-show="result" class="gap-margin-bottom">
          {{ result }}
          &nbsp;
          <Copy v-model="result" />
        </div>
      </div>
    </Box>
  </div>
</template>

<script>
import VRadio from 'lvan/radio'
import VRadioGroup from 'lvan/radio/group.vue'
// import VButton from 'lvan/button'
import VTextarea from 'lvan/textarea'
import { debounce } from 'lvan/utils/shared'
import md5 from 'blueimp-md5'
import Box from '@/components/box'
import Copy from '@/components/copy'
import { utf8Encode, utf8Decode } from '@/utils/endecode/utf8'
import { uniEncode, uniDecode } from '@/utils/endecode/unicode'
import { base64Encode, base64Decode } from '@/utils/endecode/base64'
import { urlEncode, urlDecode } from '@/utils/endecode/url'
import { hexEncode, hexDecode } from '@/utils/endecode/hex'
import { html2js } from '@/utils/endecode/html2js'
import { gzipEncode, gzipDecode } from '@/utils/endecode/gzip'

function hexEscape(string) {
  const length = string.length
  let index = -1
  let result = ''
  let hex
  while (++index < length) {
    hex = string
      .charCodeAt(index)
      .toString(16)
      .toUpperCase()
    result += '\\x' + ('00' + hex).slice(-2)
  }
  return result
}

const endecode = {
  uniEncode,
  uniDecode,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  hexEncode,
  hexDecode,
  html2js,
  md5,
  gzipEncode,
  gzipDecode,
  utf8Encode(string) {
    return hexEscape(utf8Encode(string))
  },
  utf8Decode(string) {
    // eslint-disable-next-line no-eval
    return utf8Decode(eval("'" + string + "'"))
  }
}

export default {
  components: {
    Box,
    VRadio,
    VRadioGroup,
    // VButton,
    VTextarea,
    Copy
  },
  data() {
    return {
      type: 'uniEncode',
      content: '',
      result: ''
    }
  },
  watch: {
    content(content) {
      this.run(this.type, content)
    },
    type(type) {
      this.run(this.type, this.content)
    }
  },
  mounted() {
    this.run = debounce(this.run)
  },
  methods: {
    run(type, content) {
      if (content.trim()) {
        try {
          this.result = endecode[type](content)
        } catch (err) {
          this.result = '输入有误，内容不支持此种编码或解码'
        }
      } else {
        this.result = ''
      }
    }
  }
}
</script>
