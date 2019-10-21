<template>
  <div class="cont">
    <i @click="fullScring" class="full iconfont icon-suoxiao"></i>
    <div class="popIfr pop" :style="heightIfra">
      <embed id="Box" :style="heightIfra" :src="url" frameborder="0"/>
      <!-- <iframe id="Box" :style="heightIfra" :src="url" frameborder="0"></iframe> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "fullScreen",
  data() {
    return {
      url: this.$route.query.url,
      heightIfra: {
        width: "",
        height: "",
        top: "",
        left: "",
      }
    };
  },
  mounted() {
    this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {});
    let ww = $(window).width() || $(document).width();
    let wh = $(window).height() || $(document).height();
    let dh = ww / 1.33333333;
    let vm = this;
    var iframe = document.getElementById("Box");
    if (iframe.attachEvent) {
      iframe.attachEvent("onload", function() {
        //iframe加载完成后你需要进行的操作
        vm.heightIfra.width = wh + "px";
        vm.heightIfra.height = ww + "px";
        vm.heightIfra.top = (wh - ww) / 2 + "px";
        vm.heightIfra.left = 0 - (wh - ww) / 2 + "px";
        wh = document.body.clientHeight;
        ww = document.body.clientWidth;
        console.log(wh);
      });
    } else {
      iframe.onload = function() {
        //iframe加载完成后你需要进行的操作
        vm.heightIfra.width = wh + "px";
        vm.heightIfra.height = ww + "px";
        vm.heightIfra.top = (wh - ww) / 2 + "px";
        vm.heightIfra.left = 0 - (wh - ww) / 2 + "px";
        wh = document.body.clientHeight;
        ww = document.body.clientWidth;
        console.log(wh);
      };
    }
  },
  methods: {
    fullScring() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.cont{
  width: 100%;
  position: relative;
}
.full {
  position: absolute;
  top: 30px;
  right: 20px;
  z-index: 9;
  font-size: 26px;
  color: #000;
  z-index: 99999999;
}
.popIfr {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  // background: rgba(0, 0, 0, .9);
  text-align: center;
  // .icon-suoxiao{
  //   color: #ccc !important;
  // }
}
.pop {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  transform-origin: 50% 50%;
  transition: all 0.2s;
}
</style>