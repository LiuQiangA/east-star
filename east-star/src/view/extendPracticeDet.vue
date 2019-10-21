<template>
  <div style="margin-top:100px">
    <iframe
      src="http://k12sandbox.youdao.com/activity/cooperation/#/question/SequenceDragQuestion"
      frameborder="0"
    ></iframe>
    <!-- <embed class="full" src="http://k12sandbox.youdao.com/activity/cooperation/#/question/SequenceDragQuestion" _src="http://k12sandbox.youdao.com/activity/cooperation/#/question/SequenceDragQuestion" type=""> -->
  </div>
</template>

<script>
export default {
  name: "det",
  data() {
    return {
      url: ""
    };
  },
  created() {
    this.url = this.$route.query.url;
  },
  created() {
    if (window.addEventListener) {
      console.log("1")
      window.addEventListener("GO_BACK", this.myquitGame, false);
    } else {
      console.log("2")
      window.attachEvent("GO_BACK", this.myquitGame);
    }
  },
  methods: {
    myquitGame() {
      console.log("呵呵呵");
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.full {
  width: 100%;
  height: 100%;
}
.top {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #31445a;
  box-shadow: 0px 3px 12px 0px rgba(199, 199, 199, 0.5);
  font-size: 20px;
  background: #fff;
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  .share {
    font-size: 14px;
  }
  .icon-fanhui {
    font-size: 20px;
    color: #31445a;
  }
  .icon-gengduo {
    font-size: 26px;
    color: #31445a;
    opacity: 0;
  }
}
</style>