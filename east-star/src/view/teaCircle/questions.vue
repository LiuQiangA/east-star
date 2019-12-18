<template>
  <div style="overflow:hidden;height:100%;">
    <div class="system-questions van-hairline--top" ref="wrapper" v-show="haveNet">
      <div class="content" v-if="isLogin">
        <shareList2
          v-if="newList2.length"
          :datas="newList2"
          :zan="zan"
          @commit="commit"
          @message="message"
          @praise="praise"
          @getIndex="getIndex"
          @deleteShare="deleteShare"
        ></shareList2>
        <div v-if="empty" class="no-data">
          <!-- <img src="../../assets/images/noData.png" /> -->
          <p>暂无内容</p>
        </div>
        <div class="noMore" v-if="isEnd">没有更多啦~</div>
      </div>
      <!-- login -->
      <login v-else refresh="refresh2"></login>
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
    <div class="netError" v-show="!haveNet">
      <img src="../../assets/images/netError.png" width="70%" alt="无网络" />
      <p class="err-ms">您的网络好像不太给力，请稍后再试</p>
      <div class="refresh">点击刷新</div>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import shareList2 from "./components/shareList2";
import commit from "@/components/commit";
import Ls from "@/config/storage";
import login from "../login";
import { MessageBox, Toast } from "mint-ui";
import { Commit } from "@/mixin/commit";
import { Net } from "@/mixin/net";
export default {
  name: "questions",
  mixins: [Commit,Net],
  data() {
    return {
      empty: false,
      myScroll: {},
      scrtop: "",
      isLogin: true,
      keepAlive: false,
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
      totalPage: "",
      option: {
        pageNo: 1,
        pageSize: 10,
        type: 1 // 区分教研问答和我的问答状态标识  1:教研问答  2：我的问答
      },
      // scroll 配置
      options: {
        probeType: 3,
        click: true,
        deceleration: 0.001,
        pullDownRefresh: {
          threshold: 40, // 刷新时机
          stop: 40 // 回弹停留的距离
        },
        pullUpLoad: {
          threshold: -50 // 开始加载的时机
        },
        startY: 0
      },
      newList: [],
      newList2: [],
      total: "",
      isEnd: false,
      shareId: "", // 分享id
      starState: "", // 点赞状态（1点赞  -1取消点赞）
      zan: false, //是否点过赞
      data: [
        {
          img: [
            "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
            "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
            "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"
          ]
        },
        {
          img: [
            "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"
          ]
        }
      ]
    };
  },
  components: {
    shareList2,
    commit,
    login
  },
  created() {
    this.init();
  },
  mounted() {
    const vm = this;
    this.$bridge.registerhandler("refresh2", (data, responseCallback) => {
      // vm.native_data = data;
      // console.log("2");
      // console.log("Ls");
      // console.log(Ls);
      // console.log("data");
      // console.log(JSON.parse(data));
      Ls.setItem("userId", JSON.parse(data).userId);
      Ls.setItem("auth", JSON.parse(data).auth);
      vm.init();
      // vm.initScroll();
      vm.isLogin = true;
    });
    this.$bridge.callhandler("hiteBtn", { hiteBtn: "false" }, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
    // this.initScroll();
    // this.getQuestionList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.keepAlive == true) {
        vm.keepAlive = true;

        // store.commit('recordScroll', document.documentElement.scrollTop || document.body.scrollTop); // document.body.scrollTop一定要加不然iOS上会失效，本人亲测，踩坑
      }
      if (from.meta.keepAlive == true) {
        vm.keepAlive = true;
        vm.myScroll.scrollTo(0, vm.scrtop);
        console.log("999");
        console.log(vm.scrtop);
      }
      if(from.name == 'questionsDet'){
        // console.log("from")
        // console.log(from.name)
        if(Ls.getItem("isInit") !== '0'){
          vm.init();
        }
        // vm.init();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    // ...
    this.keepAlive = false;
    next();
  },
  activated() {
    // this.initScroll();
    console.log("activated");
    console.log(this.scrtop);
    this.scrollHeight();
    this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
    // 滚动到上次离开时候的位置
    this.myScroll.scrollTo(0, this.scrtop);
    this.myGlobal.setScroll(this.myScroll);
  },
  methods: {
    myBlur() {
      this.showInput = false;
      this.$refs.commit.mBlur();
    },
    // 传递评论信息
    // commit(item, index, id) {
    //   console.log("item");
    //   console.log(item);
    //   console.log("index");
    //   console.log(index);
    //   console.log("id");
    //   console.log(id);
    //   this.commentId = item.commentId;
    //   this.listCommitIndex = index;
    //   // 根据评论人id判断是否是自己的评论，是则弹出删除窗口，否则弹出评论框
    //   // 使用延时是因为emit传参过程中可能又延时，导致参数在使用的时候还未定义
    //   setTimeout(() => {
    //     console.log("this.indexCommit");
    //     console.log(this.indexCommit);
    //     // let userId = this.$route.query.userId || this.newList[this.indexCommit].userId;
    //     // let userId = this.$route.query.userId || this.newList[this.indexCommit].list.userId1;
    //     let userId = Ls.getItem("userId");
    //     console.log("userId");
    //     console.log(userId);
    //     console.log("item.userId1");
    //     console.log(item.userId1);
    //     if (userId != item.userId1) {
    //       // this.showInput = true;
    //       // setTimeout(() => {
    //       //   this.$refs.commit.autoFocus();
    //       // }, 20);
    //     } else {
    //       // this.showInput = false;
    //       // this.showDelPop = true;
    //       MessageBox.confirm("确定删除吗?", " ").then(action => {
    //         this.delCommit();
    //       });
    //     }
    //   }, 20);

    //   // this.placeholder = "回复" + item.userName;
    //   // this.commitOption.baseId = item.baseId;
    //   // this.commitOption.touseId = item.userId1;
    //   // this.commitOption.parentId = 1;

    //   // 用于评论时候键盘弹起页面定位
    //   Ls.setItem("elementId","#my"+id)
    // },
    // 删除问答
    deleteShare(id) {
      MessageBox.confirm("确定执行此操作?").then(action => {
        this.$fetch
          .setDelQuestion({
            questionId: id
          })
          .then(res => {
            // Toast({
            //   message: "操作成功",
            //   duration: 1500
            // });
            // setTimeout(() => {
              this.init();
            // }, 1500);
          })
          .catch(err => {
            Toast({
              message: "操作失败",
              duration: 1500
            });
          });
      });
    },
    // 传递评论信息
    commit(item, index, id) {
      console.log(item);
      console.log(index);
      this.commentId = item.answerId;
      this.listCommitIndex = index;
      // 根据评论人id判断是否是自己的评论，是则弹出删除窗口，否则弹出评论框
      // 试用延时是因为emit传参过程中可能又延时，导致参数在使用的时候还未定义
      setTimeout(() => {
        console.log(this.indexCommit);
        let userId = Ls.getItem("userId");
        this.commitOption.baseId = this.newList2[index].id;
        console.log(userId);
        console.log(item.answerUserId1);
        if (userId != item.answerUserId1) {
          this.showInput = true;
          this.$refs.commit.autoFocus();
        } else {
          // this.showInput = false;
          // this.showDelPop = true;
          MessageBox.confirm("确定删除吗?", " ").then(action => {
            // this.newList2[this.indexCommit].list.splice(this.listCommitIndex, 1);
            // this.newList2[this.indexCommit].commentNum -= 1;
            this.delCommit();
          });
        }
      }, 20);

      this.placeholder = "回复" + item.answerUserName;

      this.commitOption.touseId = item.answerUserId1;
      this.commitOption.parentId = 1;
      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId", "#my" + id);
    },
    message(item, index, id) {
      console.log(item, index, id);
      this.showInput = true;
      this.$refs.commit.autoFocus();

      this.placeholder = "评论";
      this.commitOption.baseId = item.id;
      this.commitOption.touseId = item.userId;
      this.commitOption.parentId = 0;
      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId", id);
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
            console.log(res)
            if(res.data.state == 2){
              Toast(res.data.error);
              return false;
            }
            setTimeout(() => {
              this.showInput = false;
              this.commitOption.comment = "";
            }, 20);
            this.init();
            // this.$fetch
            //   .getQuestionList(this.option)
            //   .then(res => {
            //     this.$nextTick(() => {
            //       this.newList2 = res.data.newList;
            //       this.total = res.data.total;
            //       this.totalPage = this.total / 10;
            //       this.finishPulling();
            //     });
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          })
          .catch(err => {
            alert("9")
            // 根据state判断是否是教研员身份,3代表非教研员
            if (err.data.state == 3) {
              Toast("非教研员不可以进行此操作哦！");
            }
          });
      }
    },
    // 初始化scroll
    initScroll() {
      let that = this;
      this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
      this.myGlobal.setScroll(this.myScroll);
      this.pullDownEvent();
      this.pullUpLoadEvent();
      // this.scrollHeight();
      // // 滚动到上次离开时候的位置
      // this.myScroll.scrollTo(0, that.scrtop);
    },
    finishPulling() {
      this.myScroll.finishPullDown(); // 结束下拉刷新
      this.myScroll.finishPullUp(); // 结束上拉加载更多
      this.$nextTick(() => {
        this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
      });
    },
    pullDownEvent() {
      this.myScroll.on("pullingDown", () => {
        this.isEnd = false;
        console.log("下拉刷新");
        this.option.pageNo = 1;
        this.init();
      });
    },
    pullUpLoadEvent() {
      // this.isEnd = false;
      this.myScroll.on("pullingUp", () => {
        console.log("上拉加载");
        if (this.option.pageNo <= this.totalPage + 1) {
          this.option.pageNo++;
          this.getQuestionList();
          this.isEnd = false;
        } else {
          this.isEnd = true;
        }
      });
    },
    // 获取list
    getQuestionList() {
      // this.isEnd = false;
      this.$fetch
        .getQuestionList(this.option)
        .then(res => {
          this.finishPulling();
          this.$nextTick(() => {
            this.isLogin = true;
            res.data.newList.forEach((item, index, arr) => {
              let img = new Image();
              // 后台图片的src
              img.src = item.pictures[0];
              // if(item.pictures.length>1) return false;
              if (item.pictures.length == 1) {
                img.onload = function() {
                  // 打印
                  console.log(
                    "width:" + img.width + ",height:" + img.height,
                    "index" + index
                  );
                  console.log(img.width, img.height);
                  if (img.width > img.height) {
                    arr[index].imgW = true;
                    arr[index].imgH = false;
                  } else {
                    arr[index].imgW = false;
                    arr[index].imgH = true;
                  }
                  arr[index].b = 1;
                  console.log(item, "9");
                };
              } else {
                arr[index].a = 1;
              }
            });

            setTimeout(() => {
              this.newList2 = this.newList2.concat(res.data.newList);
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              this.finishPulling();
              console.log(this.newList2);
            }, 1000);
          });
          // this.isLogin = true;
          // this.newList2 = this.newList2.concat(res.data.newList);
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // // this.$store.commit("dataUpdate",res.data.newList2);
          // this.finishPulling();
          // console.log(this.newList2);
        })
        .catch(err => {
          console.log(err);
          if (err.response.state == "False") {
            this.isLogin = false;
          }
        });
    },
    // init list
    initLogin() {
      this.option.pageNo = 1;
      this.$fetch
        .getQuestionList(this.option)
        .then(res => {
          if(!res.data.newList.length){
            this.empty = true;
          }
          this.$nextTick(() => {
            this.isLogin = true;
            res.data.newList.forEach((item, index, arr) => {
              let img = new Image();
              // 后台图片的src
              img.src = item.pictures[0];
              if (item.pictures.length == 1) {
                // this.whImg(item,img,index,arr).then(resp=>{
                //   this.newList = resp;
                // })
                img.onload = function() {
                  // 打印
                  console.log(
                    "width:" + img.width + ",height:" + img.height,
                    "index" + index
                  );
                  console.log(img.width, img.height);
                  if (img.width > img.height) {
                    arr[index].imgW = true;
                    arr[index].imgH = false;
                  } else {
                    arr[index].imgW = false;
                    arr[index].imgH = true;
                  }
                  arr[index].b = 1;
                  console.log(item, "9");
                };
              } else {
                arr[index].a = 1;
              }
            });
            setTimeout(() => {
              this.newList2 = res.data.newList;
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              this.finishPulling();
              // this.initScroll();
            }, 1500);
            this.initScroll();
          });
          // this.isLogin = true;
          // this.newList2 = res.data.newList;
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // // this.$store.commit("dataUpdate",res.data.newList2);
          // // this.finishPulling();
          // this.initScroll();
          // console.log(this.newList2);
        })
        .catch(err => {
          console.log(err);
          if (err.response.state == "False") {
            this.isLogin = false;
          }
        });
    },
    init() {
      this.option.pageNo = 1;
      this.$fetch
        .getQuestionList(this.option)
        .then(res => {
          if(!res.data.newList.length){
            this.empty = true;
          }
          this.$nextTick(() => {
            this.isLogin = true;
            res.data.newList.forEach((item, index, arr) => {
              let img = new Image();
              // 后台图片的src
              img.src = item.pictures[0];
              if (item.pictures.length == 1) {
                // this.whImg(item,img,index,arr).then(resp=>{
                //   this.newList = resp;
                // })
                img.onload = function() {
                  // 打印
                  console.log(
                    "width:" + img.width + ",height:" + img.height,
                    "index" + index
                  );
                  console.log(img.width, img.height);
                  if (img.width > img.height) {
                    arr[index].imgW = true;
                    arr[index].imgH = false;
                  } else {
                    arr[index].imgW = false;
                    arr[index].imgH = true;
                  }
                  arr[index].b = 1;
                  console.log(item, "9");
                };
              } else {
                arr[index].a = 1;
              }
            });
            setTimeout(() => {
              this.newList2 = res.data.newList;
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              this.finishPulling();
              // this.initScroll();
            }, 1500);
            this.initScroll();
          });
          // this.isLogin = true;
          // this.newList2 = res.data.newList;
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // // this.$store.commit("dataUpdate",res.data.newList2);
          // // this.finishPulling();
          // this.initScroll();
          // console.log(this.newList2);
        })
        .catch(err => {
          console.log(err);
          if (err.response.state == "False") {
            this.isLogin = false;
          }
        });
    },
    praise(shareId) {
      console.log(shareId);
      this.shareId = shareId;
      this.zan = !this.zan;
      if (this.starState == 1) {
        this.starState = -1;
      } else {
        this.starState = 1;
      }
    },
    setStar() {
      this.$fetch
        .setStar({
          shareId: this.shareId,
          starState: this.shareId
        })
        .then(res => {})
        .catch(err => {});
    },
    refresh() {
      this.getQuestionList();
    },
    // 获取better scroll 滚动距离
    scrollHeight() {
      const that = this;
      this.myScroll.on("scroll", pos => {
        if (that.keepAlive) {
          // console.log(pos.x + "~" + pos.y);
          // store.commit("recordScroll", pos.y);
          this.scrtop = pos.y;
        }
      });
    }
  }
};
</script> 
<style scoped lang='less'>
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
  bottom: 0;
  z-index: -1;
  &.showInput {
    z-index: 2;
  }
}
.system-questions {
  // width: 100%;
  width: 92%;
  height: 100%;
  // padding: 0 15px;
  margin: 0 4%;
  box-sizing: border-box;
  overflow: hidden;
  // border-top: 1px solid #e1e4e9;
}
</style>