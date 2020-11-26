<template>
  <Box title="存档" link="/archives/page/1/">
    <template v-if="archives">
      <nuxt-link
        v-for="archive in archives"
        :key="archive.id"
        :class="$style.item"
        :to="'/archives/' + archive.link + '/'"
        active-class=""
      >
        <span>{{ archive.date }}</span>
        <span :class="$style.num">{{ archive.postsNumber }}</span>
      </nuxt-link>
    </template>
  </Box>
</template>

<script>
import gql from 'graphql-tag'
import Box from '@/components/box'
import { formatDate } from '@/utils/filters'

export default {
  components: {
    Box
  },
  apollo: {
    archives: {
      query: gql`
        query archives($page: Int, $limit: Int) {
          archives(page: $page, limit: $limit) {
            docs {
              id
              date
              postsNumber
            }
          }
        }
      `,
      variables: {
        page: 1,
        limit: 5
      },
      deep: false,
      update(data) {
        const docs = data.archives.docs
        if (!docs.hasOwnProperty('__ob__')) {
          docs.forEach((archive) => {
            const date = archive.date
            archive.date = formatDate(date, 'YYYY年 MM月')
            archive.link = formatDate(date, 'YYYY-MM')
          })
        }
        return docs
      }
    }
  }
}
</script>

<style lang="postcss" module>
.item {
  display: flex;
  padding: 7px 0;
  font-size: 14px;
  border-radius: 2px;
  color: var(--textPrimary);
  align-items: center;
  justify-content: space-between;
  transition: color 0.3s;
  &:hover {
    color: var(--primary);
  }
  & .num {
    padding: 0 5px;
    border-radius: 4px;
    line-height: 1.8;
    background-color: var(--background);
    font-size: 12px;
  }
}
</style>
