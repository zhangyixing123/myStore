<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>银行设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">新增银行</el-button>
        </el-col>
      </el-row>

      <el-table :data="bankList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="银行名称" prop="name"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showBankFrom(scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteBanner(scope.row)"/>
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


    <el-dialog title="新增银行" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="银行名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createBank">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="更新银行" :visible.sync="dialogUploadFormVisible">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="100px">
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="uploadForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateBank()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Bank",
  data() {
    return {
      bankList: [],
      count: 0,
      query: {
        page: 1,
        page_size: 10,
      },
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      form: {
        name: '',
      },
      uploadForm: {
        name: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入银行名称', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    async getBankList() {
      const {data: resp} = await this.$http.get('/api/bank', {params: this.query})
      this.bankList = resp.results
      this.count = resp.count
    },
    async handleCurrentChange(page) {
      this.query.page = page
      await this.getBankList()
    },
    async changeStatus(row) {
      const {data: resp} = await this.$http.patch(`/api/banners/${row.id}/change-status`,)
    },
    async handleUploadSuccess(res, file) {
      this.form.image = res.url
      this.uploadForm.image = res.url
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
    async createBank() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          const {data: resp} = await this.$http.post('/api/bank', this.form)
          this.dialogFormVisible = false
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          await this.getBankList()
        } else {
          return false
        }
      })
    },
    async deleteBanner(row) {
      await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: resp} = await this.$http.delete(`/api/bank/${row.id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getBankList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getBankDetail(row) {
      const {data: resp} = await this.$http.get(`/api/bank/${row.id}`)
      this.uploadForm = resp
      this.dialogUploadFormVisible = true
    },
    async showBankFrom(row) {
      this.uploadForm.id = row.id
      await this.getBankDetail(row)
    },
    async updateBank() {
      await this.$refs.uploadForm.validate(async valid => {
        if (valid) {
          const {data: resp} = await this.$http.patch(`/api/bank/${this.uploadForm.id}`, this.uploadForm)
          this.dialogUploadFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          await this.getBankList()
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.getBankList()
  }
}
</script>

<style scoped>

</style>