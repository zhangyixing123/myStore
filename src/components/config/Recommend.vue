<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>推荐设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">新增推荐</el-button>
        </el-col>
      </el-row>

      <el-table :data="bannerList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="作品名称" prop="name"></el-table-column>
        <el-table-column label="作品图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" style="width: 80px; height: 80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="index"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                       @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
<!--            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">-->
<!--              <el-button type="primary" icon="el-icon-edit" circle size="mini"/>-->
<!--            </el-tooltip>-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteRecommend(scope.row)"/>
            </el-tooltip>
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

    <el-dialog title="新增推荐" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="作品" prop="name">
          <el-autocomplete
              :fetch-suggestions="querySearchAsync"
              v-model="query.q"
              @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input-number v-model="form.index" min="0"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createRecommend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Recommend",
  data() {
    return {
      bannerList: [],
      count: 0,
      query: {
        page: 1,
        page_size: 10,
      },
      form: {},
      rules: {
        image: [
          {required: true, message: "请上传作品图片", trigger: "blur"},
        ],
        index: [
          {required: true, message: "请输入排序", trigger: "blur"},
        ],
      },
      dialogFormVisible: false,
    }
  },
  methods: {
    async getRecommendList() {
      const {data: resp} = await this.$http.get('/api/recommend', {params: this.query})
      this.bannerList = resp.results
      this.count = resp.count
    },
    async handleCurrentChange(page) {
      this.query.page = page
      await this.getRecommendList()
    },
    async changeStatus(row) {
      const {data: resp} = await this.$http.patch(`/api/recommend/${row.id}/change-status`,)
      // this.$message.success(resp.message)
    },
    async deleteRecommend(row) {
      this.$confirm('此操作将永久删除该推荐, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: resp} = await this.$http.delete(`/api/recommend/${row.id}`)
        this.$message.success("删除成功")
        await this.getRecommendList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async querySearchAsync(value, cb) {
      const {data: resp} = await this.$http.get('/api/works', {params: {q: value}})
      const result = resp.results.map(item => {
        return {
          value: item.name,
          id: item.id
        }
      })
      cb(result)
    },
    async handleSelect(item) {
      this.form.product_id = item.id
    },
    async createRecommend() {
      await this.$refs.form.validate(async (valid) => {
        if (valid) {
          const {data: resp} = await this.$http.post('/api/recommend', this.form)
          this.$message.success(resp.message)
          this.dialogFormVisible = false
          await this.getRecommendList()
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.getRecommendList()
  }
}
</script>

<style scoped>

</style>