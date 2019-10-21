<template>
  <div class="msg_content">
    <div class="msg_item">
      <div class="msg-head">
        <span class="msg-head-title">教师提问</span>
        <span class="msg-head-date">今天 16 : 20</span>
      </div>
      <p class="msg-cont">提示未激活是什么意思呢？</p>
      <p class="msg-adr">北京</p>
    </div>
    <div class="msg_item">
      <div class="msg-head">
        <span class="msg-head-title">授权提醒</span>
        <span class="msg-head-date">今天 16 : 20</span>
      </div>
      <p class="msg-cont">您已成功激活“<span class="msg-cont-t">XX课程小班-上学期</span>”，感谢您的使用。</p>
      <!-- <p class="msg-adr">北京</p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "msg"
}
</script>

<style lang="less" scoped>
.msg_content{
  width: 100%;
  padding: 0 .9375rem;
  margin-top: 1.375rem;
  box-sizing: border-box;

  .msg_item{
    width: 100%;
    padding: 1.1875rem 0.9375rem;
    margin-bottom: .625rem;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 8px 0px rgba(79,104,128,0.25);
    border-radius:10px;
    box-sizing: border-box;

    .msg-head{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .msg-head-title{
        font-size: 1.125rem;
        color: #5DBC07;
        position: relative;
      }
      .msg-head-title:after{
        content: "";
        position: absolute;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #FF0000;
        top: -.187rem /* 6/16 */;
        right: -.75rem /* 12/16 */;
      }

      .msg-head-date{
        font-size: .75rem /* 12/16 */;
        color: #C1C1C1;
      }
    }

    .msg-cont{
      width: 100%;
      margin: 1.25rem 0 0 0;
      color: #737B85;
      line-height: 1.375rem;

      .msg-cont-t{
        color: #0081FF;
      }
    }

    .msg-adr{
      margin: 1rem 0 0 0;
      font-size: .75rem;
      color: #C1C1C1;
    }
  }
}
</style>


