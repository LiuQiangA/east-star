<template>
  <div class="system-classCode">
    <!-- 班级二维码 -->
    <div class="system-classCode_box">二维码</div>
    <div class="system-classCode_text">小太阳二班</div>

    <div class="system-classCode_list">
      <div>学生加入班级流程：</div>
      <div>1. 保存当前二维码；</div>
      <div>2. 将二维码分享至家长微信；</div>
      <div>3. 家长扫描二维码加入班级；</div>
      <div>4. 在当前班级下的学生信息栏中确认家长的加入班级申请；</div>
      <div>5. 加入成功！</div>
    </div>
    <button @click="goNative" class="btn">点击交互{{ddd || 0}}</button>

    <div>接收到的native通知内容{{native_data}}</div>
  </div>
</template>
<script>
export default {
  name: "classCode",
  data() {
    return {
      native_data: "---",
      ddd: ""
    };
  },
  methods: {
    goNative() {
      console.log("11")
      const vm = this;
      this.$bridge.callhandler(
        "testWebViewBridge",
        { action: "pick me" },
        data => {
          vm.ddd = data;

          // 处理返回数据
        }
      );
      console.log("22")
    }
  },

  mounted() {
    const vm = this;
    this.$bridge.registerhandler("iosToH5", (data, responseCallback) => {
      vm.native_data = data;
    });
  }
};
</script> 
<style scoped lang='less'>
.system-classCode {
  .system-classCode_box {
    height: 12.5rem;
    width: 12.5rem;
    border: 1px solid #ccc;
    margin: 1.375rem auto;
  }
  .system-classCode_text {
    margin-top: 1rem;
    margin-bottom: 2.875rem;
    text-align: center;
    color: #0282ff;
  }
  .system-classCode_list {
    width: 20.3125rem;
    margin: 0 auto;
    line-height: 1.875rem;
    color: #31445a;
  }
}
</style>