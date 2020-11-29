# Hiweb

个人网站，使用 NuxtJS、Graphql 开发。

> 此项目纯属研究学习新技术而折腾，快速搭建可选择：Hexo、Vuepress、Gridsome 等方案。

## 功能

1. Blog 基础功能（登录注册、文章、标签、分类、留言、存档等）。
2. 动静分离，构建后的页面纯静态化，几乎不依赖服务端接口。
2. 一个命令解决构建打包和部署，使用 Github Actions 自动化构建打包应用，并上传到云存储。

## 开发

```
cd hiweb-client
npm run dev
```

## 部署-构建打包

### 手动

```
cd hiweb-client
npm run generate
```

### 自动

自动构建打包依赖于 `Github` 和 `又拍云` 的服务，步骤：

1. 在 Github 创建一个新的 Repository 导入该项目。
2. 在又拍云创建一个云存储服务用于存储页面资源。
3. 修改项目配置文件： `/hiweb-client/config/index.js`。

完成后，只要 `push` 代码到仓库就会自动触发构建打包的流程，或者前往 `/manage` 应用页面，点击部署按钮触发部署流程。


