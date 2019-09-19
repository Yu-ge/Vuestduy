<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsinfo.query" clearable @clear="init()">
            <el-button slot="append" icon="el-icon-search" @click="init()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goadd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <template>
        <el-table border stripe :data="goodslist" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="680px"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="90px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品价格" width="90px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="170px">
            <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="140px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeById(scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { getgoods_api, deletegoods_api } from '@/api'
export default {
  data() {
    return {
      // 商品参数
      goodsinfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      // 总条数
      total: 0,
      // 商品列表数据
      goodslist: [],
      //默认选中页
      currentPage4: 1
    }
  },
  methods: {
    // 获取商品数据
    async init() {
      const { data: res } = await getgoods_api(this.goodsinfo)
      console.log(res)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.goodsinfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.goodsinfo.pagenum = val
      this.init()
    },
    // 根据id删除
    async removeById(id) {
      console.log(id);
      
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 确认输出，返回值为 confirm
      // 取消了 返回值为 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      // console.log('已经删除了')
      const { data: res } = await deletegoods_api({ id })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.init()
      console.log(res);
      
    },
    goadd(){
      this.$router.push({path:'/goods/add'})
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
