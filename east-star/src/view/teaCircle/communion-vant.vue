<template>
  <div style="position:relative; height:100%; margin-top:60px">
    <div
      v-show="haveNet"
      class="padding"
      style="position:relative; height:100%;"
      :class="{'hidden':showInput}"
    >
      <div style="height:100%; position:relative;border-top: 1px solid #E1E4E9" v-if="isLogin">
        <div class="system-communion">
          <div class="content">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :error.sync="error"
                error-text="请求失败，点击我重新加载"
                :finished="finished"
                finished-text="没有更多了"
                :immediate-check="false"
                :offset="offset"
                @load="getShareList"
              >
                <!-- 加载的内容-->
                <shareList
                  v-if="newList.length"
                  ref="list"
                  :data="newList"
                  :zan="zan"
                  @commit="commit"
                  @message="message"
                  @praise="praise"
                  @getIndex="getIndex"
                ></shareList>
                <div v-else class="zanwu">
                  <i class="iconfont icon-wushuju"></i>
                </div>
              </van-list>
            </van-pull-refresh>
            <!-- <shareList
              v-if="newList.length"
              ref="list"
              :data="newList"
              :zan="zan"
              @commit="commit"
              @message="message"
              @praise="praise"
              @getIndex="getIndex"
            ></shareList>-->
            <!-- <div v-else class="no-data">
            <img src="../../assets/images/noData.png" />
            <p>暂无数据</p>
            </div>-->
            <div class="noMore" v-if="isEnd">没有更多啦~</div>
          </div>
        </div>
      </div>
      <!-- login -->
      <login v-else refresh="refresh1"></login>
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
    <div class="netError" v-show="!haveNet">
      <img src="../../assets/images/netError.png" width="70%" alt="无网络" />
      <p class="err-ms">您的网络好像不太给力，请稍后再试</p>
      <div class="refresh">点击刷新</div>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import shareList from "./components/shareList";
import commit from "@/components/commit";
import Ls from "@/config/storage";
import login from "../login";
import { Toast } from "mint-ui";
import { Net } from "@/mixin/net";
import { Commit } from "@/mixin/commit";
export default {
  name: "communion",
  mixins: [Net, Commit],
  data() {
    return {
      isLoading: false, //控制下拉刷新的加载动画
      loading: false, //控制上拉加载的加载动画
      error: false, //
      finished: false, //控制在页面往下移动到底部时是否调用接口获取数据
      offset: 40,
      myScroll: {},
      scrtop: "",
      isLogin: true,
      keepAlive: false,
      totalPage: "",
      option: {
        pageNo: 1,
        pageSize: 10,
        type: 1 // 区分分享交流和我的分享交流标识  1：分享交流  2：我的分享交流
      },
      // scroll 配置
      options: {
        probeType: 3,
        click: true,
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
      total: "",
      isEnd: false,
      shareId: "", // 分享id
      starState: "", // 点赞状态（1点赞  -1取消点赞）
      zan: false //是否点过赞
    };
  },
  components: {
    shareList,
    commit,
    login
  },
  created() {
    this.init();
  },
  mounted() {
    const vm = this;
    this.$bridge.registerhandler("refresh1", (data, responseCallback) => {
      // vm.native_data = data;
      console.log("1");
      console.log("Ls");
      console.log(Ls);
      console.log("data");
      console.log(data);
      console.log(typeof data);
      Ls.setItem("userId", JSON.parse(data).userId);
      Ls.setItem("auth", JSON.parse(data).auth);
      vm.init();
      console.log("vm.isLogin");
      console.log(vm.isLogin);
      vm.isLogin = true;
    });
    this.$bridge.callhandler("hiteBtn", { hiteBtn: "false" }, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
    // this.initScroll();
    // this.getShareList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.meta.keepAlive == true) {
        vm.keepAlive = true;

        // store.commit('recordScroll', document.documentElement.scrollTop || document.body.scrollTop); // document.body.scrollTop一定要加不然iOS上会失效，本人亲测，踩坑
      }
      if (from.meta.keepAlive == true) {
        vm.keepAlive = true;
        // vm.myScroll.scrollTo(0, vm.scrtop);
        console.log("999");
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    // ...
    this.keepAlive = false;
    next();
  },
  // activated() {
  //   let that = this;
  //   this.scrollHeight();
  //   console.log("activated");
  //   console.log(this.scrtop);
  //   // this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
  //   this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
  //   this.myScroll.scrollTo(0, that.scrtop);
  //   this.myGlobal.setScroll(this.myScroll);
  // },
  methods: {
    // 下拉刷新
    onRefresh() {
      // this.courseOption.curr_page = "1";
      this.init();
    },
    // 初始化scroll
    // initScroll() {
    //   this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
    //   this.myGlobal.setScroll(this.myScroll);
    //   this.pullDownEvent();
    //   this.pullUpLoadEvent();
    // },
    // finishPulling() {
    //   this.myScroll.finishPullDown(); // 结束下拉刷新
    //   this.myScroll.finishPullUp(); // 结束上拉加载更多
    //   this.$nextTick(() => {
    //     this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
    //   });
    // },
    // pullDownEvent() {
    //   this.myScroll.on("pullingDown", () => {
    //     this.isEnd = false;
    //     // this.newList = [];
    //     console.log("下拉刷新");
    //     this.option.pageNo = 1;
    //     this.init();
    //   });
    // },
    // pullUpLoadEvent() {
    //   this.isEnd = false;
    //   this.myScroll.on("pullingUp", () => {
    //     console.log("上拉加载");
    //     if (this.option.pageNo <= this.totalPage + 1) {
    //       this.option.pageNo++;
    //       this.getShareList();
    //       this.isEnd = false;
    //     } else {
    //       this.isEnd = true;
    //     }
    //   });
    // },
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
    },
    // 处理横图竖图
    // whImg(item,img,index,arr) {
    //   return new Promise((resolve, reject)=>{
    //     img.onload = function() {
    //       // 打印
    //       console.log(
    //         "width:" + img.width + ",height:" + img.height,
    //         "index" + index
    //       );
    //       console.log(img.width, img.height);
    //       if (img.width > img.height) {
    //         arr[index].imgW = true;
    //         arr[index].imgH = false;
    //         resolve(arr)
    //       } else {
    //         arr[index].imgW = false;
    //         arr[index].imgH = true;
    //         resolve(arr)
    //       }
    //       arr[index].b = 1;
    //       console.log(item, "9");
    //     };
    //   })
    // },
    // init
    init() {
      this.option.pageNo = 1;
      this.$fetch
        .getShareList(this.option)
        .then(res => {
          this.$nextTick(() => {
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
              this.newList = res.data.newList;
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              // this.finishPulling();
              // this.initScroll();
              this.isLoading = false;
            this.error = false;
            }, 1500);
          });
        })
        .catch(err => {
          this.isLoading = false;
            this.error = true;
          console.log(err);
          if (err.response.state == "False") {
            this.isLogin = false;
          }
        });
    },
    // 获取list
    getShareList() {
      console.log("app调用到我了getShareList");
      this.$fetch
        .getShareList(this.option)
        .then(res => {
          this.$nextTick(() => {
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
              this.newList = this.newList.concat(res.data.newList);
              this.total = res.data.total;
              this.totalPage = this.total / 10;
              // this.finishPulling();
               this.loading = false;  
               this.option.pageNo++;
               if (this.newList.length >= res.data.total) {
            this.finished = true;
          }
            }, 1000);
          });
        })
        .catch(err => {
          this.loading = false;
          this.error = true;
          console.log(err);
          if (err.response.state == "False") {
            this.isLogin = false;
          }
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
          shareType: 3
        })
        .then(res => {})
        .catch(err => {});
    }
  }
  // destroyed() {
  //   // Ls.removeItem("list");
  //   // Ls.removeItem("index");
  //   // 是否点赞，true 进行调用setStar 否则不进行任何操作
  //   if(!this.zan) return
  //   this.setStar()
  // },
};
</script> 
<style scoped lang='less'>
.pop-commit {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
}
.padding {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
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
.system-communion {
  height: 100%;
  overflow: hidden;
}
.commitCont {
  position: fixed;
  left: 0;
  // bottom: 20px;
  bottom: 0;
  display: none !important;
  
  &.showInput {
    display: flex !important;
  }
}
</style>