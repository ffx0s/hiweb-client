<template>
  <div :class="$style.item">
    <Avatar :src="data.user.avatar" />
    <div :class="$style.content">
      <div :class="$style.info">
        <!-- 评论名 -->
        <a
          :class="$style.name"
          :href="'https://github.com/' + data.user.name"
          rel="nofollow"
          target="_blank"
        >
          <strong>{{ data.user.name }}</strong>
        </a>
        &nbsp;

        <!-- 评论时间 -->
        <span>{{ data.created | ago }}</span>

        <!-- 回复操作 -->
        <a
          :class="[$style.replylink, 'v-text-regular', 'icon-reply']"
          @click="reply(data)"
          href="javascript:;"
          title="回复Ta"
        />
      </div>

      <!-- 评论内容 -->
      <div :class="$style.body">
        <template v-if="data.to">
          回复&nbsp;
          <a :class="$style.name" href="#">{{ data.to.name }}</a>
          &nbsp;:&nbsp;
        </template>
        {{ data.content }}
      </div>

      <!-- 回复列表 -->
      <div
        v-if="data.count"
        :class="$style.replyList"
        :style="{ height: height + 'px' }"
      >
        <div ref="list" v-if="comments && comments.docs">
          <CommentItem
            v-for="item in comments.docs"
            :key="item.id"
            :data="item"
            @reply="reply(item)"
          />
        </div>
        <VButton
          v-else-if="error"
          :class="$style.replyBtn"
          :loading="$apollo.queries.comments.loading"
          @click="refetch"
          small
          text
          type="error"
        >
          加载失败，点击重试
        </VButton>
        <VButton
          v-else
          :class="$style.replyBtn"
          :loading="$apollo.queries.comments.loading"
          @click="skip = false"
          small
          text
        >
          {{ '查看回复(' + data.count + ')' }}
        </VButton>
      </div>
      <VButton v-else :class="$style.replyBtn" @click="reply(data)" small text>
        回复Ta
      </VButton>
    </div>
  </div>
</template>

<script>
import VButton from 'lvan/button'
import Avatar from '../avatar'

export default {
  name: 'CommentItem',
  components: {
    Avatar,
    VButton
  },
  inject: ['type'],
  props: {
    data: {
      type: Object,
      default: () => ({
        parentId: '',
        user: {},
        to: {},
        name: '',
        created: '',
        content: '',
        count: 0
      })
    }
  },
  apollo: {
    comments: {
      query: require('@/graphql/comments'),
      variables() {
        return {
          offset: 0,
          limit: 20,
          sort: 1,
          type: this.type,
          parentId: this.data.id
        }
      },
      skip() {
        return this.skip
      },
      error(error) {
        this.error = error
      }
    }
  },
  data() {
    return {
      skip: true,
      height: 28,
      error: null
    }
  },
  watch: {
    'comments.docs'() {
      this.updateHeight()
    }
  },
  methods: {
    reply(data) {
      this.$emit('reply', data)
    },
    refetch() {
      this.$apollo.queries.comments.refetch()
    },
    updateHeight() {
      this.$nextTick(() => {
        const list = this.$refs.list
        if (list) {
          this.height = list.offsetHeight
        }
      })
    }
  }
}
</script>

<style lang="postcss" module>
.item {
  display: flex;
  margin-bottom: var(--gap);
  color: var(--textPrimary);
  & .item {
    padding-bottom: 14px;
    margin-bottom: 0;
    &:first-child {
      padding-top: 14px;
    }
    & .replyBtn {
      display: none;
    }
  }
}
.info {
  font-size: 12px;
  color: var(--textRegular);
}
.name {
  color: var(--primary);
  &:hover {
    opacity: 0.9;
    text-decoration: underline;
  }
}
.content {
  margin-left: 14px;
  flex: 1;
  font-size: 14px;
  &:hover {
    & > .info .replylink {
      visibility: visible;
      opacity: 1;
    }
  }
}
.replylink {
  visibility: hidden;
  font-size: 14px;
  opacity: 0;
  transition: 0.3s;
}
.body {
  margin: 5px 0;
}
.replyList {
  transition: 0.5s height;
  overflow: hidden;
}
.replyBtn {
  margin-left: -8px;
  color: var(--textRegular);
}
</style>
