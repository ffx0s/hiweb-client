<script>
import createList from '@/components/list/create'

export default createList({
  title: '<hiweb />',
  keywords: '前端,web,javascript,css3,html,后端,node,生活',
  description: '发现生活,改变自己',
  category: 'Web',
  routeOptions(page) {
    return {
      name: 'list-page',
      params: { page },
    }
  },
})
</script>
