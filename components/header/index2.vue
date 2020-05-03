<template>
  <header :class="$style.header">
    <div :class="[$style.inner, 'wrapper']">
      <div :class="$style.left">
        <nuxt-link :class="[$style.logo, 'logo']" to="/" exact title="hiweb" />
        <i
          @click="toggleTheme('')"
          class="theme-icon icon-sun-inv"
          title="开启日间模式"
        />
        <i
          @click="toggleTheme('theme--dark')"
          class="theme-icon icon-moon"
          title="开启夜间模式"
        />
      </div>

      <div :class="$style.right">
        <Autocomplete
          ref="autocomplete"
          @search="handleSearch"
          @select="handleSelect"
          :class="$style.autocomplete"
        >
          <template v-slot:input="{ input }">
            <div :class="$style.search">
              <input
                :class="$style.input"
                v-model="searchValue"
                @input="input"
                placeholder="搜索"
                type="text"
              />
              <!-- <i class="icon-search"></i> -->
            </div>
          </template>
        </Autocomplete>

        <!-- <a :class="$style.github" href="#">
            <i class="icon-github-circled"></i>
          </a> -->
      </div>
      <nav :class="$style.nav">
        <nuxt-link :class="$style.navItem" to="/" exact>首页</nuxt-link>
        <Dropdown :class="$style.navItem" title="分类">
          <DropdownItem
            v-for="category in categories"
            :key="category.id"
            :to="`/category/${category.name}/`"
            align="between"
            tag="nuxt-link"
          >
            {{ category.name }}
            <span :class="$style.num">{{ category.postsNumber }}</span>
          </DropdownItem>
        </Dropdown>
        <nuxt-link :class="$style.navItem" to="/archives/page/1/">
          存档
        </nuxt-link>
        <!-- <a :class="$style.navItem" href="#">工具箱</a> -->
        <nuxt-link :class="$style.navItem" to="/about/">
          关于
        </nuxt-link>
        <Auth
          :showError="false"
          :class="$style.navItem"
          tag="nuxt-link"
          to="/manage/"
        >
          管理
        </Auth>
      </nav>
    </div>
  </header>
</template>

<script>
import gql from 'graphql-tag'
import Dropdown from '@/components/dropdown'
import DropdownItem from '@/components/dropdown/item'
import Autocomplete from '@/components/autocomplete'
import Auth from '@/components/auth'

const POSTS_QUERY = gql`
  query getPosts($title: String) {
    posts(page: 1, limit: 20, title: $title) {
      docs {
        id
        title
        category {
          id
          name
        }
      }
    }
  }
`

export default {
  components: {
    Dropdown,
    DropdownItem,
    Autocomplete,
    Auth
  },
  data() {
    return {
      categories: [],
      searchValue: ''
    }
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories')
    }
  },
  beforeMount() {
    this.lastThemeName = localStorage.THEME
  },
  methods: {
    handleSearch(value, callback) {
      this.$apollo
        .query({
          fetchPolicy: 'no-cache',
          query: POSTS_QUERY,
          variables: {
            title: value
          }
        })
        .then(({ data }) => {
          const posts = data.posts.docs.map((post) => {
            return { id: post.id, value: post.title }
          })
          callback(posts)
        })
        .catch((error) => {
          callback(null, error)
        })
    },
    handleSelect(post) {
      this.$router.push('/post/' + post.id + '/')
      this.searchValue = ''
    },
    toggleTheme(name) {
      if (this.lastThemeName) {
        document.body.classList.remove(this.lastThemeName)
      }
      if (name) {
        document.body.classList.add(name)
      }
      this.lastThemeName = name
      localStorage.THEME = name
    }
  }
}
</script>

<style lang="postcss" module>
.header {
  /* box-shadow: var(--shadow); */
  background-color: var(--themeBackground);
  margin-bottom: 1px;
}
.inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;
}
.left {
  position: relative;
  width: 6.25rem;
  height: 2.3125rem;
}
.logo {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--primary);
}
.nav {
  margin-left: 1.875rem;
  display: flex;
}
.navItem {
  height: 100%;
  line-height: 3.75rem;
  margin: 0 2px;
  padding: 0 10px;
  font-size: 16px;
  color: var(--textPrimary);
  transition: 0.3s;
}
.num {
  border-radius: 4px;
  font-size: 12px;
  padding: 0 5px;
  line-height: 1.8;
  background-color: var(--background);
}

.right {
  display: flex;
  justify-content: flex-end;
  flex: 1;
  order: 3;
}
.search {
  position: relative;
  display: flex;
  align-items: center;
  /* & i {
    position: absolute;
    right: 8px;
    font-size: 18px;
    color: var(--textRegular);
  } */
}
.input {
  color: var(--textPrimary);
  border: 1px solid var(--lightGray);
  width: 15rem;
  padding: 6px 28px 6px 10px;
  outline: none;
  border-radius: 20px;
  font-size: 14px;
  background-color: var(--background);
  transition: 0.3s;
  -webkit-appearance: none;
  &:focus {
    color: var(--textPrimary);
    border-color: var(--border);
    background-color: var(--themeBackground);
    /* & + i {
      color: var(--primary);
    } */
  }
}
/* .github {
  font-size: 20px;
  color: var(--textPrimary);
} */

@media (hover: hover) {
  .navItem {
    &:hover {
      color: var(--primary);
      background-color: var(--background);
    }
  }
}

@media (max-width: 760px) {
  .inner {
    padding-top: 0.75rem;
  }
  .nav {
    width: 100%;
    margin-left: 0;
    white-space: nowrap;
  }
  .navItem {
    &:first-child {
      padding-left: 0;
      margin-left: 0;
    }
  }
  .right {
    order: 0;
  }
}
@media (max-width: 414px) {
  .inner {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
}
@media (max-width: 320px) {
  .input {
    width: 13rem;
  }
}
</style>
