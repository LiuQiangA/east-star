<template>
  <!-- <div class="bg"> -->
  <div class="commit">
    <!-- <textarea autofocus id="texta" class="comment-ipt" rows="1" placeholder="评论" maxlength="200"></textarea> -->
    <input
      type="text"
      @blur="hideInput"
      id="texta"
      class="comment-ipt"
      v-model.trim="comment"
      :placeholder="placeholder"
    />
    <div class="submit" @click="submit">发布</div>
  </div>
  <!-- </div> -->
</template>

<script>
// textarea 自适应高度
import { autoTextarea } from "@/config/dom";
// 解决iOS 12.x.x 以上 关闭软键盘页面不回弹底部空白问题的问题
import { iOS } from "@/config/ios";
export default {
  name: "commit",
  props: {
    placeholder: {
      type: String,
      default: "评论"
    }
    // comment: {
    //   type: String,
    //   default: ""
    // }
  },
  data() {
    return {
      // placeholder: "评论",
      comment: ""
    };
  },
  mounted() {
    // textarea 自适应高度
    setTimeout(() => {
      let test = document.querySelectorAll("textarea");
      for (let i = 0; i < test.length; i++) {
        autoTextarea(test[i]);
      }
    }, 500);
    // 解决iOS 12.x.x 以上 关闭软键盘页面不回弹底部空白问题的问题
    iOS();
  },
  methods: {
    mBlur() {
      $("#texta").blur();
    },
    hideInput() {
      console.log("blur")
      setTimeout(() => {
        this.comment = "";
      }, 50);
      // if(this.comment ==""){
        this.$emit("blur");
      // }
    },
    autoFocus() {
      $("#texta").focus();
      console.log("focus")
    },
    submit() {
      this.$emit("submit", this.comment);
      $("#texta").blur();
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.commit {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: 50px;
  display: flex;
  align-items: center;
  background: rgba(243, 243, 243, 1);
  // position: absolute;
  // left: 0;
  // bottom: 1.125rem;
  .comment-ipt {
    height: 36px;
    flex-grow: 1;
    padding: 0 10px;
    box-sizing: border-box;
    border: 0;
    margin-right: 5px;
    border-radius: 5px;
  }
  .submit {
    width: 50px;
    flex-basis: 50px;
    text-align: center;
    height: 36px;
    line-height: 36px;
    color: #fff;
    font-size: 14px;
    background: linear-gradient(
      -79deg,
      rgba(0, 129, 255, 1),
      rgba(0, 174, 255, 1)
    );
    box-shadow: 0px 0px 8px 0px rgba(79, 104, 128, 0.25);
    border-radius: 5px;
  }
}
</style>


