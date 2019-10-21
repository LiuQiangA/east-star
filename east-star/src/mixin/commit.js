import Ls from '@/config/storage'
import {
  Toast,
  MessageBox
} from "mint-ui";
export const Commit = {
  data() {
    return {
      commentId: "",
      showDelPop: false,
      indexCommit: "",
      listCommitIndex: "",
      placeholder: "",
      showInput: false,
      // 发布评论
      commitOption: {
        baseId: 1, //--前言分享ID
        touseId: 1, //--被评论人ID
        parentId: 0, //--评论内容的ID 0直接评论前言分享  其他值评论别人的评论
        comment: "", //--评论内容
        typeId: 3 //内容类别  2教研问答  3前言分享  4记录  5班级动态
      },
    }
  },
  methods: {
    // 删除评论
    delCommit() {
      this.$fetch
        .setDelComment({
          commentId: this.commentId
        })
        .then(res => {
          this.newList[this.indexCommit].list.splice(this.listCommitIndex, 1);
          this.newList[this.indexCommit].commentNum -= 1;
          // Toast("已删除");
          // this.init();
        })
        .catch(err => {});
    },
    // 获取index
    getIndex(index) {
      this.indexCommit = index;
    },
    // 传递评论信息
    commit(item, index, id) {
      console.log("item");
      console.log(item);
      console.log("index");
      console.log(index);
      console.log("id");
      console.log(id);
      this.commentId = item.commentId;
      this.listCommitIndex = index;
      // 根据评论人id判断是否是自己的评论，是则弹出删除窗口，否则弹出评论框
      // 使用延时是因为emit传参过程中可能又延时，导致参数在使用的时候还未定义
      setTimeout(() => {
        console.log("this.indexCommit");
        console.log(this.indexCommit);
        // let userId = this.$route.query.userId || this.newList[this.indexCommit].userId;
        // let userId = this.$route.query.userId || this.newList[this.indexCommit].list.userId1;
        let userId = Ls.getItem("userId");
        console.log("userId");
        console.log(userId);
        console.log("item.userId1");
        console.log(item.userId1);
        if (userId != item.userId1) {
          this.showInput = true;
          setTimeout(() => {
            this.$refs.commit.autoFocus();
          }, 20);
        } else {
          // this.showInput = false;
          // this.showDelPop = true;
          MessageBox.confirm("确定删除吗?", " ").then(action => {
            this.delCommit();
          });
        }
      }, 20);

      this.placeholder = "回复" + item.userName;
      this.commitOption.baseId = item.baseId;
      this.commitOption.touseId = item.userId1;
      this.commitOption.parentId = 1;

      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId","#my"+id)
    },
    // 提交评论
    submit(comment) {
      this.showInput = false;
      if (comment) {
        this.hideInput();
        this.commitOption.comment = comment;
        this.$fetch
          .setPostComment(this.commitOption)
          .then(res => {
            this.$refs.commit.comment = "";
            setTimeout(() => {
              this.showInput = false;
              this.commitOption.comment = "";
            }, 20);
            this.init();
            // this.$fetch
            //   .getShareList(this.option)
            //   .then(res => {
            //     this.$nextTick(() => {
            //       this.newList = res.data.newList;
            //       this.total = res.data.total;
            //       this.totalPage = this.total / 10;
            //       this.finishPulling();
            //     });
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          })
          .catch(err => {});
      }
    },
    // 隐藏评论输入框
    hideInput() {
      setTimeout(() => {
        this.showInput = false;
      }, 20);
    },
    message(item, index, id) {
      console.log(item, index, id);
      this.showInput = true;
      this.$refs.commit.autoFocus();
      this.indexCommit = index;

      this.placeholder = "评论";
      this.commitOption.baseId = item.shareId;
      this.commitOption.touseId = item.userId;
      this.commitOption.parentId = 0;
      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId",id)
    },
  },

}
