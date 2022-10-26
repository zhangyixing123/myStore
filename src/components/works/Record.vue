<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>藏品管理</el-breadcrumb-item>
      <el-breadcrumb-item>藏品记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query.q" clearable @clear="getWorksList">
            <el-button slot="append" icon="el-icon-search" @click="getWorksList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="">导出数据</el-button>
        </el-col>
      </el-row>

      <el-table :data="workList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="藏品id" prop="username"></el-table-column>
        <el-table-column label="藏品num" prop="username"></el-table-column>
        <el-table-column label="作品名称" prop="username"></el-table-column>
        <el-table-column label="作品图片" prop="email"></el-table-column>
        <el-table-column label="作品价格" prop="mobile"></el-table-column>
        <el-table-column label="藏品类型" prop="username"></el-table-column>
        <el-table-column label="是否上链" prop="role_name"></el-table-column>
        <el-table-column label="是否展示" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="role_name"></el-table-column>
        <el-table-column label="作者" prop="role_name"></el-table-column>
        <el-table-column label="拥有者" prop="role_name"></el-table-column>
        <el-table-column label="藏品等级" prop="role_name"></el-table-column>
        <el-table-column label="获取时间" prop="role_name"></el-table-column>
      </el-table>

      <!--            分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
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
  name: "Record",
  data() {
    return {
      query: {
        page: 1,
        page_size: 10,
        q: '',
      },
      workList: [],
      count: 0,
    }
  },
  methods: {
    async getWorksList() {
      const res = await this.$http.get('works', {params: this.query})
      console.log(res)
    },
    async handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.query.page_size = val
      await this.getWorksList()
    },
    async handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.page = val
      await this.getWorksList()
    },
  }
}
</script>

<style scoped>

</style>