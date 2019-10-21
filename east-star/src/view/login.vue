<template>
  <div class="login">
    <p>还没有登录哦，请登录后查看~</p>
    <button class="login-btn" @click="toLogin">去登录</button>
  </div>
</template>

<script>
export default {
  name: "login",
  props: {
    refresh:{
      type: String,
      default: ""
    }
  },
  methods: {
    toLogin() {
      this.$bridge.callhandler("toLogin", { isLogin: false, refresh: this.refresh }, data => {
        // 处理返回数据
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .login-btn {
    padding: 14px 100px;
    border: 0;
    background: #0081ff;
    color: #fff;
    font-size: 16px;
    border-radius: 5px;
    margin-top: 15px;
  }
  p {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(54, 64, 74, 1);
    line-height: 14px;
  }
}
</style>

