<template>
  <header :class="$style.header">
    <div :class="[$style.inner, 'wrapper']">
      <div :class="$style.left">
        <!-- logo -->
        <nuxt-link :class="$style.logo" to="/" exact title="hiweb" />
        <i
          class="theme-icon icon-sun-inv"
          title="亮色主题"
          @click="toggleTheme('')"
        />
        <i
          class="theme-icon icon-moon"
          title="暗色主题"
          @click="toggleTheme('theme--dark')"
        />
      </div>

      <!-- nav -->
      <nav :class="$style.nav">
        <nuxt-link :class="$style.navItem" to="/" exact>首页</nuxt-link>
        <nuxt-link
          v-for="category in categories"
          :key="category.id"
          :class="$style.navItem"
          :to="`/category/${category.name}/`"
        >
          {{ category.name }}
        </nuxt-link>
        <a
          :class="$style.navItem"
          href="http://jsrun.net/u/ffx0s"
          target="__blank"
          title="代码笔记"
        >
          Code
        </a>
        <nuxt-link :class="$style.navItem" to="/archives/page/1/">
          存档
        </nuxt-link>
        <nuxt-link :class="$style.navItem" to="/about/"> 关于 </nuxt-link>
        <VAuth
          :show-error="false"
          :class="$style.navItem"
          tag="nuxt-link"
          to="/manage/"
        >
          管理
        </VAuth>
      </nav>

      <!-- right -->
      <div :class="$style.right">
        <Autocomplete
          :list-class="$style.searchResult"
          @search="handleSearch"
          @select="handleSelect"
        >
          <template v-slot:input="{ input, keyup, focus, blur }">
            <Search
              ref="searchInput"
              v-model="searchValue"
              :active="searchActive"
              @input="input"
              @keyup.native="keyup"
              @focus="focus"
              @blur="blur"
              @active="(active) => (searchActive = active)"
            />
          </template>
        </Autocomplete>

        <!-- menu -->
        <HamIcon
          :class="$style.menuIcon"
          :active="showDrawer"
          @click.native="handleMenuClick"
        />
      </div>
    </div>
  </header>
</template>

<script>
import gql from 'graphql-tag'
import Autocomplete from '@/components/autocomplete'
import VAuth from '@/components/auth'
import HamIcon from '@/components/hamIcon'
import Search from '@/components/search'

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
    Autocomplete,
    VAuth,
    HamIcon,
    Search,
  },
  data() {
    return {
      categories: [],
      searchValue: '',
      menuActive: false,
      searchActive: false,
    }
  },
  computed: {
    showDrawer() {
      return this.$store.state.showDrawer
    },
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories'),
    },
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
            title: value,
          },
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
      this.$refs.searchInput.emitBlur()
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
    },
    handleMenuClick() {
      this.$store.commit('showDrawer', !this.showDrawer)
    },
  },
}
</script>

<style lang="postcss" module>
.header {
  position: relative;
  background-color: var(--background);
  z-index: 9999;
  height: var(--headerHeight);
}

.inner {
  display: flex;
  align-items: center;
  height: 100%;
}

.left {
  position: relative;
  height: 2.3125rem;
  width: 6.25rem;
}

.logo {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--primary);
  mask-image: url('~assets/images/logo.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
}

.nav {
  margin-left: 1.875rem;
  display: flex;
}

.navItem {
  height: 100%;
  line-height: var(--headerHeight);
  margin: 0 2px;
  padding: 0 10px;
  font-size: 16px;
  color: var(--textPrimary);
  transition: 0.3s;
}

.right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

.searchResult {
  width: 250px !important;
}

.menuIcon {
  display: none;
  margin-right: -10px;
  margin-left: 5px;
}

@media (hover: hover) {
  .navItem {
    &:hover {
      color: var(--primary);
    }
  }
}

@media not all and (max-width: 768px) {
  .header {
    position: sticky;
    top: 0;
  }
}

@media (max-width: 768px) {
  .header {
    box-shadow: var(--shadow);
  }
  .menuIcon {
    display: block;
  }
  .inner {
    padding: 0 var(--gap);
  }
  .nav {
    display: none;
  }
}
</style>
