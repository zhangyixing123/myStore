<template>
  <div>
    <!--        面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--        卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query.q" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="exportToExcel">导出数据</el-button>
        </el-col>
      </el-row>
      <!--            用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户id" prop="id"></el-table-column>
        <el-table-column label="昵称" prop="nickname" width="100"></el-table-column>
        <el-table-column label="头像" prop="avatar">
          <template slot-scope="scope">
            <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" style="width: 50px; height: 50px">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="phone" width="100"></el-table-column>
        <el-table-column label="邀请码" prop="uid" width="100"></el-table-column>
        <el-table-column label="BSN地址" prop="bsn_address" width="320"/>
        <el-table-column label="余额" prop="amount"/>
        <el-table-column label="是否认证" prop="authentication">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.authentication" active-color="#13ce66" inactive-color="#ff4949"
                       @change="changeAuthentication(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="create_time" width="150"/>
        <el-table-column label="身份证" prop="id_card_num"/>
        <el-table-column label="邀请人数" prop="invite_count"/>
        <el-table-column label="邀请人邀请码" prop="invite_code" width="150"/>
      </el-table>

      <!--            分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="query.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法的邮箱"))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法的手机号"))
    }
    return {
      query: {
        q: "",
        page_size: 10,
        page: 1
      },
      userList: [],
      total: 0,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          {min: 3, max: 10, message: "用户名长度在3和10之间", trigger: "blur"},
          {required: true, message: "请输入用户名!", trigger: "blur"}
        ],
        password: [
          {min: 6, max: 16, message: "用户名长度在6和16之间", trigger: "blur"},
          {required: true, message: "请输入密码!", trigger: "blur"}
        ],
        email: [
          {required: true, message: "请输入邮箱!", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "请输入手机号!", trigger: "blur"},
          {validator: checkMobile, trigger: "blur"}
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          {required: true, message: "请输入邮箱!", trigger: "blur"},
          {validator: checkEmail, trigger: "blur"}
        ],
        mobile: [
          {required: true, message: "请输入手机号!", trigger: "blur"},
          {validator: checkMobile, trigger: "blur"}
        ]
      },
      addUserVisible: false,
      editUserVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {data: resp} = await this.$http.get("/api/accounts", {params: this.query})
      this.userList = resp.results
      this.total = resp.count
    },
    async handleSizeChange(size) {
      this.query.page_size = size
      await this.getUserList()
    },
    async handleCurrentChange(page) {
      this.query.page = page
      await this.getUserList()
    },
    async changeAuthentication(row) {
      await this.$http.patch(`/api/accounts/${row.id}/change-authentication`)
    },
    async exportToExcel() {
      window.open("/api/accounts/export")
    }
  }
}
</script>

<style scoped>

</style>
