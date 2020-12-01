<template>
  <div ref="editor" :class="[$style.editor, 'markdown-body']"></div>
</template>

<script>
import { loadJS, loadCSS } from 'lvan/utils/shared'
import { cdn } from '@/config'

const headingSymbol = /#+\s/

export default {
  props: {
    markdown: {
      type: String,
      default: '',
    },
    change: {
      type: [Function, null],
      default: null,
    },
  },
  mounted() {
    this.removeCss = loadCSS('MuyaCSS', cdn + '/assets/muya/index.min.css?v8')
    setTimeout(() => {
      if (!window.Muya) {
        loadJS(cdn + '/assets/muya/renderer.aea5043844802b8f37da.js').then(
          this.createInstance
        )
      } else {
        this.createInstance()
      }
    }, 50)
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
    setTimeout(() => {
      this.removeCss()
    }, 50)
  },
  methods: {
    createInstance() {
      const Muya = window.Muya.default

      this.editor = new Muya(this.$refs.editor, {
        markdown: this.markdown,
      })

      if (this.change) {
        this.editor.on('change', this.change)
      }
    },
    setMarkdown(markdown) {
      this.editor.setMarkdown(markdown)
    },
    getMarkdown() {
      return this.editor.markdown
    },
    getHtml() {
      return this.editor.exportHtml()
    },
    getTOC() {
      const toc = this.editor.getTOC()
      toc.forEach((item, i) => {
        item.slug = 'heading' + (i + 1)
        item.content = item.content.replace(headingSymbol, '')
      })
      return toc
    },
  },
}
</script>

<style lang="postcss" module>
.editor {
  color: var(--textPrimary);
  & h1:first-child {
    font-size: 30px;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 0;
  }
}
</style>
