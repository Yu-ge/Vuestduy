<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片布局 -->
    <el-card>
      <!-- 头部警告 -->
      <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数" type="warning"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="value"
            :options="catelist"
            :props=" cascaderProps "
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isbtndisabled"
            type="primary"
            size="mini"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manytable" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    @click="showEdit(scope.row)"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                  >修改</el-button>
                  <el-button
                    @click="removeEdit(scope.row)"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isbtndisabled"
            type="primary"
            size="mini"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlytable" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="静态属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    @click="showEdit(scope.row)"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                  >修改</el-button>
                  <el-button
                    @click="removeEdit(scope.row)"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  putcateattr_api,
  getcategories_api,
  getcateattr_api,
  postcateattr_api,
  deletecateattr_api
} from '@/api'
export default {
  data() {
    return {
      // 获取分类数组
      catelist: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父类的id数组
      value: [],
      // 默认选中
      activeName: 'many',
      // 动态数据
      manytable: [],
      // 静态数据
      onlytable: [],
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      // 添加规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改对话框
      editDialogVisible: false,
      //  修改数据
      editForm: {
        attr_name: ''
      },
      // 修改规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 选择器改变触发
    handleChange() {
      // console.log(this.value)
      // 判断是否是三级分类
      this.getparamsdata()
    },

    // 获取分级分类数据列表
    async getparentcatelist() {
      const { data: res } = await getcategories_api({ type: 3 })
      // console.log(res, 345)
      if (res.meta.status !== 200) {
        return this.$message.error('失败！')
      }
      this.catelist = res.data
    },
    // tab 点击事件
    handleClick() {
      console.log(this.activeName)
      this.getparamsdata()
    },

    // 根据所选id 所处面板 获取参数-----------
    async getparamsdata() {
      if (this.value.length !== 3) {
        this.value = []
        return
      }
      // 根据所选id 所处面板 获取参数-----------
      const { data: res } = await getcateattr_api({
        id: this.cateid,
        sel: this.activeName
      })
      console.log(res, 123)
      if (this.activeName === 'many') {
        this.manytable = res.data
      } else {
        this.onlytable = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await postcateattr_api({
          id: this.cateid,
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res, 22)

        if (res.meta.status !== 201) {
          return this.$message.error('失败！')
        }
        this.$message.success('成功！')
      })
      this.getparamsdata()
      this.addDialogVisible = false
    },
    // 展示修改页面
    showEdit(row) {
      console.log(row)
      this.editForm = row
      this.editDialogVisible = true
    },
    // 监听修改页面关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮 修改信息
    editParams() {
      // console.log(this.editForm)
      // putcateattr_api
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await putcateattr_api({
          id: this.cateid,
          attrId: this.editForm.attr_id,
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res, 22)

        if (res.meta.status !== 200) {
          return this.$message.error('失败！')
        }
        this.$message.success('成功！')
        this.getparamsdata()
        this.editDialogVisible = false
      })
    },
    // 点击按钮 删除参数
    async removeEdit(row) {
      // deletecateattr_api
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
      const { data: res } = await deletecateattr_api({
        id: this.cateid,
        attrId: row.attr_id
      })
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getparamsdata()
    }
  },
  created() {
    this.getparentcatelist()
  },
  computed: {
    // 按钮禁用
    isbtndisabled() {
      if (this.value.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的id
    cateid() {
      if (this.value.length === 3) {
        return this.value[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
