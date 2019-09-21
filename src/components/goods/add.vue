<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告 -->
      <el-alert show-icon :closable="false" title="添加商品信息" center type="info"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex -0" finish-status="success" center align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏切换 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          style="height: 1400px;"
          @tab-click="handleClick"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item 的 -->
            <el-form-item :label="item.attr_name" v-for="item in manylist" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 复选框组 -->
                <el-checkbox :label="cb" border v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlylist" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片 -->
            <!-- action 图片上传路径 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="handerObj"
              :on-success="handerSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="预览" :visible.sync="previewVisble" width="50%">
      <img :src="previewPath" alt class="previewPath">
    </el-dialog>
  </div>
</template>
<script>
// import _ from 'lodash'
import { getcategories_api, getcateattr_api, postgoods_api } from '@/api'
export default {
  data() {
    return {
      activeIndex: '0',
      // 基本信息表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: 0,
        // 图片数组
        pics: [],
        // 商品详情
        goods_introduce: '',
        attrs:[]
      },
      //   添加校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 分类级联选择器
      catelist: [],
      //   选择器校验规则
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数 数据
      manylist: [],
      // 静态属性数据
      onlylist: [],
      // 上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传请求头
      handerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisble: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async handleClick(tab, event) {
      console.log(this.activeIndex)

      //   console.log(tab, event)
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await getcateattr_api({
          id: this.cateid,
          sel: 'many'
        })
        // console.log(res);

        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manylist = res.data
        // console.log(res)
      } else if (this.activeIndex === '2') {
        // 商品属性面板
        const { data: res } = await getcateattr_api({
          id: this.cateid,
          sel: 'only'
        })
        this.onlylist = res.data
        console.log(this.onlylist)
      } else if (this.activeIndex === '3') {
        // 商品图片面板
      }
    },
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await getcategories_api('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }

      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择器改变触发
    handleChange() {
      // 限制第三级
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 限制跳转
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    // 处理图片预览
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisble = true
    },
    // 处理移除图片
    handleRemove(file) {
      const filepath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filepath
      })
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    // 监听图片上传成功的事件
    handerSuccess(res) {
      // 1，拼接得到一个图片信息对象
      const picinfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picinfo)
      console.log(this.addForm.pics)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加
        // goods_cat
        // 处理分类id
        const form = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manylist.forEach(item=>{
          const newinfo = {
            attr_id:item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newinfo)

        })
        // 处理静态属性
        this.onlylist.forEach(item=>{
          const newinfo = {
            attr_id:item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newinfo)

        })

        const { data: res } = await postgoods_api({
          goods_name: this.addForm.goods_name,
          goods_cat: form,
          goods_price: this.addForm.goods_price,
          goods_number: this.addForm.goods_number,
          goods_weight: this.addForm.goods_weight,
          goods_introduce: this.addForm.goods_introduce,
          pics: this.addForm.pics,
          attrs: this.addForm.attrs
        })
        console.log(res);
        
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 当前选中的id
    cateid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px !important;
}
.previewPath {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
