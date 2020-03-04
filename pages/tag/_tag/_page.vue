<script>
import createList from '@/components/list/create'

export default createList({
  title() {
    return this.$route.params.tag + ' - 标签 | hiweb'
  },
  keywords() {
    return this.$route.params.tag
  },
  description: '发现生活,改变自己',
  routeOptions(page) {
    return {
      name: 'tag-tag-page',
      params: { page, tag: this.$route.params.tag }
    }
  }
})
</script>
