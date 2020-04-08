<template>
  <div>
    <div :class="$style.about" class="markdown-body box">
      <h2>关于我</h2>
      <p>
        console.success("喜欢前端并从事着前端开发工作 😊")
      </p>
      <p>
        console.error("买了很多书，却不怎么去看 😢")
      </p>
      <p>
        console.debug("为今朝写的一手好代码沾沾自喜，来日回头看却默默流泪 💔")
      </p>
      <h2>关于本站</h2>
      <p>
        网站的前端页面是基于 Vue 开发的单页应用（前端后端分离），主要用了 Nuxt
        和 Graphql（数据获取），通过 Nuxt Generate
        功能生成静态化页面。静态化后数据的获取和渲染不依赖于服务器。
      </p>
      <p>
        后端基于 Node + Express，使用 Graphql 对外提供数据查询接口，使用 Mongodb
        + Redis 存储数据和会话，开发环境下使用 Typescript 编写代码，使用 Docker
        + Github Actions 实现自动构建和部署。
      </p>
      <h3>功能特点</h3>
      <ol>
        <li>Blog 基础功能（登录注册、文章、标签、分类、留言、存档等）。</li>
        <li>
          集成了 Markdown 编辑器：Marktext Muya，让编辑文档时可视化。
        </li>
        <li>
          自动化构建打包，使用 github actions
          自动化构建打包应用，并上传到云存储。
        </li>
      </ol>
      <h3>代码仓库</h3>
      <p>
        <a href="https://github.com/ffx0s/hiweb-client" target="__blank">
          前端应用
        </a>
        &nbsp;
        <a href="https://github.com/ffx0s/hiweb-server" target="__blank">
          后端服务
        </a>
      </p>
    </div>
    <br />
    <Comment type-id="5e8d4bb932f4420058a0a87a" type="MESSAGE" />
  </div>
</template>

<script>
import Comment from '@/components/comment'

export default {
  components: {
    Comment
  },
  head() {
    return {
      title: '关于 | hiweb',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '关于网站' },
        { hid: 'description', name: 'description', content: '网站简介' }
      ]
    }
  }
}
</script>

<style lang="postcss" module>
.about {
  padding: var(--gap);
}
</style>
