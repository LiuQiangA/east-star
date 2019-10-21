<template>
  <div class="system-layout" ref="wrapper">
    <div class="top" id="top">
        <i class="iconfont icon-fanhui" @click="back"></i>
        分享详情
        <span class="share">
          <i class="iconfont icon-gengduo"></i>
        </span>
      </div>
    <div class="content">
      
      <div class="system-communion_box">
        <div class="communion_box_left">
          <div>
            <img
              v-if="shareDetail.user"
              :src="shareDetail.user.userImage || '../../assets/images/default.png'"
              :onerror="defaultHeadImg"
            />
            <!-- <img
              v-else
              src="../../assets/images/default.png"
            />-->
          </div>
        </div>

        <div class="communion_box_right">
          <!-- <div
            class="first"
            v-if="shareDetail.user"
          >{{LSuserId == shareDetail.userId?'我':shareDetail.user.userName}}</div> -->
          <div
            class="first"
            v-if="shareDetail.user"
          >{{shareDetail.user.userName}}</div>
          <div class="second">{{shareDetail.content}}</div>
          <div class="third" :class="{'flex-imgW': imgW, 'flex-imgH': imgH}">
            <div
              @click="previewBtn(shareDetail.pictures,index)"
              v-for="(imgSrc,index) in shareDetail.pictures"
              :key="index"
            >
              <img :src="imgSrc"/>
              <!-- <img v-if="imgW || imgH" :src="imgSrc+'?imageMogr2/thumbnail/!67px'" />
              <img v-else :src="imgSrc+'?imageMogr2/thumbnail/!75p&imageMogr2/gravity/Center/crop/300x300'"> -->
            </div>
          </div>

          <div class="fourth" v-if="shareDetail.updatedAt || shareDetail.commentNum">
            <div class="fourth_time">
              {{shareDetail.updatedAt}} {{shareDetail.area}}
              <span
                v-if="LSuserId == shareDetail.userId"
                class="delete"
                @click="setDelShare(shareDetail.shareId)"
              >删除</span>
            </div>
            <div class="fourth_message" @click="messageBtn">
              <div>
                <img src="../../assets/images/message.png" />
              </div>
              <div>{{shareDetail.commentNum}}</div>
            </div>
            <div
              class="fourth_praise"
              @click="praiseBtn(shareDetail.shareId, shareDetail.starState)"
            >
              <div>
                <i class="iconfont icon-dianzan" :class="{'on':shareDetail.starState}"></i>
              </div>
              <div>{{shareDetail.stars}}</div>
            </div>
          </div>
          <!-- 评论 -->
          <div class="fifth" v-if="shareComment.length">
            <div class="system-moreCom">
              <div class="moreCom_up"></div>
              <div class="moreCom_text" v-for="(item,index) in shareComment" :key="index">
                <!-- <template > -->
                <div v-if="!item.parentId" @click="commit(item,index)">
                  <span>{{item.userName}}：</span>
                  {{item.comment}}
                </div>
                <div v-else @click="commit(item,index)">
                  <span>{{item.userName}}</span>回复
                  <span>{{item.touserName}}：</span>
                  {{item.comment}}
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
    <div class="commit-shadow" v-show="showInput" @click="myBlur"></div>
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
import { MessageBox, Toast } from "mint-ui";
import { Commit } from "@/mixin/commit";
import commit from "@/components/commit";
export default {
  name: "classQuestions",
  mixins: [Commit],
  components: { commit },
  data() {
    return {
      imgW: false,
      imgH: false,
      LSuserId: "",
      shareDetail: {},
      shareComment: [],
      img: [
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
        "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"
      ],
      shareId: "",
      starState: "",
      defaultHeadImg: 'this.src="'+ require('../../assets/images/default.png') +'"'
    };
  },
  created() {
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
    this.getShareDetail();
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
    setTimeout(() => {
      this.imgW = this.$route.query.imgW;
      this.imgH = this.$route.query.imgH;
      console.log(this.imgW, this.imgH);
    }, 400);
  },
  methods: {
    myBlur() {
      this.showInput = false;
      this.$refs.commit.mBlur();
    },
    back() {
      this.$router.go(-1);
      console.log("返回");
    },
    // 删除评论
    delCommit() {
      this.$fetch
        .setDelComment({
          commentId: this.commentId
        })
        .then(res => {
          this.shareComment.splice(this.listCommitIndex, 1);
          this.shareDetail.commentNum -= 1;
          // Toast({
          //   message: "已删除"
          // });
        })
        .catch(err => {});
    },
    // 传递评论信息
    commit(item, index) {
      console.log(item);
      console.log(index);
      this.commentId = item.commentId;
      this.listCommitIndex = index;
      // 根据评论人id判断是否是自己的评论，是则弹出删除窗口，否则弹出评论框
      // 试用延时是因为emit传参过程中可能又延时，导致参数在使用的时候还未定义
      setTimeout(() => {
        // console.log(this.indexCommit);
        // let userId = this.$route.query.userId || this.shareDetail.userId;
        let userId = Ls.getItem("userId");
        console.log(userId);
        console.log(item.userId1);
        if (userId != item.userId1) {
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

      this.placeholder = "回复" + item.userName;
      this.commitOption.baseId = item.baseId;
      this.commitOption.touseId = item.userId1;
      this.commitOption.parentId = 1;
    },
    // 提交评论
    submit(comment) {
      this.showInput = false;
      if (comment) {
        this.commitOption.comment = comment;
        this.$fetch
          .setPostComment(this.commitOption)
          .then(res => {
            this.$refs.commit.comment = "";
            setTimeout(() => {
              this.showInput = false;
              this.commitOption.comment = "";
            }, 20);
            this.getShareDetail();
            // 判断是否有操作 0 否 1 是
            Ls.setItem("isInit",'1');
          })
          .catch(err => {});
      }
    },
    // 删除我的分享交流
    setDelShare(shareId) {
      MessageBox.confirm("确定执行此操作?").then(action => {
        this.$fetch
          .setDelShare({
            shareId: shareId
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
    // 获取详情
    getShareDetail() {
      this.$fetch
        .getShareDetail({
          shareId: this.$route.query.id
        })
        .then(res => {
          this.shareDetail = res.data.shareDetail;
          this.shareComment = res.data.shareDetail.list;
        })
        .catch(err => {});
    },
    messageBtn() {
      this.showInput = true;
      this.$refs.commit.autoFocus();

      this.placeholder = "评论";
      this.commitOption.baseId = this.shareDetail.shareId;
      this.commitOption.touseId = this.shareDetail.userId;
      this.commitOption.parentId = 0;
      // // 用于评论时候键盘弹起页面定位
      // Ls.setItem("elementId","#top")
    },
    praiseBtn(id, state) {
      console.log("item");
      this.shareId = id;
      if (Ls.getItem("userId") == this.shareDetail.userId) {
        this.$router.push({
          path: "/teaCircle/zan",
          query: { id: id, shareType: 3 }
        });
        return false;
      }
      if (state) {
        this.starState = -1;
        this.shareDetail.starState = 0;
        this.shareDetail.stars -= 1;
        this.setStar();
      } else {
        this.starState = 1;
        this.shareDetail.starState = 1;
        this.shareDetail.stars += 1;
        this.setStar();
      }
    },
    setStar() {
      this.$fetch
        .setStar({
          shareId: this.shareId,
          starState: this.starState,
          shareType: 3
        })
        .then(res => {})
        .catch(err => {});
      // 判断是否有操作 0 否 1 是
      Ls.setItem("isInit",'1');
    },
    previewBtn(item, index) {
      // Ls.setItem("list",item)
      // Ls.setItem("index",index)
      this.$store.commit("changePre");
      this.$store.commit("changeIndex", index);
      this.$store.commit("changeList", item);
    }
  }
  // destroyed() {
  //   Ls.removeItem("list");
  //   Ls.removeItem("index");
  // },
};
</script> 
<style scoped lang='less'>
.flex-imgW {
  width: 100%;
  div {
    height: 5.26rem !important;
    width: 11.12rem !important;
    img{
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
    img{
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
.commit-date {
  font-size: 12px;
  color: #c1c1c1;
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
      margin-bottom: 0.625rem;
      font-size: 1rem;
      color: #0081ff;
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
      height: 2.8125rem;
      line-height: 2.8125rem;
      overflow: hidden;
      color: #c1c1c1;
      .fourth_time {
        float: left;
        font-size: 0.75rem;
        .delete {
          color: #88c750;
          margin-left: 0.625rem;
        }
      }
      .fourth_praise {
        float: right;
        font-size: 0.75rem;
        margin-right: 1.9875rem;
        .iconfont {
          font-size: 20px;
          color: #c1c1c1;
          &.on {
            color: #db2809;
          }
        }
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