<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>提现管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
      </el-row>

      <el-table :data="withdrawList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="银行名称" prop="name" width="250">
          <template slot-scope="scope">
            {{ scope.row.bank_name }}-{{ scope.row.bank_addr }}
          </template>
        </el-table-column>
        <el-table-column label="银行账号" prop="bank_num" width="200"/>
        <el-table-column label="金额" prop="name">
          <template slot-scope="scope">
            {{ scope.row.amount / 100 }}元
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="name">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success">已通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="create_time" width="150"/>
        <el-table-column label="打款时间" prop="withdraw_time" width="150"/>
        <el-table-column label="操作" prop="name">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="withDraw(scope.row.id)">去打款</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--            分页区域-->
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="query.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
export default {
  name: "Withdraw",
  data() {
    return {
      withdrawList: [],
      count: 0,
      query: {
        page: 1,
        page_size: 10,
        q: "",
      }
    }
  },
  methods: {
    async getWithdrawList() {
      const {data: resp} = await this.$http.get('/api/withdraw', {params: this.query})
      this.withdrawList = resp.results
      this.count = resp.count
    },
    async handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.page = val
      await this.getWithdrawList()
    },
    async withDraw(id) {
      await this.$confirm('确定打款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: resp} = await this.$http.patch(`/api/withdraw/${id}`, {status: 1})
        this.$message({
          type: 'success',
          message: '打款成功!'
        })
        await this.getWithdrawList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消打款'
        })
      })
    }
  },
  created() {
    this.getWithdrawList()
  }
}
</script>

<style scoped>

</style>