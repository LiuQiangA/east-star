<template>
  <div class="system-ext" ref="wrapper">
    <div class="content">
      <div class="box" v-for="(item,index) in courseContents" :key="item.coursecontentid">
        <div class="top">作业{{index+1}}</div>

        <div class="type_first" v-if="item.logoImg" @click="hideHead(item.content,item.sourceType)">
          <!-- <a :href="item.content"> -->
          <div class="lianjie" v-html="item.content" hidden></div>
          <div class="type_first_left">
            <div class="img">
              <img :src="item.logoImg" alt="logoImg" width="100%" height="100%" />
            </div>
          </div>
          <!-- </a> -->
          <!-- <a :href="item.content"> -->
          <div class="type_first_right">
            <div class="type_first_right-top">{{item.title}}</div>
            <!-- <div class='type_first_right-bottom'>
              <div class='star_pick_img img'></div>
              <div class='star_num'>1212</div>
            </div>-->
          </div>
          <!-- </a> -->
          <p v-if="item.sourceType !== 0" class="from"><img src="../assets/images/youdao.png" alt="">来自有道数学</p>
        </div>

        <div class="type_second" @click="hideHead(item.content,item.sourceType)" v-else>
          <div class="type_second_right">
            <div class="type_second_right-top">
              <!-- <span class="color_left">【选择】</span> -->
              <span class="color_right">{{item.title}}</span>
            </div>
            <!-- <div class="type_second_right-bottom">
              <div class="star_pick_img img"></div>
              <div class="star_num">1212</div>
            </div>-->
          </div>
          <p v-if="item.sourceType !== 0" class="from"><img src="../assets/images/youdao.png" alt="">来自有道数学</p>
        </div>
      </div>
      <div class="noMore" v-if="isEnd">没有更多啦~</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "extendPractice",
  data() {
    return {
      href: "",
      courseContents: [],
      isEnd: false,
      totalPage: "",
      total: "",
      // 接口参数
      option: {
        activityid: this.$route.query.activityid || "280",
        studentId: this.$route.query.studentId || "",
        classId: this.$route.query.classId || ""
      },
      // scroll 配置
      options: {
        click: true
      }
    };
  },
  mounted() {
    this.initScroll();
    this.getStudyDetail();
    // setTimeout(() => {
    //   console.log($(".lianjie a").attr("href"));
    //   this.href = $(".lianjie a").attr("href");
    // }, 1000);
    this.$bridge.callhandler("hiteHead", { hiteHead: false }, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
  },
  methods: {
    hideHead(url,sourceType) {
      // this.$bridge.callhandler("toIos", { url: url, sourceType: sourceType }, data => {
      //   // vm.ddd = data;
      //   // 处理返回数据
      // });
      // window.location.href = url;
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(!isIOS){
        // this.$router.push("/extendPracticeDet?url"+url);
        this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {
          // vm.ddd = data;
          // 处理返回数据
        });
        window.location.href = url;
      } else {
        console.log("iOS")
        if(sourceType == 0){
          console.log("非有道")
          this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {
            // vm.ddd = data;
            // 处理返回数据
          });
          window.location.href = url;
        } else {
          console.log("有道")
          this.$bridge.callhandler("toIos", { url: url, sourceType: sourceType }, data => {
            // vm.ddd = data;
            // 处理返回数据
          });
        }
        
      }
    },
    // goDet(url) {
    //   this.$router.push("/extendPracticeDet?url="+url)
    // },
    // 初始化scroll
    initScroll() {
      this.myScroll = new this.$BScroll(this.$refs.wrapper, this.options);
      // this.pullDownEvent();
      // this.pullUpLoadEvent();
    },
    // finishPulling() {
    //   this.myScroll.finishPullDown(); // 结束下拉刷新
    //   this.myScroll.finishPullUp(); // 结束上拉加载更多
    //   this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
    // },
    // pullDownEvent() {
    //   this.myScroll.on("pullingDown", () => {
    //     this.isEnd = false;
    //     this.courseContents = [];
    //     console.log("下拉刷新");
    //     this.option.pageNo = 1;
    //     this.getStudyDetail();
    //   });
    // },
    // pullUpLoadEvent() {
    //   this.myScroll.on("pullingUp", () => {
    //     console.log("上拉加载");
    //     if (this.option.pageNo <= this.totalPage + 1) {
    //       this.option.pageNo++;
    //       this.getStudyDetail();
    //       this.isEnd = false;
    //     } else {
    //       this.isEnd = true;
    //     }
    //   });
    // },
    // 获取list
    getStudyDetail() {
      this.$fetch
        .getStudyDetail(this.option)
        .then(res => {
          this.courseContents = this.courseContents.concat(
            res.data.studyDetail.courseContents
          );
          // this.total = res.data.total;
          // this.totalPage = this.total / 10;
          // this.finishPulling();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script> 
<style scoped lang='less'>
a {
  text-decoration: none;
}
.lianjie {
  width: 100%;
  height: 7.59375rem;
  position: absolute;
}
.system-ext {
  height: 100%;
  overflow: hidden;
}
.content {
  width: 100%;
  height: 100%;
}

.box {
  position: relative;
  margin: 0.65625rem auto 0;
  width: 21.53125rem;
  height: 7.59375rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(79, 104, 128, 0.25);
  border-radius: 0.3125rem;
  position: relative;

  .top {
    position: absolute;
    width: 3.5rem;
    left: 0.53125rem;
    height: 1.125rem;
    background: url(../assets/images/ext_bg.png) no-repeat;
    background-size: contain;
    font-size: 12px;
    color: #ffffff;
    padding-left: 0.9375rem;
    line-height: 1.125rem;
  }
}

.noMore {
  height: 5rem;
  line-height: 5rem;
  text-align: center;
  font-size: 14px;
}

.type_first {
  display: flex;
  overflow: hidden;
  .type_first_left {
    width: 9.0625rem;
    .img {
      height: 4.9375rem;
      width: 7.1875rem;
      background: #ccc;
      margin-top: 1.75rem;
      margin-left: 0.9375rem;
      border-radius: 0.3125rem;
    }
  }

  .type_first_right {
    flex: 1;
    .type_first_right-top {
      margin-top: 1.75rem;
      height: 3.40625rem;
      color: #31445a;
    }
    .type_first_right-bottom {
      display: flex;
      .img {
        width: 1.25rem;
      }
    }
  }
}

.star_img {
  height: 1.375rem;
  width: 1.25rem;
  background: url(../assets/images/star.png) no-repeat center center;
  background-size: contain;
}
.star_pick_img {
  height: 1.375rem;
  width: 1.25rem;
  background: url(../assets/images/star_pick.png) no-repeat center center;
  background-size: contain;
}
.star_num {
  flex: 1;
  height: 1.375rem;
  line-height: 1.375rem;
  font-size: 16px;
  color: #f7ba2a;
}
.from {
    width: 100px;
    height: 24px;
    font-size: 14px;
    color: #4f6880;
    background: rgba(152, 161, 172, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px 0 10px 0;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 12px;
    color: #fff;
    img{
      width: 14px;
      margin-right: 4px; 
    }
  }
.type_second {
  padding-left: 1.5625rem;
  overflow: hidden;
  .type_second_right {
    .type_second_right-top {
      padding: 0 25px;
      margin-top: 2.3125rem;
      margin-bottom: 1.25rem;
      color: #31445a;

      .color_left {
        color: #a4a7ab;
        font-size: 16px;
      }
      .color_right {
        color: #4f6880;
        font-size: 16px;
      }
    }
    .type_second_right-bottom {
      display: flex;
      .img {
        width: 1.25rem;
      }
    }
  }
}
</style>