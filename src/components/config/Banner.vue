<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">新增轮播图</el-button>
        </el-col>
      </el-row>

      <el-table :data="bannerList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="作品名称" prop="name"></el-table-column>
        <el-table-column label="作品图片" prop="username">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" style="width: 80px; height: 80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="index"></el-table-column>
        <el-table-column label="状态" prop="username">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
                       @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150"></el-table-column>
        <el-table-column label="展示时间段" width="300">
          <template slot-scope="scope">
            {{ scope.row.start_time }} - {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showBannerForm(scope.row)"/>
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


    <el-dialog title="新增轮播图" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="作品" prop="product_id">
          <el-autocomplete
              :fetch-suggestions="querySearchAsync"
              v-model="query.q"
              @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片" prop="image">
          <el-upload
              class="avatar-uploader"
              action="http:///localhost:8000/upload/"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
          >
            <img v-if="form.image" :src="form.image" class="avatar" width="200" height="200" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="展示时间段" prop="index">
          <el-date-picker
              v-model="form.start_time"
              type="daterange"
              value-format="timestamp"
              placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input-number v-model="form.index"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createBanner">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="更新轮播图" :visible.sync="dialogUploadFormVisible">
      <el-form :model="uploadForm" :rules="rules" ref="uploadForm" label-width="100px">
        <el-form-item label="作品" prop="product_id">
          <el-autocomplete
              :fetch-suggestions="querySearchAsync"
              v-model="query.q"
              @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="uploadForm.name"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片" prop="image">
          <el-upload
              class="avatar-uploader"
              action="http:///localhost:8000/upload/"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
          >
            <img v-if="uploadForm.image" :src="uploadForm.image" class="avatar" width="200" height="200" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="展示时间段" prop="index">
          <el-date-picker
              v-model="uploadForm.show_range"
              type="daterange"
              value-format="timestamp"
              placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="index">
          <el-input-number v-model="uploadForm.index"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="uploadForm.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateBanner()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Banner",
  data() {
    return {
      bannerList: [],
      count: 0,
      query: {
        page: 1,
        page_size: 10,
      },
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      form: {
        name: '',
        image: '',
        index: '',
        status: false,
        product_id: 0,
      },
      uploadForm: {
        name: '',
        image: '',
        index: '',
        status: false,
        product_id: 0,
      },
      rules: {
        name: [
          {required: true, message: '请输入作品名称', trigger: 'blur'}
        ],
        image: [
          {required: true, message: '请上传作品图片', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    async getBannerList() {
      const {data: resp} = await this.$http.get('/api/banners', {params: this.query})
      this.bannerList = resp.results
      this.count = resp.count
    },
    async handleCurrentChange(page) {
      this.query.page = page
      await this.getBannerList()
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
    async createBanner() {
      let start_time = this.form.start_time
      this.form.start_time = start_time[0] / 1000
      this.form.end_time = start_time[1] / 1000
      this.form.del_time = this.form.status ? 0 : 1
      await this.$refs.form.validate(async valid => {
        if (valid) {
          const {data: resp} = await this.$http.post('/api/banners', this.form)
          this.dialogFormVisible = false
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          await this.getBannerList()
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
        const {data: resp} = await this.$http.delete(`/api/banners/${row.id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getBannerList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getBannerDetail(row) {
      const {data: resp} = await this.$http.get(`/api/banners/${row.id}`)
      this.uploadForm = resp
      this.uploadForm.show_range = [resp.start_time * 1000, resp.end_time * 1000]
      this.dialogUploadFormVisible = true
    },
    async showBannerForm(row) {
      this.uploadForm.id = row.id
      await this.getBannerDetail(row)
    },
    async updateBanner() {
      if (!this.uploadForm.product_id) {
        return this.$message({
          message: '请选择作品',
          type: 'error'
        })
      }
      let show_range = this.uploadForm.show_range
      this.uploadForm.start_time = show_range[0] / 1000
      this.uploadForm.end_time = show_range[1] / 1000
      this.uploadForm.del_time = this.uploadForm.status ? 0 : 1
      await this.$refs.uploadForm.validate(async valid => {
        if (valid) {
          const {data: resp} = await this.$http.patch(`/api/banners/${this.uploadForm.id}`, this.uploadForm)
          this.dialogUploadFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          await this.getBannerList()
        } else {
          return false
        }
      })
    }
  },
  created() {
    this.getBannerList()
  }
}
</script>

<style scoped>

</style>