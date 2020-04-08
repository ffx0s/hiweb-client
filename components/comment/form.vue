<template>
  <div :class="$style.form">
    <div class="display-flex">
      <Avatar :src="me && me.avatar" />
      <div :class="$style.textarea">
        <VTextarea
          ref="textarea"
          v-model="form.content"
          :class="[$style.input, target.user.name && $style.replyState]"
          placeholder="说点什么..."
        />
        <div :class="$style.tag" v-if="target.user.name">
          @{{ target.user.name }}
          <i @click="removeTarget" class="icon-cancel-circled" />
        </div>
      </div>
    </div>

    <ApolloMutation
      :mutation="require('@/graphql/addComment')"
      :variables="{ comment: form }"
      :update="updateCache"
      :class="$style.btns"
    >
      <template v-slot="{ mutate, loading, error }">
        <span v-if="error" class="v-color-error">{{ error }}</span>
        &nbsp;
        <VButton
          :disabled="!me || !form.content.trim()"
          :loading="loading"
          @click="addComment(mutate)"
          type="primary"
          small
        >
          {{ target.user.name ? '回复Ta' : '发送评论' }}
        </VButton>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import VButton from 'lvan/button/index.vue'
import VTextarea from 'lvan/textarea/index.vue'
import Avatar from '../avatar'

export default {
  components: {
    Avatar,
    VButton,
    VTextarea
  },
  inject: ['type', 'typeId'],
  props: {
    me: {
      type: Object,
      default: () => {}
    },
    // 如果是回复别人的评论，需要将被评论对象的数据传递过来
    target: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        type: this.type,
        typeId: this.typeId,
        content: '',
        parentId: null,
        to: null
      }
    }
  },
  methods: {
    removeTarget() {
      this.$emit('update:target', { user: {} })
    },
    addComment(mutate) {
      if (this.target.parentId) {
        this.form.to = this.target.user.id
        this.form.parentId = this.target.parentId
      } else {
        this.form.to = null
        this.form.parentId = this.target.id
      }

      mutate()
    },
    // 用于更新评论和回复列表并且写入缓存
    commonUpdate(store, variablesOptions, update) {
      const query = require('@/graphql/comments')
      const variables = {
        type: 'POST',
        ...variablesOptions
      }
      const data = store.readQuery({ query, variables })
      const newData = update(data)

      if (newData) {
        // 将数据写回缓存
        store.writeQuery({ query, variables, data: newData })
      }
    },
    // 添加或者回复成功后需要更新列表UI和缓存
    updateCache(store, { data: { addComment } }) {
      // 如果parentId没有，为评论所以更新列表，否则为回复更新回复列表
      const updateList = !this.form.parentId

      addComment.user = { ...this.me }
      addComment.to = this.form.to ? { ...this.target.user } : null

      if (updateList) {
        this.commonUpdate(store, { typeId: this.form.typeId }, (cacheData) => {
          cacheData.comments.docs.unshift(addComment)
          cacheData.comments.total += 1
          return cacheData
        })
      } else {
        let replyCount = 0
        // 更新回复数
        this.commonUpdate(store, { typeId: this.form.typeId }, (cacheData) => {
          const comment = cacheData.comments.docs.find(
            (item) => this.form.parentId === item.id
          )
          // 回复数+1并记录
          replyCount = comment.count++
          return cacheData
        })
        // 更新回复列表
        this.commonUpdate(
          store,
          { parentId: this.form.parentId },
          (cacheData) => {
            if (cacheData) {
              cacheData.comments.docs.push(addComment)
              cacheData.comments.total += 1
              return cacheData
            } else if (!replyCount) {
              return {
                comments: {
                  docs: [addComment],
                  offset: 0,
                  total: 1,
                  limit: 10,
                  page: null,
                  pages: null,
                  __typename: 'CommentConnection'
                }
              }
            }
          }
        )
      }

      // 成功
      this.form.content = ''
      this.removeTarget()
      this.$toast({ type: 'success' })
      this.$emit('success', updateList)
    }
  }
}
</script>

<style lang="postcss" module>
.textarea {
  position: relative;
  margin-left: 14px;
  flex: 1;
  & .tag {
    position: absolute;
    top: 8px;
    left: 8px;
  }
}
.input {
  padding: 8px;
  width: 100%;
  min-height: 80px;
  outline: none;
  resize: none;
  transition: background 0.3s;
  color: var(--textPrimary);
  border-radius: 4px;
  border: 1px solid var(--lightGray);
  background-color: var(--background);
  font-size: 14px;
  resize: none;
  &:focus {
    color: var(--textPrimary);
    background-color: var(--themeBackground);
  }
  &.replyState {
    padding-top: 35px;
  }
}
.btns {
  padding: 5px 0;
  text-align: right;
  font-size: 12px;
}
.tag {
  padding: 4px;
  font-size: 12px;
  color: var(--textRegular);
  background-color: var(--themeBackground);
  border: 1px solid var(--lightGray);
  border-radius: 4px;
  line-height: 0;
  & i {
    opacity: 0.7;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
