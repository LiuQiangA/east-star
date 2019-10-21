<template>
  <div class="system-layout" ref="wrapper">
    <div class="top" id="top">
      <i class="iconfont icon-fanhui" @click="back"></i>
      问答详情
      <span class="share">
        <i class="iconfont icon-gengduo"></i>
      </span>
    </div>
    <div class="content">
      <div class="system-communion_box" v-if="questionDetail.id">
        <div class="communion_box_left">
          <div>
            <img
              :src="questionDetail.user.userImage||'../../assets/images/default.png'"
              :onerror="defaultHeadImg"
            />
          </div>
        </div>

        <div class="communion_box_right">
          <div class="first">
            <!-- <div>{{questionDetail.userId == LSuserId?"我":questionDetail.user.userName}}</div> -->
            <div>{{questionDetail.user.userName}}</div>
            <p>
              <span class="time">{{questionDetail.updatedAt}}</span>
              <span
                class="my-delete"
                v-if="LSuserId == questionDetail.userId"
                @click="setDelQuestion(questionDetail.id)"
              >删除</span>
            </p>
          </div>
          <div class="second">{{questionDetail.content}}</div>
          <div class="third" :class="{'flex-imgW': imgW, 'flex-imgH': imgH}">
            <div
              @click="previewBtn(questionDetail.pictures,index)"
              v-for="(imgSrc,index) in questionDetail.pictures"
              :key="index"
            >
              <img :src="imgSrc" />
              <!-- <img v-if="imgW || imgW" :src="imgSrc+'?imageMogr2/thumbnail/!67px'" />
              <img v-else :src="imgSrc+'?imageMogr2/thumbnail/!75p&imageMogr2/gravity/Center/crop/300x300'">-->
            </div>
          </div>

          <div class="fourth">
            <div class="fourth_time">{{questionDetail.area}}</div>
            <div class="fourth_message" v-if="showHF == 'true'" @click="messageBtn">回复</div>
            <!-- <div class="fourth_message" @click="messageBtn">
              <div>
                <img src="../../assets/images/message.png">
              </div>
              <div>999</div>
            </div>
            <div class="fourth_praise" @click="praiseBtn">
              <div>
                <img src="../../assets/images/praise.png">
              </div>
              <div>999</div>
            </div>-->
          </div>
          <!-- 评论 -->
          <div class="fifth" v-if="messageComment.length">
            <div class="system-moreCom">
              <div class="moreCom_up"></div>
              <div class="moreCom_text" v-for="(item,index) in messageComment" :key="index">
                <!-- <template > -->
                <div v-if="!item.parentId" @click="commit(item,index)">
                  <span>{{item.answerUserName}}：</span>
                  {{item.answerContent}}
                </div>
                <div v-else @click="commit(item,index)">
                  <span>{{item.answerUserName}}</span>回复
                  <span>{{item.touserName}}：</span>
                  {{item.answerContent}}
                </div>
                <p class="commit-date">{{item.updatedAt}}</p>
                <!-- </template> -->
              </div>
            </div>
          </div>
          <!-- 评论  end-->
        </div>
      </div>
    </div>
    <!-- commit -->
    <commit
      ref="commit"
      @blur="hideInput"
      @submit.self="submit"
      :placeholder="placeholder"
      :class="{'commitCont':true,'showInput':showInput}"
    ></commit>
    <!-- <div :class="{'shadow':showInput}" v-if="showInput"></div> -->
    <!-- 删除评论 -->
    <div class="delPop" :class="{'on':showDelPop}" @click="showDelPop = false">
      <div class="delPop-cont" :class="{'on':showDelPop}">
        <p class="del" @click="delCommit">删除</p>
        <p class="esc" @click="showDelPop = false">取消</p>
      </div>
    </div>
  </div>
</template>
<script>
import Ls from "@/config/storage";
import { Toast, MessageBox } from "mint-ui";
import { Commit } from "@/mixin/commit";
import commit from "@/components/commit";
export default {
  name: "classQuestions",
  mixins: [Commit],
  components: { commit },
  data() {
    return {
      showHF: 'false',
      imgW: false,
      imgH: false,
      questionDetail: {},
      messageComment: [],
      img: [
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"
      ],
      defaultHeadImg: 'this.src="'+ require('../../assets/images/default.png') +'"'
    };
  },
  created() {
    this.imgW = this.$route.query.imgW;
    this.imgH = this.$route.query.imgH;
    console.log(this.imgW, this.imgH);
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
    this.showHF = Ls.getItem('showHF');
    this.getQuestionDetail();
    // this.$bridge.callhandler("hiteBtn", { hiteBtn: "true" }, data => {
    //   // vm.ddd = data;
    //   // 处理返回数据
    // });
    this.$bridge.callhandler("hiteHead", { hiteBtn: "true" }, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
    // 判断是否有操作 0 否 1 是
    Ls.setItem("isInit",'0');
  },
  mounted() {
    // this.myScroll = new this.$BScroll(this.$refs.wrapper, {
    //   click: true
    // });
  },
  methods: {
    // 删除我的问答
    setDelQuestion(id) {
      MessageBox.confirm("确定执行此操作?").then(action => {
        this.$fetch
          .setDelQuestion({
            questionId: id
          })
          .then(res => {
            Toast({
              message: "操作成功",
              duration: 1500
            });
            setTimeout(() => {
              this.$router.back(-1);
            }, 1500);
          })
          .catch(err => {
            Toast({
              message: "操作失败",
              duration: 1500
            });
          });
      });
    },
    back() {
      this.$router.go(-1);
    },
    messageBtn() {
      this.showInput = true;
      this.$refs.commit.autoFocus();

      this.placeholder = "评论";
      this.commitOption.baseId = this.questionDetail.id;
      this.commitOption.touseId = this.questionDetail.userId;
      this.commitOption.parentId = 0;
    },
    // 删除评论
    delCommit() {
      this.$fetch
        .setDelComment({
          commentId: this.commentId
        })
        .then(res => {
          this.messageComment.splice(this.listCommitIndex, 1);
          this.messageComment.commentNum -= 1;
          // Toast("已删除");
          // this.init();
        })
        .catch(err => {});
    },
    // delCommit() {
    //   this.$fetch
    //     .setDelComment({
    //       commentId: this.commentId
    //     })
    //     .then(res => {
    //       this.messageComment.splice(this.listCommitIndex, 1);
    //       // Toast({
    //       //   message: "已删除"
    //       // });
    //     })
    //     .catch(err => {});
    // },
    // 传递评论信息
    commit(item, index) {
      console.log(item);
      console.log(index);
      this.commentId = item.answerId;
      this.listCommitIndex = index;
      // 根据评论人id判断是否是自己的评论，是则弹出删除窗口，否则弹出评论框
      // 试用延时是因为emit传参过程中可能又延时，导致参数在使用的时候还未定义
      setTimeout(() => {
        // console.log(this.indexCommit);
        // let userId = this.$route.query.userId || this.questionDetail.userId;
        let userId = Ls.getItem("userId");
        this.commitOption.baseId = this.questionDetail.id;
        console.log(userId);
        console.log(item.answerUserId1);
        if (userId != item.answerUserId1) {
          this.showInput = true;
          this.$refs.commit.autoFocus();
        } else {
          // this.showInput = false;
          // this.showDelPop = true;
          MessageBox.confirm("确定删除吗?", " ").then(action => {
            this.delCommit();
          });
        }
      }, 20);

      this.placeholder = "回复" + item.answerUserName;

      this.commitOption.touseId = item.answerUserId1;
      this.commitOption.parentId = 1;
    },
    // 提交评论
    submit(comment) {
      this.showInput = false;
      if (comment) {
        this.commitOption.comment = comment;
        this.commitOption.typeId = 2;
        this.$fetch
          .setPostComment(this.commitOption)
          .then(res => {
            this.$refs.commit.comment = "";
            setTimeout(() => {
              this.showInput = false;
              this.commitOption.comment = "";
            }, 20);
            this.getQuestionDetail();
            // 判断是否有操作 0 否 1 是
            Ls.setItem("isInit",'1');
          })
          .catch(err => {
            // 根据state判断是否是教研员身份,3代表非教研员
            if (err.data.state == 3) {
              Toast("非教研员不可以进行此操作哦！");
            }
          });
      }
    },
    getQuestionDetail() {
      this.$fetch
        .getQuestionDetail({
          questionId: this.$route.query.id
        })
        .then(res => {
          this.questionDetail = res.data.questionDetail;
          this.messageComment = res.data.messageComment;
          console.log(this.questionDetail.user.userName);
        })
        .catch(err => {});
    },
    praiseBtn() {
      console.log("item");
    },
    previewBtn(item, index) {
      this.$store.commit("changePre");
      this.$store.commit("changeIndex", index);
      this.$store.commit("changeList", item);
    }
  }
};
</script> 
<style scoped lang='less'>
.flex-imgW {
  width: 100%;
  div {
    height: 5.26rem !important;
    width: 11.12rem !important;
    img {
      width: 100% !important;
      height: 100%;
    }
  }
}
.flex-imgH {
  width: 100%;
  div {
    width: 5.26rem !important;
    height: 11.12rem !important;
    img {
      width: 100% !important;
      height: 100%;
    }
  }
}
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
  position: fixed;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 9;
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
.delPop {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  transition: bottom 0.2s;
  transition: all 0.2s;
  &.on {
    z-index: 99;
    background: rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
  }
  .delPop-cont {
    width: 100%;
    position: absolute;
    bottom: -100%;
    left: 0;
    transition: bottom 0.2s;
    &.on {
      bottom: 0;
      transition: bottom 0.2s;
    }
    .del {
      line-height: 2.5rem;
      background: #fff;
      color: red;
      text-align: center;
      margin-bottom: 6px;
    }
    .esc {
      line-height: 2.5rem;
      background: #fff;
      color: #000;
      text-align: center;
    }
  }
}
.hidden {
  overflow: hidden;
}
.shadow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  overflow: hidden;
}
.commitCont {
  position: fixed;
  left: 0;
  // bottom: 1.125rem;
  bottom: -50px;
  z-index: -1;
  &.showInput {
    z-index: 2;
    bottom: 0;
  }
}
.system-layout {
  height: 100%;
  overflow: scroll;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.system-communion_box {
  width: 100%;
  padding: 1.25rem 15px;
  box-sizing: border-box;
  display: flex;
  margin-top: 50px;
  // border-bottom: 1px solid #e1e4e9;
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
      font-size: 1rem;
      color: #0081ff;
      p {
        margin: 10px 0 12px 0;
      }
      .my-delete {
        font-size: 12px;
        color: #88c750;
      }
      .time {
        font-size: 12px;
        color: #c1c1c1;
      }
    }
    .second {
      width: 100%;
      word-break: break-all;
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
          // height: 100%;
          width: 200px;
        }
      }
    }

    .fourth {
      // height: 2.8125rem;
      // line-height: 2.8125rem;
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
        color: #0081ff;

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

.system-moreCom {
  background: #f0f0f0;
  position: relative;
  border-radius: 0.15625rem;
  padding: 0.625rem;
  margin-top: 10px;
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
    & > div {
      margin: 15px 0 6px 0;
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
  }
}
</style>