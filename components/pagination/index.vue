<template>
  <ul :class="[containerClass, position]">
    <li
      v-if="firstLastButton"
      :class="[pageClass, firstPageSelected() ? disabledClass : '']"
    >
      <a
        :class="pageLinkClass"
        :tabindex="firstPageSelected() ? -1 : 0"
        @click="selectFirstPage()"
        @keyup.enter="selectFirstPage()"
        >{{ firstButtonText }}</a
      >
    </li>

    <li v-if="!firstPageSelected()" :class="[prevClass]">
      <nuxt-link
        :to="routeOptions(selected)"
        :class="prevLinkClass"
        :tabindex="firstPageSelected() ? -1 : 0"
        @click="prevPage()"
        @keyup.enter="prevPage()"
        ><slot name="prevContent">{{ prevText }}</slot></nuxt-link
      >
    </li>

    <li
      v-for="(page, index) in pages"
      :key="index"
      :class="[
        pageClass,
        page.selected ? activeClass : '',
        page.disabled ? disabledClass : '',
        page.breakView ? breakViewClass : '',
      ]"
    >
      <span v-if="page.breakView" :class="[pageLinkClass, breakViewLinkClass]"
        ><slot name="breakViewContent">{{ breakViewText }}</slot></span
      >
      <span v-else-if="page.disabled || page.selected" :class="pageLinkClass">{{
        page.content
      }}</span>
      <nuxt-link
        v-else
        :to="routeOptions(page.index + 1)"
        :class="pageLinkClass"
        tabindex="0"
        @click="handlePageSelected(page.index)"
        @keyup.enter="handlePageSelected(page.index)"
        >{{ page.content }}</nuxt-link
      >
    </li>

    <li
      v-if="!lastPageSelected()"
      :class="[nextClass, lastPageSelected() ? disabledClass : '']"
    >
      <nuxt-link
        :to="routeOptions(selected + 2)"
        :class="nextLinkClass"
        :tabindex="lastPageSelected() ? -1 : 0"
        @click="nextPage()"
        @keyup.enter="nextPage()"
        ><slot name="nextContent">{{ nextText }}</slot></nuxt-link
      >
    </li>

    <li
      v-if="firstLastButton"
      :class="[pageClass, lastPageSelected() ? disabledClass : '']"
    >
      <a
        :class="pageLinkClass"
        :tabindex="lastPageSelected() ? -1 : 0"
        @click="selectLastPage()"
        @keyup.enter="selectLastPage()"
        >{{ lastButtonText }}</a
      >
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    pageCount: {
      type: Number,
      required: true,
    },
    initialPage: {
      type: Number,
      default: 0,
    },
    forcePage: {
      type: Number,
      default: undefined,
    },
    clickHandler: {
      type: Function,
      default: () => {},
    },
    pageRange: {
      type: Number,
      default: 3,
    },
    marginPages: {
      type: Number,
      default: 1,
    },
    prevText: {
      type: String,
      default: 'Prev',
    },
    nextText: {
      type: String,
      default: 'Next',
    },
    breakViewText: {
      type: String,
      default: '…',
    },
    containerClass: {
      type: String,
      default: 'pagination',
    },
    pageClass: {
      type: String,
      default: '',
    },
    pageLinkClass: {
      type: String,
      default: '',
    },
    prevClass: {
      type: String,
      default: '',
    },
    prevLinkClass: {
      type: String,
      default: '',
    },
    nextClass: {
      type: String,
      default: '',
    },
    nextLinkClass: {
      type: String,
      default: '',
    },
    breakViewClass: {
      type: String,
      default: '',
    },
    breakViewLinkClass: {
      type: String,
      default: '',
    },
    activeClass: {
      type: String,
      default: 'active',
    },
    disabledClass: {
      type: String,
      default: 'disabled',
    },
    firstLastButton: {
      type: Boolean,
      default: false,
    },
    firstButtonText: {
      type: String,
      default: 'First',
    },
    lastButtonText: {
      type: String,
      default: 'Last',
    },
    hidePrevNext: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: '',
    },
    routeName: {
      type: String,
      default: '',
    },
    routeOptions: {
      type: Function,
      default(page) {
        return {
          name: this.$route.name,
          params: { page },
        }
      },
    },
  },
  data() {
    return {
      selected: this.initialPage,
    }
  },
  computed: {
    pages() {
      const items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          const page = {
            index,
            content: index + 1,
            selected: index === this.selected,
          }
          items[index] = page
        }
      } else {
        const halfPageRange = Math.floor(this.pageRange / 2)
        const setPageItem = (index) => {
          const page = {
            index,
            content: index + 1,
            selected: index === this.selected,
          }
          items[index] = page
        }
        const setBreakView = (index) => {
          const breakView = {
            disabled: true,
            breakView: true,
          }
          items[index] = breakView
        }
        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i)
        }
        // 2nd - loop thru selected range
        let selectedRangeLow = 0
        if (this.selected - halfPageRange > 0) {
          selectedRangeLow = this.selected - halfPageRange
        }
        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1
        if (selectedRangeHigh >= this.pageCount) {
          selectedRangeHigh = this.pageCount - 1
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1
        }
        for (
          let i = selectedRangeLow;
          i <= selectedRangeHigh && i <= this.pageCount - 1;
          i++
        ) {
          setPageItem(i)
        }
        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }
        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }
        // 3rd - loop thru high end of margin pages
        for (
          let i = this.pageCount - 1;
          i >= this.pageCount - this.marginPages;
          i--
        ) {
          setPageItem(i)
        }
      }
      return items
    },
  },
  beforeUpdate() {
    if (this.forcePage === undefined) return
    if (this.forcePage !== this.selected) {
      this.selected = this.forcePage
    }
  },
  methods: {
    handlePageSelected(selected) {
      if (this.selected === selected) return
      this.selected = selected
      this.clickHandler(this.selected + 1)
    },
    prevPage() {
      if (this.selected <= 0) return
      this.selected--
      this.clickHandler(this.selected + 1)
    },
    nextPage() {
      if (this.selected >= this.pageCount - 1) return
      this.selected++
      this.clickHandler(this.selected + 1)
    },
    firstPageSelected() {
      return this.selected === 0
    },
    lastPageSelected() {
      return this.selected === this.pageCount - 1 || this.pageCount === 0
    },
    selectFirstPage() {
      if (this.selected <= 0) return
      this.selected = 0
      this.clickHandler(this.selected + 1)
    },
    selectLastPage() {
      if (this.selected >= this.pageCount - 1) return
      this.selected = this.pageCount - 1
      this.clickHandler(this.selected + 1)
    },
    createLink(index) {
      const options = { name: this.routeName, params: { page: index + 1 } }

      return options
    },
  },
}
</script>

<style lang="postcss">
ul.pagination {
  list-style: none;
  padding: 0;
  font-size: 0;
  &.center {
    text-align: center;
  }
  &.right {
    text-align: right;
  }
  &.left {
    text-align: left;
  }
  & li {
    font-size: 14px;
    margin-right: 5px;
    display: inline-block;
    &.disabled {
      & span {
        background-color: transparent;
        box-shadow: none;
      }
    }
    &:last-child {
      margin-right: 0;
    }
    &.active {
      & span {
        color: white;
        background-color: var(--primary);
        cursor: default;
        &:hover {
          text-decoration: none;
        }
      }
    }
    & a,
    & span {
      display: block;
      padding: 6px 14px;
      line-height: 24px;
      color: var(--textPrimary);
      transition: 0.3s;
      border-radius: 4px;
      background-color: var(--lightBackground);
      outline: none;
      overflow: hidden;
    }
  }
}

@media (hover: hover) {
  .pagination a {
    &:hover {
      color: #fff;
      background-color: var(--primary);
      opacity: 0.7;
    }
  }
}

@media (hover: none) {
  .pagination a {
    &:active {
      color: #fff;
      background-color: var(--primary);
    }
  }
}
</style>
