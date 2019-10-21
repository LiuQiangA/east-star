<template>
  <div class="system-questions" ref="wrapper">
    <div class="content" v-if="isLogin">
      <shareList
        v-if="empty"
        :data="newList"
        :zan="zan"
        :isD="isD"
        type="5"
        @message="message"
        @praise="praise"
        @deleteShare="deleteShare"
        @commit="commit"
        @getIndex="getIndex"
      ></shareList>
      <div v-else class="no-data">
        <!-- <img src="../../assets/images/noData.png" /> -->
        <p>暂无内容</p>
      </div>
      <div class="noMore" v-if="isEnd">没有更多啦~</div>
    </div>
    <!-- login -->
    <login v-else></login>
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
import login from "../login";
import shareList from "./components/shareList";
import { Indicator, MessageBox, Toast } from "mint-ui";
import Ls from "@/config/storage";
import commit from "@/components/commit";
import { Commit } from "@/mixin/commit";
export default {
  name: "myClassCircle",
  mixins: [Commit],
  data() {
    return {
      empty: true,
      isLogin: true,
      LSuserId: "",
      isD: true,
      totalPage: "",
      option: {
        pageNo: 1,
        pageSize: 10,
        type: 2 // 区分班级圈和我的班级圈状态标识  1:班级圈  2：我的班级圈
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
          threshold: 20 // 开始加载的时机
        },
        startY: 0
      },
      newList: [],
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
    shareList,
    commit,
    login
  },
  created() {
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
  },
  mounted() {
    const vm = this;
    this.initScroll();
    this.init();
    this.$bridge.registerhandler("refresh", (data, responseCallback) => {
      // vm.native_data = data;
      vm.init();
    });
    this.$bridge.callhandler("changeTitle", {title: '我的班级圈'}, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
  },
  methods: {
    // 初始化scroll
    initScroll() {
      this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
      this.myGlobal.setScroll(this.myScroll);
      this.pullDownEvent();
      this.pullUpLoadEvent();
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
        // this.newList = [];
        console.log("下拉刷新");
        this.option.pageNo = 1;
        this.init();
      });
    },
    pullUpLoadEvent() {
      this.isEnd = false;
      this.myScroll.on("pullingUp", () => {
        console.log("上拉加载");
        if (this.option.pageNo <= this.totalPage + 1) {
          this.option.pageNo++;
          this.getClassRingList();
          this.isEnd = false;
        } else {
          this.isEnd = true;
        }
      });
    },
    // 获取list
    getClassRingList() {
      this.$fetch
        .getClassRingList(this.option)
        .then(res => {
          this.$nextTick(() => {
            res.data.classShareList.forEach((item, index, arr) => {
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
              this.newList = this.newList.concat(res.data.classShareList);
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              this.finishPulling();
            }, 1000);
          });
          // this.newList = this.newList.concat(res.data.classShareList);
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // this.finishPulling();
          // console.log(this.newList);
        })
        .catch(err => {
          console.log(err);
          // if (err.response.state == "False") {
          //   this.isLogin = false;
          // }
        });
    },
    // 获取list
    init() {
      this.option.pageNo = 1;
      this.$fetch
        .getClassRingList(this.option)
        .then(res => {
          this.$nextTick(() => {
            res.data.classShareList.forEach((item, index, arr) => {
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
              this.newList = res.data.classShareList;
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              this.finishPulling();
              // this.initScroll()
            }, 1500);
          });
          // this.newList = res.data.classShareList;
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // // this.isLogin = true;
          // this.finishPulling();
          // console.log(this.newList);
          if(!res.data.classShareList.length){
            this.empty = false;
          }
        })
        .catch(err => {
          console.log(err);
          // if (err.response.state == "False") {
          //   this.isLogin = false;
          // }
        });
    },
    // 删除分享
    deleteShare(id) {
      console.log(id); // id为分享id
      MessageBox.confirm("确定执行此操作?").then(action => {
        this.$fetch
          .setDelClassRingShare({
            classRingId: id
          })
          .then(res => {
            // Toast({
            //   message: "操作成功",
            //   duration: 1500
            // });
            this.init();
          })
          .catch(err => {});
      });
    },
    // 提交评论
    submit(comment) {
      this.showInput = false;
      if (comment) {
        this.commitOption.comment = comment;
        this.commitOption.typeId = 5;
        this.$fetch
          .setPostComment(this.commitOption)
          .then(res => {
            this.$refs.commit.comment = "";
            setTimeout(() => {
              this.showInput = false;
              this.commitOption.comment = "";
            }, 20);
            this.$fetch
              .getClassRingList(this.option)
              .then(res => {
                this.$nextTick(() => {
                  this.newList = res.data.classShareList;
                  this.total = res.data.total;
                  this.totalPage = this.total / 10;
                  this.finishPulling();
                });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {});
      }
    },
    // message(item) {
    //   console.log(item);
    // },
    praise(shareId) {
      console.log(shareId);
      this.shareId = shareId;
      this.zan = !this.zan;
      if (this.starState == 1) {
        this.starState = -1;
        this.setStar();
      } else {
        this.starState = 1;
        this.setStar();
      }
    },
    setStar() {
      Indicator.close();
      this.$fetch
        .setStar({
          shareId: this.shareId,
          starState: this.starState,
          shareType: 5
        })
        .then(res => {})
        .catch(err => {});
    },
    refresh() {
      this.getClassRingList();
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
  // bottom: 20px;
  bottom: 0;
  z-index: -1;
  &.showInput {
    z-index: 2;
  }
}
.system-questions {
  height: 100%;
  overflow: hidden;
}
</style>