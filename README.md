# hiweb-client

个人网站，使用 Nuxt、Graphql、Vue 开发的单页应用，数据接口由后端服务  <https://github.com/ffx0s/hiweb-server> 提供。

> 博客/个人类型的网站搭建有更多方便快捷的方式：（Hexo、Vuepress、Gridsome 等），此项目主要是为了研究学习新技术而折腾。

## 特性

1. blog 基础功能（登录注册、文章、标签、分类、留言、存档等）。
2. 动静分离，构建后的页面纯静态化，几乎不依赖服务端接口（搜索、登录注册、用户信息接口除外）。
2. 自动化构建打包，使用 github actions 自动化构建打包应用，并上传到云存储。

## 开发

数据依赖后端接口，需要先开启后端的服务。

```
cd hiweb-client
npm run dev
```

## 打包

### 手动打包

```
cd hiweb-client
npm run generate
```

### 自动打包&构建

自动打包构建依赖于 `github` 和 `又拍云` 的服务，步骤：

1. 在 github 上创建一个新的 repository，导入这个项目的代码。
2. 在 又拍云 上创建一个云存储服务用于存储页面资源。
3. 修改项目配置文件： `/hiweb-client/config/index.js`。

完成后，只要 `push` 代码到仓库就会自动触发构建打包的流程，或者你也可以前往 `https://mysite.com/manage` 点击页面上的部署按钮触发这个流程。


