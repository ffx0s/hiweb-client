<template>
  <Box
    :class="[$style.toc, toggle ? $style.show : '', 'box']"
    v-if="$route.name === 'post-id' && tree.length"
    title="目录"
  >
    <ul :class="$style.tree">
      <li v-for="(item, itemIndex) in tree" :key="itemIndex">
        <a :class="$style.anchor" :href="'#' + item.slug">
          {{ item.label }}
        </a>
        <!-- 只显示二级，暂时写死 -->
        <ul :class="$style.tree" v-if="item.children[0]">
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
    <div :class="$style.layer" @click="toggle = false"></div>
    <div v-show="!toggle" :class="$style.toggle" @click="toggle = true">
      <i class="icon-th-large"></i>
    </div>
  </Box>
</template>

<script>
import gql from 'graphql-tag'
import Box from './box'
import { listToTree } from '@/utils/editor'

const TOCS_QUERY = gql`
  query {
    tocs
  }
`

export default {
  components: {
    Box
  },
  data() {
    return {
      tocs: [],
      toggle: false,
      skip: true
    }
  },
  apollo: {
    tocs: {
      fetchPolicy: 'cache-only',
      query: TOCS_QUERY,
      skip() {
        return this.skip
      }
    }
  },
  computed: {
    tree() {
      // 因为 tocs 第一个是标题，需要去掉标题
      return this.tocs ? listToTree(this.tocs.slice(1, this.tocs.length)) : []
    }
  },
  mounted() {
    this.skip = false
  }
}
</script>

<style lang="postcss" module>
.toc {
  --tocButtonSize: 35px;
  position: sticky;
  top: var(--gap);
  margin-top: var(--gap);
}
.toggle {
  display: none;
}
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

@media (max-width: 1000px) {
  .toc {
    box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
    position: fixed;
    margin-top: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    z-index: 2;
    transition: 0.3s transform;
    transform: translate3d(100%, 0, 0);
    &.show {
      transform: translate3d(0, 0, 0);
      & .layer {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .toggle {
    display: block;
    position: absolute;
    top: 50%;
    margin-top: calc(var(--tocButtonSize) / -2);
    left: calc(var(--tocButtonSize) * -1);
    width: var(--tocButtonSize);
    height: var(--tocButtonSize);
    line-height: var(--tocButtonSize);
    text-align: center;
    color: var(--textRegular);
    background-color: var(--background);
    font-size: 16px;
    border-radius: 4px 0 0px 4px;
    box-shadow: -4px 0px 6px rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
  .layer {
    position: absolute;
    top: 0;
    left: -100vw;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
  }
}
</style>
