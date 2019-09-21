<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width:1000px;height:500px"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import { getal_api } from '@/api'
import _ from 'lodash'
export default {
  data() {
    return {
      // 合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  methods: {
    async init() {
      const { data: res } = await getal_api()
      console.log(res, 111)
      //   this.option.xAxis.data =
      var Mychart = echarts.init(document.getElementById('main'))

      // 4. 准备数据和配置项
      const result = _.merge(res.data, this.options)
      Mychart.setOption(result)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
