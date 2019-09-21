<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col>
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="init()">
            <el-button slot="append" icon="el-icon-search" @click="init()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === 1" type="success">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">{{scope.row.is_send}}</template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showkuaidi"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="200px"
      >
        <el-form-item label="省市区/县">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props=" cascaderProps "
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息弹出框 -->
    <el-dialog title="物流信息" :visible.sync="kuaidiVisible">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.ftime"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
import { getorders_api, getkuaidi_api } from '@/api'
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {},
      cityData,
      // 市县信息
      value: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      // 物流信息
      kuaidiVisible: false,
      // 物流数据
      activities: []
    }
  },
  methods: {
    // 获取订单数据
    async init() {
      const { data: res } = await getorders_api(this.queryinfo)
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.$message.success('获取成功')
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    showBox() {
      this.addressVisible = true
    },
    // 选择器改变
    handleChange() {},
    // 物流 api  getkuaidi_api
    // 显示物流信息弹出框
    async showkuaidi() {
      const { data: res } = await getkuaidi_api()
      console.log(res)
      this.activities = res.data

      this.kuaidiVisible = true
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.el-input {
  width: 400px;
}
</style>
