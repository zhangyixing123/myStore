<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>藏品管理</el-breadcrumb-item>
      <el-breadcrumb-item>藏品列表</el-breadcrumb-item>
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
          <el-button type="primary" @click="dialogFormVisible=true">新增藏品</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="exportToExcel">导出数据</el-button>
        </el-col>
      </el-row>

      <el-table :data="workList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="作品名称" prop="name"></el-table-column>
        <!--        <el-table-column label="藏品id" prop="username"></el-table-column>-->
        <el-table-column label="作品图片" width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" style="width: 100px; height: 100px"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="作品价格">
          <template slot-scope="scope">
            <span>{{ scope.row.price / 100 }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="是否上链">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.status === 1" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否展示" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.display" active-color="#13ce66" inactive-color="#ff4949"
                       @change="changeDisplay(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="总份数" prop="stock"></el-table-column>
        <el-table-column label="已售份数" prop="sales"></el-table-column>
        <el-table-column label="作者" prop="author" width="100"/>
        <el-table-column label="拥有者" prop="owner" width="100"/>
        <el-table-column label="藏品等级" prop="level"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showUpdateWork(scope.row.id)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增作品" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="作品名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="作品图片" prop="image">
            <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
            >
              <img v-if="form.image" :src="form.image" class="avatar" width="200" height="200" alt="">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="销售份数" prop="stock">
            <el-input-number :min="1" v-model="form.stock"/>
          </el-form-item>
          <el-form-item label="销售价格" prop="price">
            <el-input-number :min="1" v-model="form.price"/>
          </el-form-item>
          <el-form-item label="创作故事" prop="desc">
            <el-input type="textarea" v-model="form.desc"/>
          </el-form-item>
          <el-form-item label="作者手机号码" prop="phone">
            <el-input v-model="form.phone"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createWorks">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog title="修改作品" :visible.sync="dialogUploadFormVisible">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px">
          <el-form-item label="销售份数" prop="stock">
            <el-input-number :min="1" v-model="updateForm.stock"/>
          </el-form-item>
          <el-form-item label="藏品等级" prop="stock">
            <el-input v-model="updateForm.level"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateWorks">确 定</el-button>
      </span>
      </el-dialog>

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
import BASEURL from "../../config";

export default {
  name: "List",
  data() {
    return {
      uploadURL: BASEURL.BASEURL + '/upload/',
      query: {
        page: 1,
        page_size: 10,
        q: '',
        is_air_drop: 0,
      },
      workList: [],
      count: 0,
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      form: {},
      updateForm: {},
      rules: {
        name: [
          {required: true, message: '请输入作品名称', trigger: 'blur'}
        ],
        image: [
          {required: true, message: '请上传作品图片', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '请输入销售份数', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入销售价格', trigger: 'blur'}
        ],
        desc: [
          {required: true, message: '请输入创作故事', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入作者手机号码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async getWorksList() {
      const {data: resp} = await this.$http.get('/api/works', {params: this.query})
      this.count = resp.count
      this.workList = resp.results
      console.log(this.workList)
    },
    async handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.query.page = val
      await this.getWorksList()
    },
    async changeDisplay(row) {
      const {data: resp} = await this.$http.patch(`/api/works/${row.id}/change-display`,)
    },
    async handleUploadSuccess(resp, file) {
      this.form.image = resp.url
    },
    async createWorks() {
      await this.$refs.form.validate(async () => {
        const {data: resp} = await this.$http.post('/api/works', this.form)
        if (!resp.success) {
          return this.$message.error(resp.msg)
        }
        this.dialogFormVisible = false
        this.$message.success('新增作品成功')
        await this.getWorksList()
      })
    },
    async updateWorks() {
      await this.$http.patch("/api/works/" + this.updateForm.id, {
        stock: this.updateForm.stock,
        level: this.updateForm.level,
      })
      this.dialogUploadFormVisible = false
      await this.getWorksList()
    },
    async showUpdateWork(id) {
      this.updateForm = await this.getWorksListDetail(id)
      this.updateForm.id = id
      this.dialogUploadFormVisible = true
    },
    async getWorksListDetail(id) {
      const {data: data} = await this.$http.get("/api/works/" + id)
      return data
    },
    async exportToExcel() {
      window.open(BASEURL.BASEURL + '/api/works/export-works')
    }
  },
  created() {
    this.getWorksList()
  }
}
</script>

<style scoped>

</style>