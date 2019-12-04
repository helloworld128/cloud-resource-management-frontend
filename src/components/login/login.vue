<template>
  <div>
    <div class="outer_label">
      <img class="inner_label login_logo" src="../../assets/logo.png" />
    </div>
    <div class="login_form">
      <el-row :gutter="20">
        <el-col :span="8" :offset="8">
          <div class="grid-content bg-purple">
            <el-input
                      type="text"
                      class="qxs-ic_user qxs-icon"
                      placeholder="邮箱"
                      v-model="email"
                      clearable
                      />
            <el-input
                      type="password"
                      class="qxs-ic_password qxs-icon"
                      placeholder="密码"
                      v-model="password"
                      show-password
                      />
            <span>
              <el-button
                         class="register_btn"
                         @click.native="register"
                         type="info"
                         round>注册
                </el-button>
            </span>
            <span>
              <el-button
                         class="login_btn"
                         @click.native="login"
                         type="info"
                         round>登录
                </el-button>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      wsid: "",
    };
  },
  created() {
    if (sessionStorage.getItem("email") && sessionStorage.getItem("token")) {
      this.$router.push({ path:'/problem'  });
    }
  },
  methods: {
    register() {
      const that = this;
      if (!this.email) {
        this.$message.error("请输入用户名");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return;
      }
      // send messages to backend
      this.axios.post(
        this.baseUrl+'/user/', 
        { email: this.email, password: this.password, username:'fan' },
        {
          headers: { "Content-Type": "application/json"}
        }
      ).then( function(res) {
        that.$message.success("注册成功")
      })
      .catch( function(err) {
        if (err.response.status == 409) {
          that.$message.error("该用户已存在")
        }
      })
    },
    login() {
      const that = this;
      if (!this.email) {
        this.$message.error("请输入用户名");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return;
      }
      // send messages to backend
      this.axios.post(
        this.baseUrl+'/auth/login', 
        { email: this.email, password: this.password },
        {
          headers: { "Content-Type": "application/json"}
        }
      ).then( function(res) {
        sessionStorage.setItem("email", that.email);
        sessionStorage.setItem("token", res.data.Authorization);
        sessionStorage.setItem("problem_title", '');
        sessionStorage.setItem("problem_description", '');
        sessionStorage.setItem("problem_wsid", '');
        sessionStorage.setItem("problem_status", '');
        sessionStorage.setItem("isadmin", res.data.isadmin);
        that.$router.push({ path:'/problem'  });
      })
      .catch( function(err) {
        if (err.response.status == 401) {
          that.$message.error("邮箱或密码错误");
        }
      })
    },
  }
};
</script>
<style>
.login_form {
  padding-top: 5%;
  padding-bottom: 5%;
  padding-left: 10%;
  padding-right: 10%;
}
.qxs-ic_user {
  background: url("../../assets/login/ic_user.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
}
.qxs-ic_password {
  background: url("../../assets/login/ic_password.png") no-repeat;
  background-size: 13px 15px;
  background-position: 3%;
  margin-bottom: 20px;
}
.login_logo {
  height: 100%;
}
.login_btn {
  width: 100%;
  font-size: 16px;
  background: #000000;
  filter: brightness(1.4);

}
.login_btn:hover {
    background: #333333;
}
.register_btn {
  width: 100%;
  font-size: 16px;
  filter: brightness(1.4);
  color: black;
  border: #444444;
  margin-bottom: 2%;
}
.register_btn:hover {
    background: #666666;
    color:black;
}
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .bg-purple {background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 10px 20px;
  }
</style>
