<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>支付设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">


      <el-table :data="paymentList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="支付名称" prop="name"/>
        <el-table-column label="code" prop="code"/>
        <el-table-column label="是否启用" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Payment",
  data() {
    return {
      paymentList: []
    }
  },
  methods: {
    async getPaymentList() {
      const {data: resp} = await this.$http.get("/api/payment")
      this.paymentList = resp.results
    }
  },
  created() {
    this.getPaymentList()
  }
}
</script>

<style scoped>

</style>