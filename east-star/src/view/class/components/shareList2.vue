<template>
  <div class='system-shareList'>
    <div class='system-communion_box van-hairline--bottom' v-for='item in data'>

      <div class='communion_box_left'>
        <div>
          <img src='../../../assets/images/default.png'>
        </div>
      </div>

      <div class='communion_box_right'>
        <div class='first'>张老师</div>
        <div class='second'>恋上蒙蒙烟雨，恋上淡淡茶香，恋上那些隐忍于记忆深处的婉转情意恋上蒙蒙烟雨，恋上淡淡茶香，恋上那些隐忍于记忆深处的婉转情意</div>
        <div class='third'>

          <div @click='previewBtn(imgSrc)' v-for='imgSrc in item.img'>
            <img :src='imgSrc'>
          </div>
        </div>

        <div class='fourth'>
          <div class='fourth_time'>时间</div>
          <div class='fourth_message'>回复</div>
        </div>

        <div class='fifth'>
          <moreCom></moreCom>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import moreCom from "./moreCom";

export default {
  name: "shareList",
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },

  components: {
    moreCom
  },
  methods: {
    messageBtn(item) {
      this.$emit("message", item);
    },
    praiseBtn(item) {
      this.$emit("praise", item);
    },
    previewBtn() {
      this.$store.commit("changePre");
    }
  }
};
</script> 
<style scoped lang='less'>
.system-communion_box {
  display: flex;
  // border-bottom: 1px solid #e1e4e9;
  padding: 1.25rem 0;
  .communion_box_left {
    & > div {
      height: 2.5rem;
      width: 2.5rem;
      overflow: hidden;
      border-radius: 50%;
    }
    img {
      height: 2.5rem;
      width: 2.5rem;
    }
  }

  .communion_box_right {
    flex: 1;
    margin-left: 0.3125rem;

    .first {
      margin-bottom: 0.625rem;
      font-size: 1rem;
      color: #0081ff;
    }
    .second {
      margin-bottom: 0.625rem;
      font-size: 1rem;
      line-height: 1.375rem /* 22/16 */;
      color: #31445a;
    }
    .third {
      overflow: hidden;
      margin-bottom: 0.625rem;
      & > div {
        height: 5.625rem;
        width: 5.625rem;
        float: left;
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(252, 250, 250);
        img {
          // height: 5.625rem;
          width: 100%;
        }
      }
    }

    .fourth {
      height: 2.8125rem;
      line-height: 2.8125rem;
      overflow: hidden;
      color: #c1c1c1;
      .fourth_time {
        float: left;
        font-size: 0.75rem;
      }
      .fourth_praise {
        float: right;
        font-size: 0.75rem;
        margin-right: 1.9875rem;
        img {
          height: 1.125rem;
          width: 1.125rem;
          margin-top: 0.78125rem;
        }
        & > div {
          float: left;
          margin-right: 0.3125rem;
        }
      }
      .fourth_message {
        float: right;
        font-size: 0.75rem;
        color: #0081FF;

        img {
          width: 1.125rem;
          height: 1.03125rem;
          margin-top: 0.9375rem;
        }
        & > div {
          float: left;
          margin-right: 0.3125rem;
        }
      }
    }
  }
}
</style>