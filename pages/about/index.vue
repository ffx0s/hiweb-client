<template>
  <div>
    <div :class="$style.about" class="markdown-body">
      <h2>关于我</h2>
      <p>Not Found</p>
      <h2>关于本站</h2>
      <p>
        前端（Vue、Nuxt）：通过 Graphql 获取数据，利用 Nuxt Generate
        功能生成不依赖服务器的纯静态化页面。
      </p>
      <p>
        后端（Node、Express、Typescript），使用 Graphql
        对外提供数据查询接口，Mongodb + Redis 存储数据和会话，使用 Docker +
        Github Actions 实现自动构建和部署。
      </p>
      <h3>功能</h3>
      <ol>
        <li>页面纯静态化，通过后台管理在线部署打包应用。</li>
        <li>Blog 基础功能（登录注册、文章、标签、分类、留言、存档等）。</li>
        <li>文章内容可视化编辑。</li>
        <li>自动化构建打包，Github Actions 构建应用，内容自动上传到云存储。</li>
        <li>页面响应式布局，支持移动端和PC端。</li>
      </ol>
      <h3>源码</h3>
      <p>
        <a href="https://github.com/ffx0s/hiweb-client" target="__blank">
          前端
        </a>
        &nbsp;
        <a href="https://github.com/ffx0s/hiweb-server" target="__blank">
          后端
        </a>
      </p>
    </div>
    <br />
    <Comment type-id="5e8d4bb932f4420058a0a87a" type="MESSAGE" />
  </div>
</template>

<script>
import { transition } from '@/plugins/transition.client'
import Comment from '@/components/comment'

export default {
  components: {
    Comment,
  },
  transition,
  head() {
    return {
      title: '关于 | hiweb',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '关于网站' },
        { hid: 'description', name: 'description', content: '网站简介' },
      ],
    }
  },
}
</script>

<style lang="postcss" module>
.about {
  padding: var(--gap);
}
</style>
