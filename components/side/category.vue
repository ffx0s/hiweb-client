<template>
  <Box :contentClass="$style.category" title="分类">
    <nuxt-link
      v-for="(category, i) in hots"
      :key="category.id"
      :class="$style.item"
      :to="`/category/${category.name}/`"
      active-class=""
    >
      <div
        :class="[$style.image, 'lazy-img-box']"
        v-lazy:background-image="images[i]"
      />
      <strong :class="$style.text">
        {{ category.name }} ({{ category.postsNumber }})
      </strong>
    </nuxt-link>
  </Box>
</template>

<script>
import Box from './box'
import { upyImage } from '@/utils/filters'

export default {
  components: {
    Box
  },
  apollo: {
    categories: {
      query: require('@/graphql/categories')
    }
  },
  data() {
    return {
      categories: [],
      images: [
        upyImage('/user/c1.jpg'),
        upyImage('/user/c2.jpg'),
        upyImage('/user/c3.jpg')
      ]
    }
  },
  computed: {
    hots() {
      return this.categories.filter((data, i) => i < 3)
    }
  }
}
</script>

<style lang="postcss" module>
.category {
  display: flex;
  flex-direction: column;
}
.item {
  position: relative;
  margin-top: 3px;
  margin-bottom: 10px;
  height: 80px;
  font-size: 16px;
  border-radius: 4px;
  color: #fff;
  overflow: hidden;
  &:hover {
    color: #fff;
    & .image {
      filter: blur(3px);
      transform: scale(1.1);
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
.text {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition: 0.4s;
}
@media (max-width: 1000px) {
  .category {
    flex-direction: row;
    justify-content: space-between;
  }
  .item {
    width: 32%;
  }
}
</style>
