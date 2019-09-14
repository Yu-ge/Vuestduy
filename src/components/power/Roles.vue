<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddrole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :class="['bdbottom',i1===0?'bdtop' : '', 'vcenter']"
              :key="item1.id"
              v-for="(item1,i1) in props.row.children"
            >
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'' : 'bdtop', 'vcenter']"
                  :key="item2.id"
                  v-for="(item2,i2 ) in item1.children"
                >
                  <!-- 二级 -->
                  <el-col :span="7">
                    <el-tag type="success ">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="14">
                    <el-tag
                      type="warning"
                      :key="item3.id"
                      v-for="(item3 ) in item2.children"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showeditrole(scope.row.id)"
            >编辑</el-button>
            <el-button
              @click="removerole(scope.row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addVisible">
      <el-form :model="addroledata" :rules="addrolerules" ref="addroleref">
        <el-form-item label="角色名" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="addroledata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="addroledata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editVisible">
      <el-form :model="editroledata" :rules="editrolerules" ref="editroleref">
        <el-form-item label="角色名" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="editroledata.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="editroledata.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editrole(editroledata)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  deleterole_api,
  getrolelist_api,
  addrole_api,
  showrole_api,
  editrole_api
} from '@/api'
export default {
  data() {
    return {
      rolelist: [],
      addroledata: {
        roleName: '',
        roleDesc: ''
      },
      addVisible: false,
      formLabelWidth: '120px',
      addrolerules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      editVisible: false,
      editroledata: {
        roleName: '',
        roleDesc: ''
      },
      editrolerules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getrolelist()
  },
  methods: {
    async getrolelist() {
      const { data: res } = await getrolelist_api()
      // console.log(res);
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    showaddrole() {
      this.addVisible = true
    },
    // 添加角色
    addrole() {
      this.$refs.addroleref.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await addrole_api(this.addroledata)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addVisible = false
        // 重新获取用户列表数据
        this.getrolelist()
      })
    },
    // 展示编辑角色
    async showeditrole(id) {
      //   console.log(id)
      const { data: res } = await showrole_api(id)
      this.editroledata = res.data
      this.editVisible = true
    },
    // 编辑角色
    editrole(a) {
      // console.log(a)
      this.$refs.editroleref.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await editrole_api({
          id: a.roleId,
          roleName: a.roleName,
          roleDesc: a.roleDesc
        })
        // console.log(res.data);
        // console.log(res);

        if (res.meta.status !== 200) {
          this.$message.error('编辑用户失败！')
        }
        this.$message.success('编辑用户成功！')
        // 隐藏添加用户的对话框
        this.editVisible = false
        // 重新获取用户列表数据
        this.getrolelist()
      })
    },
    // 删除角色
    async removerole(id) {
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
      console.log('已经删除了')
      
      const { data: res } = await deleterole_api({id})
      console.log(res);
      
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      // 隐藏添加用户的对话框
      this.editVisible = false
      // 重新获取用户列表数据
      this.getrolelist()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
