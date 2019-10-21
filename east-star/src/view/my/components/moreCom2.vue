<template>
  <div class='system-moreCom'>
    <div class='moreCom_up'></div>

    <div class='moreCom_text'>
      <template v-for='item in data'>
        <div>
          <span>张老师：</span>
          dadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadadada
        </div>
        <div><span>我</span>回复<span>张老师：</span>dadadadada</div>
      </template>
    </div>

    <div class='more_text_box'>
      <div @click='moreBtn'>查看更多评论</div>
    </div>

  </div>
</template>
<script>
export default {
  name: "moreCom",
  data() {
    return {
      data: [1,2,3,4,5]
    };
  },
  methods: {
    moreBtn() {
      console.log(1212);
      
    },
  }
};
</script> 
<style scoped lang='less'>
.system-moreCom {
  background: #f0f0f0;
  position: relative;
  border-radius: .15625rem;
  padding: .625rem;
  .moreCom_up {
    position: absolute;
    top: -.625rem;
    left: .625rem;
    width: 0;
    height: 0;
    border-left: .46875rem solid transparent;
    border-right: .46875rem solid transparent;
    border-bottom: .625rem solid #f0f0f0;
  }

  .moreCom_text{
    font-size: .9375rem;
    color: #31445A;
    &>div{
      margin:15px 0;
      word-break: break-all;
    }
    span{
      color: #0081FF;
    }
    .moreCom_text_ans{
      float: right;
      color: #0081FF;
      font-size: .75rem /* 12/16 */
    }
  }
  .more_text_box{
    height: 2.5625rem;
    line-height: 2.5625rem;
    color: #88C750;
    font-size: .75rem;
    text-align: center;
  }
  
}
</style>