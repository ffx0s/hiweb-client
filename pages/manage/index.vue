<template>
  <Auth :class="$style.manage" @auth="auth" class="box">
    <div class="row-between">
      <div>
        <Dropdown v-model="showMenu" :title="title" click align="right">
          <DropdownItem
            v-for="(item, i) in menus"
            :key="i"
            :to="'/manage/?type=' + item.type + '&page=1'"
            tag="nuxt-link"
            active-class=""
          >
            {{ item.name }}
          </DropdownItem>
        </Dropdown>
        &#12288;
        <VButton
          @click="handleEdit"
          v-show="showCreateButton"
          type="primary"
          small
        >
          添加{{ title }}
        </VButton>
      </div>

      <div>
        <VButton :loading="building" @click="handleBuild" type="warning" small>
          构建&部署
        </VButton>
        &nbsp;
        <span>
          共有
          <strong class="v-color-primary">{{ total }}</strong>
          条记录
        </span>
      </div>
    </div>

    <div :class="$style.table" class="markdown-body">
      <table v-if="items.length">
        <thead>
          <tr>
            <th v-for="(value, name) in items[0]" :key="name">{{ name }}</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td v-for="(value, name) in item" :key="name">{{ value }}</td>
            <td>
              <VButton
                @click="handleEdit(item, i)"
                v-show="showEditButton"
                type="primary"
                small
              >
                编辑
              </VButton>
              <VButton
                @click="handleRemove(item, i)"
                v-show="showRemoveButton"
                type="error"
                small
              >
                删除
              </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="query.pages > 1 && items.length"
      :forcePage="forcePage"
      :prev-text="'上一页'"
      :next-text="'下一页'"
      :pageCount="query.pages"
      :initial-page="query.page - 1"
      :routeOptions="routeOptions"
      position="right"
    />

    <EditModal ref="editModal" @success="editSuccess" />
  </Auth>
</template>

<script>
import VButton from 'lvan/button/index.vue'
import gql from 'graphql-tag'
import config, { getConfig } from './modules/config'
import EditModal from './modules/editModal'
import { githubRepoUrl } from '@/config'
import Auth from '@/components/auth'
import Dropdown from '@/components/dropdown'
import DropdownItem from '@/components/dropdown/item'
import Pagination from '@/components/pagination'
import { formatDate } from '@/utils/filters'

function getValue(obj, key) {
  return key.split('.').reduce((o, i) => (o ? o[i] : null), obj)
}

export default {
  layout: 'manage',
  components: {
    Auth,
    Dropdown,
    DropdownItem,
    VButton,
    Pagination,
    EditModal
  },
  head() {
    return {
      title: '管理 | hiweb'
    }
  },
  data() {
    return {
      title: '',
      showMenu: false,
      menus: config.map((item) => ({ name: item.name, type: item.field })),
      items: [],
      query: {
        page: 0,
        pages: 0
      },
      forcePage: undefined,
      total: 0,
      showEditButton: false,
      showRemoveButton: false,
      showCreateButton: false,
      building: false
    }
  },
  beforeRouteUpdate(to, from, next) {
    const page = +to.query.page
    this.forcePage = page - 1
    this.getData(to.query.type, { page })
    next()
  },
  methods: {
    auth(isAdmin) {
      if (isAdmin) {
        const type = this.$route.query.type
        if (!type) {
          this.$router.replace({
            name: 'manage',
            query: { type: 'posts', page: 1 }
          })
        } else {
          this.getData(type, { page: +this.$route.query.page })
        }
      }
    },
    async getData(type, vars = {}) {
      const {
        query,
        variables,
        field,
        props,
        name,
        edit,
        handleEdit,
        handleRemove,
        removeMutation,
        showEditButton = true,
        showCreateButton = true,
        showRemoveButton = true
      } = getConfig(type)

      const result = await this.$apollo.query({
        fetchPolicy: 'no-cache',
        query,
        variables: { ...variables, ...vars }
      })

      this.title = name
      this.showCreateButton = showCreateButton
      this.showEditButton = showEditButton && (!!edit || !!handleEdit)
      this.showRemoveButton =
        showRemoveButton && (!!removeMutation || !!handleRemove)

      if (result.data) {
        if (variables.limit) {
          const { page, pages, total, docs } = result.data[field]
          this.query.page = page
          this.query.pages = pages
          this.items = this.filterData(docs, props)
          this.total = total
        } else {
          this.query = {}
          this.items = this.filterData(result.data[field], props)
          this.total = this.items.length
        }
      }
    },
    filterData(data, props) {
      if (props) {
        return data.map((item, i) => {
          return this.filterProps(item, props)
        })
      }
      return data
    },
    filterProps(row, props) {
      const newRow = {}
      props.forEach((prop) => {
        let value = getValue(row, prop)
        if (prop === 'created' || prop === 'updated') {
          value = formatDate(value, 'YYYY-MM-DD')
        }
        newRow[prop] = value === null ? '-' : value
      })
      return newRow
    },
    routeOptions(page) {
      return {
        name: this.$route.name,
        query: { type: this.$route.query.type, page }
      }
    },
    handleEdit(item, i) {
      const { handleEdit } = getConfig(this.$route.query.type)
      if (handleEdit) {
        handleEdit.call(this, item, i)
      } else {
        this.$refs.editModal.show(item)
      }
    },
    handleRemove(item, i) {
      const { handleRemove, removeMutation } = getConfig(this.$route.query.type)

      if (handleRemove) {
        handleRemove.call(this, item, i)
      } else {
        const vm = this
        this.$modal({
          content: '确定删除？',
          showCancelButton: true,
          overlayClick: false,
          confirm(instance) {
            instance.confirmLoading = true
            vm.$apollo
              .mutate({
                fetchPolicy: 'no-cache',
                mutation: removeMutation,
                variables: {
                  id: item.id
                }
              })
              .then(({ data }) => {
                vm.items.splice(i, 1)
                instance.confirmLoading = false
                instance.done()
                vm.$toast({ type: 'success' })
              })
              .catch((err) => {
                instance.confirmLoading = false
                vm.$toast({ type: 'error', title: err.message })
              })
          }
        })
      }
    },
    handleBuild() {
      this.building = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation build {
              build
            }
          `
        })
        .then(({ data }) => {
          this.$modal({
            title: '构建中...',
            html: `<a class="v-color-primary" href="${githubRepoUrl}" target="_blank">点击查看进度</a>`,
            confirmText: '确认构建完成',
            overlayClick: false,
            confirm: (instance) => {
              this.building = false
              instance.done()
            }
          })
        })
        .catch((error) => {
          this.$modal({
            title: '构建失败',
            content: error.message
          })
          this.building = false
        })
    },
    editSuccess(id, row) {
      const { props } = getConfig(this.$route.query.type)
      const newRow = this.filterProps(row, props)

      if (id) {
        const index = this.items.findIndex((item) => item.id === id)
        this.items.splice(index, 1, newRow)
      } else {
        this.items.unshift(newRow)
      }
    }
  }
}
</script>

<style lang="postcss" module>
.manage {
  padding: var(--gap);
  color: var(--textPrimary);
}
.table {
  margin: 15px 0;
  & table {
    display: table;
  }
  & th,
  & td {
    max-width: 300px;
  }
  & tr {
    transition: 0.3s background;
  }
  & tbody tr:nth-child(2n) {
    background-color: transparent;
  }
  & tbody tr:hover {
    background-color: var(--background);
  }
}
</style>
