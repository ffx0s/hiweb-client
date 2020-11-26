<template>
  <SideView>
    <Auth>
      <div :class="$style.header">
        <ImageUpload
          :class="$style.imageLink"
          :imageClass="$style.image"
          v-model="post.poster"
        />
      </div>

      <div :class="$style.content">
        <div :class="$style.meta">
          <span v-once v-if="post.id">
            <i class="icon-clock"></i>
            {{ post.created | ago }}
          </span>
          <span v-once v-else>
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
              @click.native="selectCategory(category)"
              size="medium"
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
              @click="post.tags.splice(i, 1)"
              :class="[$style.iconCancel, 'icon-cancel-circled']"
            />
            <span>{{ tagItem }}</span>
          </a>
          <div :class="[$style.tag, 'display-flex']">
            <i class="icon-tag"></i>
            <Autocomplete
              ref="autocomplete"
              v-model="tagSearchValue"
              @search="handleSearchTag"
              @select="handleSelectTag"
              @blur="handleBlur"
              :inputClass="$style.tagInput"
              placeholder="输入标签"
            />
          </div>
        </div>

        <Editor ref="editor" :markdown="post.markdown" />
      </div>
    </Auth>
    <RightSide slot="side" :save="savePost" :loading="savePostLoading" />
  </SideView>
</template>

<script>
import gql from 'graphql-tag'
import ImageUpload from './modules/imageUpload'
import RightSide from './modules/rightSide'
import Editor from '@/components/editor'
import Auth from '@/components/auth'
import Dropdown from '@/components/dropdown'
import DropdownItem from '@/components/dropdown/item'
import Autocomplete from '@/components/autocomplete'
import SideView from '@/components/sideView'

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

function initPostData() {
  return {
    poster: '',
    created: Date.now(),
    tags: [],
    category: {
      id: null,
      name: ''
    },
    markdown: ''
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
      variables: { id }
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
    SideView
  },
  head() {
    return {
      title: '编辑文章'
    }
  },
  data() {
    return {
      post: {},
      categories: [],
      showCategoryMenu: false,
      savePostLoading: false,
      tagSearchValue: ''
    }
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories')
    }
  },
  async asyncData({ app, query }) {
    if (query.id) {
      const data = await getPostData(app.apolloProvider.defaultClient, query.id)
      return data
    }
    return { post: initPostData() }
  },
  beforeMount() {
    if (!this.$route.query.id) {
      try {
        const post = JSON.parse(localStorage[LOCAL_POST])
        Object.assign(this.post, post)
      } catch (err) {
        this.post.markdown = '# \n'
      }

      this.setLocalData = this.setLocalData.bind(this)
      this.eventAction(addEventListener)
    }
  },
  beforeDestroy() {
    this.eventAction(removeEventListener)
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
          }
        })
      }
    },
    selectCategory(category) {
      this.post.category.id = category.id
      this.post.category.name = category.name
    },
    async savePost() {
      this.savePostLoading = true

      const editor = this.$refs.editor
      const content = await editor.getHtml()
      const [title, summary] = getTitleAndSummary(content)
      const form = {
        title,
        summary,
        content,
        tags: this.post.tags,
        keywords: this.post.tags.join(','),
        markdown: editor.getMarkdown(),
        toc: editor.getTOC(),
        poster: this.post.poster,
        category: this.post.category.id
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
              post: form
            }
          })
          .then(({ data }) => {
            this.$toast({ type: 'success' })
            this.$router.push({
              name: 'post-id',
              params: { id: data.createOrUpdatePost }
            })
            this.savePostLoading = false
            this.removeLocalData()
          })
      } else {
        this.savePostLoading = false
      }
    },
    checkFields(form) {
      const requiredFields = [
        { name: 'category', error: '请添加分类' },
        { name: 'title', error: '请填写标题' },
        { name: 'content', error: '请填写内容' }
      ]
      let noError = true

      requiredFields.find((field) => {
        const value = form[field.name]

        if (!value) {
          this.$toast(field.error)
          noError = false
        }
        return !value
      })

      return noError
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
        markdown: editor ? editor.getMarkdown() : ''
      })
    },
    removeLocalData() {
      localStorage.removeItem(LOCAL_POST)
    },
    eventAction(action) {
      action('beforeunload', this.setLocalData)
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
              tag: { name }
            }
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
            name: value
          }
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
    }
  }
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
