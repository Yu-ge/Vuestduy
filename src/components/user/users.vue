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
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="init()">
            <el-button slot="append" icon="el-icon-search" @click="init()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialog">添加用户</el-button>
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
              <el-switch @change="userchanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                @click="showEditDialog(scope.row.id)"
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <!-- 删除 -->
              <el-button
                @click="removeuser(scope.row.id)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
              <!-- 分配权限 -->
              <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
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
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="addVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>-->

    <el-dialog title="添加用户" :visible.sync="addVisible" @close="addVisibleclose">
      <el-form :model="addform" :rules="addformrules" ref="addformref">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible">
      <el-form :model="editoform" :rules="editformrules" ref="editformref">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="editoform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="editoform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="editoform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser(editoform) ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  edituser_api,
  userlist_Api,
  userstate_api,
  adduser_api,
  showuser_api,
  deleteuser_api
} from '@/api'
// import { userstate_api } from '@/api'
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      userInfo: {
        query: '',
        pagenum: '1',
        pagesize: 4
      },
      userlist: [],
      currentPage4: 1,
      total: 0,
      addVisible: false,
      formLabelWidth: '120px',
      // 添加用户表单数据
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editVisible: false,
      editoform: {
        username: '',
        email: '',
        mobile: ''
      },
      addformrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editformrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { data: res } = await userlist_Api(this.userInfo)
      // console.log(res, 111)
      this.total = Math.ceil(res.data.total)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.userInfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.userInfo.pagenum = val
      this.init()
    },
    async userchanged(userInfo) {
      console.log(userInfo)

      const { data: res } = await userstate_api({
        uId: userInfo.id,
        type: userInfo.mg_state
      })
      console.log(res, 777)
      if (res.meta.status !== 200) {
        return this.$message.error('状态更改失败')
      } else {
        return this.$message.success('状态更改成功')
      }
    },
    adddialog() {
      this.addVisible = true
    },
    // 对话关闭
    addVisibleclose() {
      // console.log(this)

      this.$refs.addformref.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await adduser_api(this.addform)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addVisible = false
        // 重新获取用户列表数据
        this.init()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await showuser_api(id)
      this.editoform = res.data
      this.editVisible = true
    },
    // 修改用户
    edituser(scope) {
      // console.log(scope);

      this.$refs.editformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await edituser_api({
          id: scope.id,
          email: scope.email,
          mobile: scope.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('编辑用户失败！')
        }
        this.$message.success('编辑用户成功！')
        // 隐藏添加用户的对话框
        this.editVisible = false
        // 重新获取用户列表数据
        this.init()
      })
    },
    // 根据id删除用户
    async removeuser(id) {
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
      const {data:res} = await deleteuser_api({id})
      if (res.meta.status !== 200) {
          this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        // 重新获取用户列表数据
        this.init()
      
    }
  }
}
</script>

<style lang="less" scoped>
</style>
