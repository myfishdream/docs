---
# layout: page
---
<script setup>
import Introduce from '../.vitepress/theme/components/home/introduce.vue'
</script>

<Introduce />

## TimeLine

  <Timelines :items="[
    {
      title: '创建服务',
      time: '2015-09-01',
      type: 'time',
      content: '服务创建成功',
    },
    {
      title: '解决网络问题',
      time: '2015-09-01',
      type: 'red',
      content: '网络问题已解决'
    },
    {
      title: '技术测试',
      time: '2015-09-01',
      type: 'green',
      // dot: '🕣'
    },
    {
      title: '技术测试',
      time: '2015-09-01',
      type: 'blue',
      content: '服务创建成功',
    },
      {
      title: '技术测试',
      time: '2015-09-01',
      type: 'blue',
      content: '服务创建成功',
    },
      {
      title: '技术测试',
      time: '2015-09-01',
      type: 'blue',
      content: '服务创建成功',
    }
  ]" />