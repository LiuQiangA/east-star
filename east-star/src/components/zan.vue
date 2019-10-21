<template>
  <div>
    <div class="top">
      <i class="iconfont icon-fanhui" @click="back"></i>
      点赞列表
      <span class="share">
        <i class="iconfont icon-gengduo"></i>
      </span>
    </div>
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "zan",
  methods: {
    back() {
      this.$router.go("-1");
    }
  },
};
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #31445a;
  box-shadow: 0px 3px 12px 0px rgba(199, 199, 199, 0.5);
  font-size: 20px;
  .share {
    font-size: 14px;
    opacity: 0;
    position: relative;
    z-index: -1;
  }
  .icon-fanhui {
    font-size: 20px;
    color: #31445a;
  }
  .icon-gengduo {
    font-size: 26px;
    color: #31445a;
  }
}
</style>


