import gql from 'graphql-tag'

const TAGS_QUERY = gql`
  query tags($page: Int, $limit: Int) {
    tags(page: $page, limit: $limit) {
      docs {
        id
        name
        sort
        created
      }
      page
      pages
      total
    }
  }
`

const POSTS_QUERY = gql`
  query posts($page: Int, $limit: Int) {
    posts(page: $page, limit: $limit) {
      docs {
        id
        title
        created
        updated
        category {
          name
        }
      }
      page
      pages
      total
    }
  }
`

const USERS_QUERY = gql`
  query getUsers {
    users {
      id
      username
      name
      role
      githubId
      created
    }
  }
`

const config = Object.freeze([
  {
    field: 'categories',
    name: '分类',
    query: require('@/graphql/categories'),
    variables: {},
    props: ['id', 'name', 'sort', 'created', 'postsNumber'],
    edit: {
      variableName: 'category',
      mutation: require('@/graphql/addCategory'),
      items: [
        {
          title: '分类名',
          field: 'name',
          type: 'text',
          required: true,
          defaultValue: '',
          rules: [{ required: true, message: '请填写分类名' }]
        },
        { title: '排序', field: 'sort', type: 'number', defaultValue: 0 }
      ]
    },
    removeMutation: require('@/graphql/deleteCategory')
  },
  {
    field: 'tags',
    name: '标签',
    query: TAGS_QUERY,
    variables: { limit: 13 },
    props: ['id', 'name', 'sort', 'created'],
    edit: {
      variableName: 'tag',
      mutation: require('@/graphql/addTag'),
      items: [
        {
          title: '标签名',
          field: 'name',
          type: 'text',
          required: true,
          defaultValue: '',
          rules: [{ required: true, message: '请填写标签名' }]
        },
        { title: '排序', field: 'sort', type: 'number', defaultValue: 0 }
      ]
    },
    removeMutation: require('@/graphql/deleteTag')
  },
  {
    field: 'posts',
    name: '文章',
    query: POSTS_QUERY,
    variables: { limit: 13 },
    props: ['id', 'title', 'created', 'updated', 'category.name'],
    removeMutation: require('@/graphql/deletePost'),
    handleEdit(item) {
      const query = {}
      if (item) {
        query.id = item.id
      }
      this.$router.push({ name: 'edit', query })
    }
  },
  {
    field: 'comments',
    name: '评论/留言',
    query: require('@/graphql/comments'),
    variables: { limit: 13 },
    props: ['id', 'content', 'created', 'typeId', 'user.name'],
    removeMutation: require('@/graphql/deleteComment'),
    showCreateButton: false
  },
  {
    field: 'users',
    name: '用户',
    query: USERS_QUERY,
    variables: {},
    props: ['id', 'username', 'name', 'role', 'githubId', 'created'],
    showRemoveButton: false,
    showCreateButton: false,
    edit: {
      variableName: 'user',
      mutation: require('@/graphql/updateUser'),
      items: [
        {
          title: '用户名',
          field: 'username',
          type: 'text',
          required: true,
          defaultValue: '',
          rules: [{ required: true, message: '请填写用户名' }]
        },
        {
          title: '昵称',
          field: 'name',
          type: 'text',
          defaultValue: ''
        },
        {
          title: '权限',
          field: 'role',
          type: 'number',
          defaultValue: 0
        },
        {
          title: '头像',
          field: 'avatar',
          type: 'text',
          defaultValue: ''
        }
      ]
    }
  }
])

export function getConfig(type = 'categories') {
  return config.find((item) => item.field === type)
}

export default config
