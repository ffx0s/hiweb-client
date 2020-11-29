export const isDev = process.env.NODE_ENV === 'development'

// api 接口
export const apiOrigin = isDev
  ? 'http://192.168.3.14:4001'
  : 'https://i.webfed.cn'

// export const apiOrigin = 'https://i.webfed.cn'
export const apiUrl = apiOrigin + '/api'

// github 授权配置
export const githubClientId = 'aff57348639680ac3677'
export const githubAuthorizeUrl = 'https://github.com/login/oauth/authorize'
export const githubRedirectUrl = apiOrigin + '/oauth/redirect'
export const githubLoginUrl = `${githubAuthorizeUrl}?client_id=${githubClientId}&redirect_uri=${githubRedirectUrl}`

// 当前项目的仓库地址，Github Actions 相关的操作会用到
export const githubRepoUrl = 'https://github.com/ffx0s/hiweb-client/actions'

// 又拍云配置
export const bucketName = 'image-hiweb'
export const uploadUrl = 'https://v0.api.upyun.com/' + bucketName
export const cdn = 'https://assets.webfed.cn'
