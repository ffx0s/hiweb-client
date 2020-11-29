<template>
  <Box v-if="tree.length" title="目录">
    <ul :class="$style.tree">
      <li v-for="(item, itemIndex) in tree" :key="itemIndex">
        <a :class="$style.anchor" :href="'#' + item.slug">
          {{ item.label }}
        </a>
        <!-- 只显示二级，暂时写死 -->
        <ul v-if="item.children[0]" :class="$style.tree">
          <li
            v-for="(cildrenItem, cildrenItemIndex) in item.children"
            :key="cildrenItemIndex"
          >
            <a :class="$style.anchor" :href="'#' + cildrenItem.slug">
              {{ cildrenItem.label }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </Box>
</template>

<script>
import Box from '@/components/box'
import { listToTree } from '@/utils/editor'

export default {
  components: {
    Box,
  },
  props: {
    tocs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    tree() {
      // 因为 tocs 第一个是标题，需要去掉标题
      return this.tocs.length > 1
        ? listToTree(this.tocs.slice(1, this.tocs.length))
        : []
    },
  },
}
</script>

<style lang="postcss" module>
.tree {
  padding-left: 20px;
  list-style: disc;
  & li {
    color: var(--textPrimary);
  }
  & .tree {
    list-style: none;
    padding-left: 10px;
    & .anchor {
      padding: 2px 0;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
.anchor {
  display: block;
  padding: 6px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--textPrimary);
}
</style>
