<template>
  <div class="helpD-content">
    <div v-if="empty">
      <p class="helpD-head" v-if="helpCenter.content">1.{{helpCenter.title}}</p>
      <div class="helpD-cont" v-html="helpCenter.content"></div>
    </div>
    <div v-else class="no-data">
      <!-- <img src="../../assets/images/noData.png" /> -->
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
// import axios from "axios"
// import apifuture from "@/api/env"
export default {
  name: "helpD",
  data() {
    return {
      helpCenter: {},
      empty: true
    };
  },
  created() {
    this.getHelpCenterInfo();
    const vm = this;
    this.$bridge.registerhandler("goBack", (data, responseCallback) => {
      console.log("开始返回")
      console.log(vm)
      vm.$router.back(-1);
      console.log("已返回")
    });
  },
  methods: {
    getHelpCenterInfo() {
      this.$fetch
        .getHelpCenterInfo({
          questionId: this.$route.query.id
        })
        .then(res => {
          this.helpCenter = res.data.helpCenter;
          if(!this.helpCenter.content){
            this.empty = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.helpD-content {
  width: 100%;
  padding: 0.9375rem;
  box-sizing: border-box;

  .helpD-head {
    width: 100%;
    font-size: 1.125rem;
    line-height: 1.625rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 129, 255, 1);
    color: #0081ff;
  }

  .helpD-cont {
    width: 100%;
    word-break: break-all;
    line-height: 1.375rem;
    font-size: 0.875rem;
    margin-bottom: 0.9375rem;
  }
}
</style>

<style lang="less">
.helpD-cont {
  width: 100%;
  word-break: break-all;
  line-height: 1.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.9375rem;

  p {
    width: 100%;
    margin: 1.25rem 0 0.9375rem 0;
    margin-left: 0 !important;
    color: #737b85;
    font-family: PingFangSC-Regular;
    font-size: 0.875rem;

    span {
      font-size: 0.875rem !important;
      font-family: PingFangSC-Regular;
      color: #737b85 !important;
    }
  }
}
</style>


