<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Ls from "@/config/storage";
export default {
  name: "App",
  created() {
    this.$fetch
      .getCourseUserInfo()
      .then(res => {
        console.log(res);
        if(res.data.role.roleName =='总部教研员' || res.data.role.roleName =='地区教研员'){
          Ls.setItem('showHF',true)
        } else {
          Ls.setItem('showHF',false)
        }
      })
      .catch(err => {});
  }
};
</script>
<style lang="less">
// vant border
.van-hairline--bottom{
  border-color: #E1E4E9 !important;
}
.van-hairline--top{
  border-color: #E1E4E9 !important;
}
// loading

.mint-spinner-fading-circle {
  opacity: 0 !important;
}
.mint-indicator-spin {
  background: url(./assets/images/loading.gif) no-repeat center !important;
  background-size: 20px 20px !important;
}
.mint-indicator-wrapper {
  width: 100px !important;
  height: 65px !important;
  background: #fff !important;
  background-size: 20px 20px !important;
  box-shadow: 0px 3px 12px 0px rgba(199, 199, 199, 0.5) !important;
  border-radius: 10px !important;
}
// mint messageBox
.mint-msgbox-btns {
  height: auto !important;
  padding: 20px 0 20px !important;
}
.mint-msgbox-content {
  padding: 0 20px !important;
  margin: 30px 0 !important;;
  border: 0 !important;
}
.mint-msgbox-btns {
  justify-content: space-around !important;
  .mint-msgbox-cancel {
    border: 0 !important;
    max-width: 100px !important;
    height: 35px !important;
    background: #b1b1b1 !important;
    border-radius: 10px !important;
    color: #fff !important;
  }
  .mint-msgbox-confirm {
    max-width: 100px !important;
    height: 35px !important;
    background: linear-gradient(
      90deg,
      rgba(13, 178, 255, 1),
      rgba(0, 129, 255, 1)
    ) !important;
    border-radius: 10px !important;
    color: #fff !important;
  }
}
.netError {
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .err-ms {
    width: 100%;
    font-size: 15px;
    font-family: NotoSansHans-Regular;
    color: rgba(102, 102, 102, 1);
    text-align: center;
    margin-top: 28px;
  }
  .refresh {
    width: 100px;
    line-height: 35px;
    text-align: center;
    border: 0;
    background: #0081ff;
    color: #fff;
    font-size: 15px;
    border-radius: 5px;
    margin-top: 54px;
  }
}
.commit-shadow{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  background: none;
  z-index: 1;
  top: 0;
  left: 0;
}
</style>
<style scoped lang='less'>
#app {
  height: 100%;
  // overflow: hidden;
}
</style>
