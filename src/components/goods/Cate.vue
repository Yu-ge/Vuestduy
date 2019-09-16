<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
      <template slot="isok" slot-scope="scope">
          <div>
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
              <i class="el-icon-error" style="color:red;" v-else></i>
          </div>
      </template>
      <template slot="level" slot-scope="scope">
          <div>
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
              <i class="el-icon-error" style="color:red;" v-else></i>
          </div>
      </template>
      </tree-table>
      <!-- 分页 -->
    </el-card>
  </div>
</template>
<script>
import { getcategories_api } from '@/api'
export default {
  data() {
    return {
      // 商品分类参数
      cateinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      // 分类列表
      catelist: [],
      total: 0,
      // 为table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_delete',
          // 表示当前列定义为模板列
          type:'template',
          template:'isok'
        },
        {
          label: '级别',
          prop: 'cat_level',
          // 表示当前列定义为模板列
          type:'template',
          template:'level'
        },
      ]
    }
  },
  methods: {
    // 获取商品列表数据
    async init() {
      const { data: res } = await getcategories_api(this.cateinfo)
      console.log(res, 22)
      this.catelist = res.data.result
    }
  },
  created() {
    this.init()
  }
}
</script>
