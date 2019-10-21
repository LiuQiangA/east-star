<template>
  <div style="position:relative; height:100%;">
    <div v-show="haveNet" class="system-consult" ref="wrapper">
      <div class="content">
        <div style="width:100%;height:10px"></div>
        <div class="top">
          <Swiper v-model="index" :autoplayTime="autoplayTime" :type='type'>
            <template v-for="(item,index) in bannerList">
              <swipe-item :key="index">
                <img
                  v-if="item.bannerImgUrl"
                  :src="item.bannerImgUrl"
                  @click="goTo(item.serviceNewId,item.bannerImgUrl,item.title)"
                />
                <img v-else :src="item.bannerImgUrl" />
              </swipe-item>
            </template>
          </Swiper>
        </div>

        <div class="center" ref="personWrap">
          <div ref="personTab">
            <span
              :class="['center_tab_box', index == tabListIndex ? 'tab_check' : '']"
              v-for="(item, index) in tabList"
              :key="item.id"
              @click="tab(item.id,index)"
            >{{item.typeName}}</span>
          </div>
        </div>

        <div class="bottom" v-if="data.length">
          <div
            v-for="item in data"
            class="consult_box van-hairline--bottom"
            @click="goD(item.id,item.url,item.title)"
            :key="item.id"
          >
            <div class="consult_box_left">
              <img :src="item.url" />
            </div>
            <div class="consult_box_right">
              <div class="consult_box_right_top">{{item.title}}</div>
              <div class="consult_box_right_bottom">
                <div class="consult_box_right_date">{{item.updatedAt}}</div>
                <div class="consult_box_right_read">
                  <div>
                    <img src="../../assets/images/read_num.png" />
                  </div>
                  <div>{{item.viewNum}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="noMore" v-if="isEnd">没有更多啦~</div>
        </div>
        <!-- <div v-else class="no-data">
        <img src="../../assets/images/noData.png" />
        <p>暂无数据</p>
        </div>-->
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
import { Swiper, SwipeItem } from "@/components/starSwiper";
import { Net } from "@/mixin/net";

export default {
  name: "consult",
  mixins: [Net],
  data() {
    return {
      type: 1,
      autoplayTime: 3000,
      scrtop: "",
      keepAlive: false,
      total: "", // 数据总数
      totalPage: "", // 总页数
      option: {
        pageNo: 1,
        pageSize: 10,
        serviceTypeId: 1 //教研主题ID  1.园所特色活动 2.家园共育 3.教研风采
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
      index: 0,
      // banner list
      bannerList: [],
      tab_box: [
        { typeName: "园所特色活动", fal: true, id: "/teaCircle/consult" },
        { typeName: "家园共育", fal: false, id: "/teaCircle/communion" },
        { typeName: "教研风采", fal: false, id: "/teaCircle/questions" }
      ],
      tabList: [],
      tabListIndex: 0,
      data: [],
      isEnd: false
    };
  },
  components: {
    Swiper,
    SwipeItem
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
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    // ...
    this.keepAlive = false;
    next();
  },
  // activated() {
  //   this.initScroll();
  //   console.log("activated");
  //   console.log(this.$route);
  // },
  created() {
    this.getBannerList();
    this.getColumnGroup().then(res => {
      this.option.serviceTypeId = res[0].id;
      this.init();
    });
  },
  mounted() {
    let vm = this;
    this.initScroll();
    // this.getServiceNewList();
    this.$bridge.registerhandler("refresh", (data, responseCallback) => {
      // vm.native_data = data;
      vm.init();
    });
  },
  methods: {
    // 获取banner
    getBannerList() {
      this.$fetch
        .getBannerList()
        .then(res => {
          this.bannerList = res.data.bannerList;
        })
        .catch(err => {});
    },
    // banenr 跳转
    goTo(id, url, title) {
      // this.$router.push("/consultDetails?id=" + id);
      let idString = String(id);
      console.log(idString);
      this.$bridge.callhandler(
        "gocDet",
        { id: idString, imgUrl: url, title: title },
        data => {
          // vm.ddd = data;
          // 处理返回数据
        }
      );
    },
    // 初始化scroll
    initScroll() {
      let that = this;
      this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
      this.pullDownEvent();
      this.pullUpLoadEvent();
      this.scrollHeight();
      // 滚动到上次离开时候的位置
      this.myScroll.scrollTo(0, that.scrtop);
    },
    personScroll(num) {
      // 默认有六个li子元素，每个子元素的宽度为120px
      let width = num * 110;
      this.$refs.personTab.style.width = width + "px";
      // this.$nextTick 是一个异步函数，为了确保 DOM 已经渲染
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new this.$BScroll(this.$refs.personWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            // 忽略竖直方向的滚动
            scrollY: false,
            eventPassthrough: "vertical"
          });
        } else {
          this.scroll.refresh();
        }
      });
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
      this.isEnd = false;
      this.myScroll.on("pullingUp", () => {
        console.log("上拉加载");
        if (this.option.pageNo <= this.totalPage + 1) {
          this.option.pageNo++;
          this.getServiceNewList();
        } else {
          this.isEnd = true;
        }
      });
    },
    // 获取列表
    getServiceNewList() {
      this.$fetch
        .getServiceNewList(this.option)
        .then(res => {
          console.log("成功");
          this.total = res.data.total;
          this.data = this.data.concat(res.data.serviceList);
          this.totalPage = this.total / 10;
          this.finishPulling();
        })
        .catch(err => {
          console.log(err.data.error);
        });
    },
    init() {
      this.option.pageNo = 1;
      this.$fetch
        .getServiceNewList(this.option)
        .then(res => {
          console.log("成功");
          this.total = res.data.total;
          this.data = res.data.serviceList;
          this.totalPage = this.total / 10;
          this.finishPulling();
        })
        .catch(err => {
          console.log(err.data.error);
        });
    },
    goD(id, url, title) {
      // this.$router.push("/consultDetails?id=" + id);
      let idString = String(id);
      console.log(idString);
      this.$bridge.callhandler(
        "gocDet",
        { id: idString, imgUrl: url, title: title },
        data => {
          // vm.ddd = data;
          // 处理返回数据
        }
      );
    },
    tab(id, index) {
      this.tabListIndex = index;
      this.option.serviceTypeId = id;
      this.option.pageNo = 1;
      this.init();
    },
    // getColumnGroup动态获取教研资讯栏目组
    getColumnGroup() {
      return new Promise((resolve, reject) => {
        this.$fetch
          .getColumnGroup({
            pageNo: "1",
            pageSize: "10"
          })
          .then(res => {
            this.tabList = res.data.list;
            // this.tabList = this.tabList.concat(this.tab_box)
            this.personScroll(this.tabList.length);
            resolve(this.tabList);
          })
          .catch(err => {
            reject;
          });
      });
    },
    // 获取better scroll 滚动距离
    scrollHeight() {
      const that = this;
      this.myScroll.on("scroll", pos => {
        if (that.keepAlive) {
          console.log(pos.x + "~" + pos.y);
          // store.commit("recordScroll", pos.y);
          this.scrtop = pos.y;
        }
      });
    }
  }
};
</script> 
<style lang="less">
// .top {
//   .c-swipe-pagination {
//     display: none;
//   }
// }
</style>
<style scope lang='less'>
.system-consult {
  height: 100%;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  overflow: hidden;
  .content {
    min-height: 101%;
  }
  .no-data {
    width: 100%;
    padding: 5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #0081ff;
    img {
      display: block;
      width: 5rem;
    }
    p {
      font-size: 0.875rem;
      margin-top: 0.625rem;
    }
  }
  .top {
    width: 100%;
    // height: 9.8125rem;
    position: relative;
    .c-swipe {
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 158.5px;
      border-radius: 4px;
      // width: 20.625rem;
      // // height: 100%;
      // // height: 9.8125rem;
    }
  }
  .wh_show_bgcolor {
    background: #0081ff;
  }

  .center {
    width: 100%;
    overflow: hidden;
    word-break: keep-all;
    margin: 30px 0;
    // height: 4.71875rem;
    // line-height: 4.71875rem;
    .center_tab_box {
      padding-right: 1rem;
      color: #31445a;
      font-size: 1.0625rem;
      font-weight: bold;
    }
    .tab_check {
      color: #0081ff;
    }
  }

  .noMore {
    height: 10rem;
    line-height: 5rem;
    text-align: center;
    font-size: 14px;
  }

  .consult_box {
    display: flex;
    // height: 6.375rem;
    padding-bottom: 15px;
    margin-bottom: 15px;
    // border-bottom: 1px solid rgba(225, 228, 233, 1);
    align-items: center;
    .consult_box_left {
      width: 7.5rem;
      height: 4.5rem;
      // margin-top: 0.9375rem;
      margin-right: 0.9375rem;
      img {
        width: 7.5rem;
        height: 4.5rem;
      }
    }
    .consult_box_right {
      flex: 1;
      .consult_box_right_top {
        // margin-top: 0.9375rem;
        font-size: 0.9375rem;
        color: #31445a;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .consult_box_right_bottom {
        margin-top: 1.25rem;
        font-size: 0.625rem;
        color: #c1c1c1;
        overflow: hidden;
        .consult_box_right_date {
          float: left;
        }
        .consult_box_right_read {
          float: right;
          overflow: hidden;
          & > div {
            float: left;
          }
          img {
            height: 0.53125rem;
            width: 1rem;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>