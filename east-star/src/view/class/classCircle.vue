<template>
  <div class="system-communion" ref="wrapper">
    <div class="content">
      <shareList
        v-if="empty"
        ref="list"
        :data="newList"
        :zan="zan"
        @message="message"
        @praise="praise"
        @commit="commit"
        @getIndex="getIndex"
        @deleteShare="deleteShare"
      ></shareList>
      <div v-else class="no-data">
        <!-- <img src="../../assets/images/noData.png" /> -->
        <p>暂无内容</p>
      </div>
      <div class="noMore" v-if="isEnd">没有更多啦~</div>
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
import { MessageBox, Toast } from "mint-ui";
import { Commit } from "@/mixin/commit";
import shareList from "./components/shareList";
import commit from "@/components/commit";
import Ls from "@/config/storage";
export default {
  name: "classCircle",
  mixins: [Commit],
  data() {
    return {
      noContent: false,
      empty: true,
      showDelPop: false,
      totalPage: "",
      // 发布评论
      commitOption: {
        typeId: 5 //内容类别  2教研问答  3前言分享  4记录  5班级动态
      },
      option: {
        pageNo: 1,
        pageSize: 10,
        type: 1, // 区分班级圈和我的班级圈状态标识  1:班级圈  2：我的班级圈
        classId: this.$route.query.classId || "2350"
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
      zan: false //是否点过赞
    };
  },
  components: {
    shareList,
    commit
  },
  mounted() {
    const vm = this;
    // this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {
    //   // vm.ddd = data;
    //   // 处理返回数据
    // });
    this.initScroll();
    this.init();
    this.$bridge.registerhandler("refresh", (data, responseCallback) => {
      // vm.native_data = data;
      vm.init();
    });
    this.$bridge.callhandler("changeTitle", {title: '班级圈'}, data => {
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
          // if(!res.data.classShareList.length){
          //   this.noContent = true;
          // }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // init list
    init() {
      this.option.pageNo = 1;
      this.$fetch
        .getClassRingList(this.option)
        .then(res => {
          console.log(res.data.classShareList.length)
          if(res.data.classShareList.length==0){
            this.empty = false;
          } else {
            this.empty = true;
          }
          this.isEnd = false;
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
          // this.finishPulling();
        })
        .catch(err => {
          console.log(err);
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
            this.init();
            // Toast({
            //   message: "操作成功",
            //   duration: 1500
            // });
            // setTimeout(() => {
            //   this.init();
            // }, 1500);
          })
          .catch(err => {});
      });
    },
    praise(shareId, starState) {
      console.log(shareId, starState);
      this.shareId = shareId;
      this.zan = !this.zan;
      if (starState) {
        this.starState = -1;
        this.setStar();
      } else {
        this.starState = 1;
        this.setStar();
      }
    },
    setStar() {
      this.$fetch
        .setStar({
          shareId: this.shareId,
          starState: this.starState,
          shareType: 5
        })
        .then(res => {})
        .catch(err => {});
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
            this.init();
            // this.$fetch
            //   .getClassRingList(this.option)
            //   .then(res => {
            //     this.newList = res.data.newList;
            //     this.total = res.data.total;
            //     this.totalPage = this.total / 10;
            //     this.finishPulling();
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          })
          .catch(err => {});
      }
    }
  }
  // destroyed() {
  //   Ls.removeItem("list");
  //   Ls.removeItem("index");
  // },
};
</script> 
<style scoped lang='less'>
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
.system-communion {
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  overflow: hidden;
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
</style>