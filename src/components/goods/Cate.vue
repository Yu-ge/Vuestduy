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
          <el-button type="primary" @click="showadd">添加分类</el-button>
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
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:lightgreen;"
            ></i>
            <i class="el-icon-error" style="color:red;" v-else></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="level" slot-scope="scope">
          <div>
            <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level ===1" type="success">二级</el-tag>
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </div>
        </template>
        <!-- 操作 -->
        <template slot="opt" >
          <div>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </div>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cateinfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addcateVisible" @close="addclosed">
      <el-form :model="addcateform" :rules="addcateformrules" ref="addcateref">
        <el-form-item label="分类名称" prop="cat_name" :label-width="formLabelWidth">
          <el-input v-model="addcateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="value"
            :options="parentcatelist"
            :props=" cascaderProps "
            expand-trigger="hover"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addcateVisible  = false">取 消</el-button>
        <el-button type="primary" @click="addCa">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getcategories_api, postcategories_api } from '@/api'
export default {
  data() {
    return {
      // 商品分类参数
      cateinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3
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
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 表示当前列定义为模板列
          type: 'template',
          template: 'level'
        },
        {
          label: '操纵',
          // 表示当前列定义为模板列
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制对话框显示
      addcateVisible: false,
      // 添加分类的表单数据
      addcateform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 分类规则对象
      addcateformrules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '120px',
      // 获取父级分类数组
      parentcatelist: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父类的id数组
      value: []
    }
  },
  methods: {
    // 获取商品列表数据
    async init() {
      const { data: res } = await getcategories_api(this.cateinfo)
      // console.log(res, 22)
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.cateinfo.pagesize = newsize
      this.init()
    },
    // 监听页码
    handleCurrentChange(newpage) {
      this.cateinfo.pagenum = newpage
      this.init()
    },
    // 展示
    showadd() {
      // 获取父级分类数据列表
      this.getparentcatelist()
      this.addcateVisible = true
    },
    // 获取分级分类数据列表
    async getparentcatelist() {
      const { data: res } = await getcategories_api({ type: 2 })
      // console.log(res,345);

      this.parentcatelist = res.data
    },
    // 选择项变化触发
    handleChange() {
      console.log(this.value)
      // 如果 value 中的length 大于0 ， 选中父级分类
      if (this.value.length > 0) {
        this.addcateform.cat_pid = this.value[this.value.length - 1]
        // 为当前分类的等级
        this.addcateform.cat_level = this.value.length
        return
      } else {
        this.addcateform.cat_level = 0
        this.addcateform.cat_pid = 0
      }
    },
    // 点击按钮添加
    addCa() {
      this.$refs.addcateref.validate(async valid => {
        if (!valid) return
        const { data: res } = await postcategories_api(this.addcateform)
        if (res.meta.status !== 201) {
          return this.$message.error('失败！')
        }
        this.$message.success('成功！')
        this.addcateVisible = false
      })
      console.log(this.addcateform)
    },
    // 关闭事件
    addclosed() {
      this.$refs.addcateref.resetFields()
      this.value = []
      this.addcateform.cat_level = 0
      this.addcateform.cat_pid = 0
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="less">
.treeTable {
  margin-top: 15px;
}
</style>
