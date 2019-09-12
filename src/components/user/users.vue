<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <template>
        <el-table border stripe :data="userlist" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="">
            
              <!-- 修改 -->
              <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
              <!-- 删除 -->
              <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
              <!-- 分配权限 -->
              <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false" >
                <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
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
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import { userlist_Api } from '@/api'
export default {
  data() {
    return {
      userInfo: {
        query: '',
        pagenum: '1',
        pagesize: '1'
      },
      userlist: [],
      currentPage4: 1,
      total:0,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { data: res } = await userlist_Api(this.userInfo)
      console.log(res, 111)
      this.total = Math.ceil(res.data.total);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.userInfo.pagesize= val
      this.init()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.userInfo.pagenum = val
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
