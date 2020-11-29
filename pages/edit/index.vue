<template>
  <SideView>
    <Auth>
      <div :class="$style.header">
        <ImageUpload
          ref="uploader"
          v-model="post.poster"
          :class="$style.imageLink"
          :image-class="$style.image"
        />
      </div>

      <div :class="$style.content">
        <div :class="$style.meta">
          <span v-if="post.id" v-once>
            <i class="icon-clock"></i>
            {{ post.created | ago }}
          </span>
          <span v-else v-once>
            <i class="icon-clock"></i>
            刚刚
          </span>
          &nbsp;
          <Dropdown v-model="showCategoryMenu" align="right" click>
            <a slot="title" :class="$style.tag" href="javascript:;">
              <i class="icon-th-large" />
              {{ post.category.name || '选择分类' }}
            </a>
            <DropdownItem
              v-for="category in categories"
              :key="category.id"
              size="medium"
              @click.native="selectCategory(category)"
            >
              {{ category.name }}
            </DropdownItem>
            <DropdownItem
              tag="nuxt-link"
              to="/manage/?type=categories"
              size="medium"
            >
              <span class="v-color-primary">添加新分类</span>
            </DropdownItem>
          </Dropdown>
          <a
            v-for="(tagItem, i) in post.tags"
            :key="i"
            :class="[$style.tag, $style.item]"
            href="javascript:;"
          >
            <i :class="[$style.iconTag, 'icon-tag']"></i>
            <i
              :class="[$style.iconCancel, 'icon-cancel-circled']"
              @click="post.tags.splice(i, 1)"
            />
            <span>{{ tagItem }}</span>
          </a>
          <div :class="[$style.tag, 'display-flex']">
            <i class="icon-tag"></i>
            <Autocomplete
              ref="autocomplete"
              v-model="tagSearchValue"
              :input-class="$style.tagInput"
              placeholder="输入标签"
              @search="handleSearchTag"
              @select="handleSelectTag"
              @blur="handleBlur"
            />
          </div>
        </div>

        <Editor ref="editor" :markdown="post.markdown" />
      </div>
    </Auth>
    <RightSide
      slot="side"
      :save="savePost"
      :save-loading="savePostLoading"
      :change-poster="changePoster"
      :change-poster-loading="changePosterLoading"
    />
  </SideView>
</template>

<script>
import gql from 'graphql-tag'
import Editor from '@/components/editor'
import Auth from '@/components/auth'
import Dropdown from '@/components/dropdown'
import DropdownItem from '@/components/dropdown/item'
import Autocomplete from '@/components/autocomplete'
import SideView from '@/components/sideView'
import RightSide from './modules/rightSide'
import ImageUpload from './modules/imageUpload'

const LOCAL_POST = 'LOCAL_POST'

function getTitleAndSummary(html) {
  const container = document.createElement('div')
  const removeTags = ['pre']

  container.innerHTML = html

  // 提取第一个h1标签内容为标题
  const firstH1 = container.querySelector('h1')
  let title = ''

  if (firstH1) {
    title = firstH1.textContent
    firstH1.remove()
  }

  // 提取摘要的时候需要把pre标签等移除
  removeTags.forEach((tag) => {
    const targets = container.querySelectorAll(tag)
    for (let i = 0; i < targets.length; i++) {
      targets[i].remove()
    }
  })

  const maxLength = 200
  const summary = container.textContent.replace(/\n/g, '').substr(0, maxLength)

  return [title, summary]
}

function getRandomPoster() {
  return `https://picsum.photos/seed/${Date.now()}/1302/390`
}

function initPostData(post) {
  return {
    poster: getRandomPoster(),
    created: Date.now(),
    tags: [],
    category: {
      id: null,
      name: '',
    },
    markdown: '',
    ...post,
  }
}

const POST_QUERY = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      poster
      created
      tags
      category {
        id
        name
      }
      markdown
    }
  }
`

const TAGS_QUERY = gql`
  query tags($name: String) {
    tags(name: $name, limit: 50) {
      docs {
        name
      }
    }
  }
`

function getPostData(client, id) {
  return client
    .query({
      fetchPolicy: 'no-cache',
      query: POST_QUERY,
      variables: { id },
    })
    .then((result) => {
      return { post: result.data.post }
    })
}

export default {
  components: {
    Auth,
    Dropdown,
    DropdownItem,
    ImageUpload,
    Editor,
    Autocomplete,
    RightSide,
    SideView,
  },
  async fetch() {
    const id = this.$route.query.id
    if (id && !this.post.id) {
      const { post } = await getPostData(this.$apollo, id)
      this.post = post
    }
  },
  fetchOnServer: false,
  async asyncData({ app, query }) {
    return query.id
      ? await getPostData(app.apolloProvider.defaultClient, query.id)
      : { post: initPostData(process.client ? {} : { poster: '' }) }
  },
  data() {
    return {
      post: {},
      categories: [],
      showCategoryMenu: false,
      savePostLoading: false,
      changePosterLoading: false,
      tagSearchValue: '',
    }
  },
  beforeMount() {
    if (!this.$route.query.id) {
      try {
        const post = JSON.parse(localStorage[LOCAL_POST])
        Object.assign(this.post, post)
      } catch (err) {
        this.post.markdown = '# \n'
      }

      window.addEventListener('beforeunload', this.setLocalData)
      this.$on('hook:beforeDestroy', () => {
        window.removeEventListener('beforeunload', this.setLocalData)
      })
    }
  },
  methods: {
    routeLeave(next) {
      if (this.savePostLoading) {
        next()
      } else {
        this.$modal({
          content: '是否放弃当前的编辑？',
          showCancelButton: true,
          overlayClick: false,
          confirm(instance) {
            instance.done()
            next()
          },
        })
      }
    },
    selectCategory({ id, name }) {
      this.post.category = { id, name }
    },
    async savePost() {
      this.savePostLoading = true

      const editor = this.$refs.editor

      if (this.post.poster.startsWith('http')) {
        this.$refs.uploader.uploadRemoteImage(this.post.poster)
      }

      const content = await editor.getHtml()
      const [title, summary] = getTitleAndSummary(content)
      const form = {
        title,
        summary,
        content,
        poster: this.post.poster,
        category: this.post.category.id,
        tags: this.post.tags,
        keywords: this.post.tags.join(','),
        markdown: editor.getMarkdown(),
        toc: editor.getTOC(),
      }

      if (this.post.id) {
        form.id = this.post.id
      }

      if (this.checkFields(form)) {
        this.$apollo
          .mutate({
            fetchPolicy: 'no-cache',
            mutation: require('@/graphql/addPost'),
            variables: {
              post: form,
            },
          })
          .then(({ data }) => {
            this.$toast({ type: 'success' })
            this.$router.push({
              name: 'post-id',
              params: { id: data.createOrUpdatePost },
            })
            this.savePostLoading = false
            this.removeLocalData()
          })
      } else {
        this.savePostLoading = false
      }
    },
    checkFields(form) {
      const rules = [
        {
          name: 'poster',
          validator(value) {
            if (!value) return '请上传图片'
            if (value.startsWith('http')) return '请等待图片上传完成'
          },
        },
        { name: 'category', errMessage: '请添加分类' },
        { name: 'title', errMessage: '请填写标题' },
        { name: 'content', errMessage: '请填写内容' },
      ]
      const isEmpty = (value) => !value || !value.trim()

      const error = rules.some((field) => {
        const value = form[field.name]
        let errMessage = ''
        if (field.validator) {
          errMessage = field.validator(value)
        } else if (isEmpty(value)) {
          errMessage = field.errMessage
        }

        if (errMessage) {
          this.$toast(errMessage)
          return true
        }
      })

      return !error
    },
    initPageData(post) {
      this._tagCount = 0
      this.post = post
      this.$refs.editor.setMarkdown(post.markdown)
    },
    setLocalData() {
      const { poster, category, tags } = this.post
      const editor = this.$refs.editor

      localStorage[LOCAL_POST] = JSON.stringify({
        poster,
        category,
        tags,
        markdown: editor ? editor.getMarkdown() : '',
      })
    },
    removeLocalData() {
      localStorage.removeItem(LOCAL_POST)
    },
    createTag(name) {
      if (!name.trim()) return

      const result = this.$refs.autocomplete.list.find(
        (tag) => tag.value === name
      )

      if (!result) {
        this.$apollo
          .mutate({
            fetchPolicy: 'no-cache',
            mutation: require('@/graphql/addTag'),
            variables: {
              tag: { name },
            },
          })
          .then(({ data }) => {
            this.post.tags.push(name)
            this.tagSearchValue = ''
          })
          .catch((error) => {
            this.$toast(error.message)
          })
      }
    },
    handleSearchTag(value, callback) {
      this.$apollo
        .query({
          fetchPolicy: 'no-cache',
          query: TAGS_QUERY,
          variables: {
            name: value,
          },
        })
        .then(({ data }) => {
          const tags = data.tags.docs.map((tag) => {
            return { value: tag.name }
          })
          callback(tags)
        })
        .catch((error) => {
          callback(null, error)
        })
    },
    handleSelectTag(tag) {
      const result = this.post.tags.find((value) => value === tag.value)
      if (result) {
        this.$toast('标签已存在')
      } else {
        this.post.tags.push(tag.value)
      }
      setTimeout(() => {
        this.tagSearchValue = ''
      })
    },
    handleBlur(event) {
      setTimeout(() => {
        if (!this.$refs.autocomplete.errorMessage) {
          this.createTag(event.target.value)
        }
      }, 300)
    },
    changePoster() {
      this.changePosterLoading = true
      const image = new Image()

      image.onload = () => {
        this.changePosterLoading = false
        this.post.poster = image.src
      }
      image.onerror = () => {
        this.changePosterLoading = false
      }
      image.src = getRandomPoster()
    },
  },
  head() {
    return {
      title: '编辑文章',
    }
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories'),
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.routeLeave(() => {
      const id = to.query.id
      if (id) {
        getPostData(this.$apollo, id).then(({ post }) => {
          this.initPageData(post)
          next()
        })
      } else {
        this.initPageData(initPostData())
        next()
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    this.routeLeave(next)
  },
}
</script>

<style lang="postcss" module>
@import '~/components/cards/c1/style.css';
.item {
  & .iconCancel {
    display: none;
  }
  &:hover {
    & .iconTag {
      display: none;
    }
    & .iconCancel {
      display: inline;
    }
  }
}
.tagInput {
  border: none;
  outline: none;
  padding: 0 4px;
  font-size: 13px;
  color: var(--textRegular);
  background-color: var(--background);
}
</style>
