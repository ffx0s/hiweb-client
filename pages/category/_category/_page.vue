<script>
import createList from '@/components/list/create'

export default createList({
  title() {
    return this.$route.params.category + ' - 分类 | hiweb'
  },
  keywords() {
    return this.$route.params.category
  },
  description: '发现生活,改变自己',
  routeOptions(page) {
    return {
      name: 'category-category-page',
      params: { page, category: this.$route.params.category },
    }
  },
})
</script>
