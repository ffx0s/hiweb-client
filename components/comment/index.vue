<template>
  <div id="Anchor_comment" :class="[$style.comment, 'box']">
    <client-only>
      <div :class="$style.header">
        <div :class="[$style.bar, 'row-between']">
          <p v-if="comments" class="v-text-primary">
            <strong class="v-color-primary">
              {{ comments.total }}
            </strong>
            条评论
          </p>
          <p v-else class="v-text-primary">评论</p>
          <Login :skipQuery="skipQuery" />
        </div>
        <!-- 添加/回复评论 -->
        <CommentForm
          ref="form"
          :me="me"
          :target="target"
          @update:target="(_target) => (target = _target)"
          @success="addSuccess"
        />
      </div>

      <!-- 评论列表 -->
      <InfiniteScroll
        v-model="$apollo.queries.comments.loading"
        :pullRefresh="false"
        :empty="comments && !comments.total"
        :finished="comments && offset >= comments.total - comments.limit"
        :failed="failed"
        :loadingClass="$style.loading"
        :class="$style.list"
        @load="load"
      >
        <transition-group
          :css="!!transitionName"
          :name="transitionName"
          tag="div"
        >
          <template v-if="comments">
            <CommentItem
              v-for="item in comments.docs"
              :key="item.id"
              :data="item"
              @reply="reply"
              class="list-item"
            />
          </template>
        </transition-group>
        <div slot="finished">暂无更多评论</div>
        <div slot="empty">一条评论都没有，太惨了！</div>
      </InfiniteScroll>
    </client-only>
  </div>
</template>

<script>
import InfiniteScroll from 'lvan/infiniteScroll/index.vue'
import CommentItem from './item'
import CommentForm from './form'
import Login from '@/components/login'

const initOffset = 0
const limit = 10

export default {
  components: {
    Login,
    CommentItem,
    CommentForm,
    InfiniteScroll
  },
  apollo: {
    comments: {
      // 网络改变时也需要更新loading状态
      notifyOnNetworkStatusChange: true,
      query: require('@/graphql/comments'),
      variables() {
        return {
          limit,
          type: 'POST',
          typeId: this.postId,
          offset: initOffset
        }
      },
      skip() {
        return this.skipQuery
      },
      error(error) {
        this.failure(error)
      }
    },
    me: {
      query: require('@/graphql/me'),
      skip() {
        return this.skipQuery
      }
    }
  },
  data() {
    return {
      postId: this.$route.params.id,
      offset: initOffset,
      skipQuery: true,
      failed: false,
      target: { user: {} },
      transitionName: ''
    }
  },
  methods: {
    load() {
      if (this.skipQuery) {
        this.skipQuery = false
      } else if (this.failed && this.offset === 0) {
        // 首次加载失败
        this.$apollo.queries.comments.refetch()
      } else {
        // 加载更多
        this.$apollo.queries.comments
          .fetchMore({
            // 新的变量
            variables: {
              offset: this.failed ? this.offset : (this.offset += limit)
            },
            // 用新数据转换之前的结果
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const comments = fetchMoreResult.comments
              const docs = previousResult.comments.docs.concat(comments.docs)

              delete comments.docs

              return {
                comments: {
                  docs,
                  ...comments
                }
              }
            }
          })
          .catch(this.failure)
      }

      this.failed = false
    },
    failure() {
      this.failed = true
    },
    reply(comment) {
      this.target = { ...comment }
      this.$refs.form.$refs.textarea.$el.focus()
    },
    addSuccess(updateList) {
      if (updateList) {
        // 评论列表添加了一条记录，offset 也要加一
        this.offset += 1
        // 只有在添加成功的时候有动画
        this.transitionName = 'list'
        setTimeout(() => {
          this.transitionName = ''
        }, 1000)
      }
    }
  }
}
</script>

<style lang="postcss" module>
.comment {
  min-height: 270px;
  padding: 0 18px 18px;
}
.header {
  padding-top: 18px;
  position: sticky;
  top: 0;
  background-color: var(--themeBackground);
  z-index: 2;
}
.bar {
  font-size: 14px;
  padding-bottom: 14px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--lightGray);
}
.list {
  font-size: 14px;
  color: var(--textRegular);
}
.loading {
  color: var(--border);
}
</style>
