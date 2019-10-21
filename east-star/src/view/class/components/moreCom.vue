<template>
  <div class="system-moreCom">
    <div class="moreCom_up"></div>

    <div class="moreCom_text" :class="{'on':list.length>5}">
      <template v-for="(item,index) in list">
        <div :id="'my'+item.commentId" v-if="!item.parentId" @click.prevent="commit(item,index,id)">
          <span>{{item.userName}}：</span>
          {{item.comment}}
        </div>
        <div :id="'my'+item.commentId" v-else @click.prevent="commit(item,index,id)">
          <span>{{item.userName}}</span>回复
          <span>{{item.touserName}}：</span>
          {{item.comment}}
        </div>
      </template>
    </div>

    <div class="more_text_box" v-if="list.length>5">
      <div @click="moreBtn">查看更多评论</div>
    </div>
  </div>
</template>
<script>
import Ls from "@/config/storage";
export default {
  name: "moreCom",
  props: {
    list: {
      type: Array,
      default: []
    },
    id: {
      type: Number,
    }
  },
  data() {
    return {
      data: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    moreBtn() {
      $(".moreCom_text").removeClass("on");
      $(".more_text_box").addClass("on");
      console.log(1212);
    },
    commit(item, index, id) {
      this.$emit("commit", item, index, id);
      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId","#my"+item.commentId)
    }
  }
};
</script> 
<style scoped lang='less'>
.system-moreCom {
  background: #f0f0f0;
  position: relative;
  border-radius: 0.15625rem;
  padding: 1px 0.625rem;
  .moreCom_up {
    position: absolute;
    top: -0.625rem;
    left: 0.625rem;
    width: 0;
    height: 0;
    border-left: 0.46875rem solid transparent;
    border-right: 0.46875rem solid transparent;
    border-bottom: 0.625rem solid #f0f0f0;
  }

  .moreCom_text {
    font-size: 0.9375rem;
    color: #31445a;
    &.on {
      height: 160px;
      overflow: hidden;
    }
    & > div {
      width: 100%;
      word-break: break-all;
      margin: 15px 0;
    }
    span {
      color: #0081ff;
    }
  }
  .more_text_box {
    height: 2.5625rem;
    line-height: 2.5625rem;
    color: #88c750;
    font-size: 0.75rem;
    text-align: center;
    &.on {
      display: none;
    }
  }
}
</style>