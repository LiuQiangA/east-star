<template>
  <div class="content">
    <!-- 课件 -->
    <div
      class="kejian"
      v-if="item.resourceClassicsName.indexOf('教学课件')!==-1"
      v-for="item in resourceClassicsList"
      :key="item.resourceClassicsId"
    >
      <embed
        v-if="!hengping"
        :style="height"
        ref="kejian"
        class="cont"
        :src="item.courseResourceList[0].courseResourceUrl"
      />
      <i
        @click="fullScring(item.courseResourceList[0].courseResourceUrl)"
        class="full iconfont icon-webicon311"
      ></i>
      <!-- <div class="popIfr pop" :style="heightIfra" v-show="hengping">
        <iframe
          :style="heightIfra"
          :src="item.courseResourceList[0].courseResourceUrl"
          frameborder="0"
        ></iframe>
        <i @click="fullScring" class="full iconfont icon-suoxiao"></i>
      </div>-->
    </div>
    <!-- 非课件 -->
    <div class="system-activityDetails" ref="warper">
      <!-- 活动详情 tab -->
      <div class="system-activityDetails_top" ref="tabcontent">
        <div
          class="system-activityDetails_list"
          :class="{'system-activityDetails_active':item.active}"
          v-for="(item,index) in resourceClassicsList"
          v-show="item.resourceClassicsName.indexOf('教学课件')== -1"
          @click="tab(item,index)"
          :key="item.resourceClassicsId"
        >
          <span>{{item.resourceClassicsName}}</span>
        </div>
      </div>
    </div>
    <!-- content -->
    <!-- <itemContent :resourceClassicsList="resourceClassicsList" :pageNum='pageNum' :showWath="showWath" :changeNum='changeNum'></itemContent> -->
    <div class="warperCont" ref="warperCont">
      <div class="content">
        <div
          class="jiaoan"
          v-for="item in resourceClassicsList"
          v-show="item.resourceClassicsName.indexOf('教学课件')== -1"
          :key="item.resourceClassicsId"
        >
          <div v-if="item.active && item.courseResourceList[0].courseResourceExt=='pdf'">
            <!-- <embed class="cont" :src="item.courseResourceList[0].courseResourceUrl" alt="pdf"> -->

            <div style="position:relative">
              <pdf
                :src="item.courseResourceList[0].courseResourceUrl"
                :page="currentPage"
                @num-pages="pageCount=$event"
                @page-loaded="currentPage=$event"
                @loaded="loadPdfHandler"
              ></pdf>
              <p class="arrow">
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
                {{currentPage}} / {{pageCount}}
                <span
                  @click="changePdfPage(1)"
                  class="turn"
                  :class="{grey: currentPage==pageCount}"
                >下一页</span>
                <!-- <i @click="fullPdf" class="full iconfont icon-webicon311"></i> -->
              </p>
            </div>
            <div class="popIfr pop" :style="heightIfra" v-show="bigPdf">
              <pdf
                class="pdf-item"
                :style="pdfStyle"
                :src="item.courseResourceList[0].courseResourceUrl"
                :page="currentPage"
                @num-pages="pageCount=$event"
                @page-loaded="currentPage=$event"
                @loaded="loadPdfHandler"
              ></pdf>
              <p class="arrow">
                <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">上一页</span>
                {{currentPage}} / {{pageCount}}
                <span
                  @click="changePdfPage(1)"
                  class="turn"
                  :class="{grey: currentPage==pageCount}"
                >下一页</span>
                <!-- <i @click="fullPdf" class="full iconfont icon-suoxiao"></i> -->
              </p>
            </div>
          </div>
          <div v-if="item.active && item.courseResourceList[0].courseResourceExt=='html'">
            <embed
              class="cont"
              :style="height"
              :src="item.courseResourceList[0].courseResourceUrl"
              alt="html"
            />
          </div>
          <div v-if="item.active && item.courseResourceList[0].courseResourceExt=='mp3'">
            <!-- <audio
              v-for="i in item.courseResourceList"
              :key="i.courseResourceId"
              class="cont"
              :style="height"
              :src="i.courseResourceUrl"
              controls="controls"
            >Your browser does not support the audio element.</audio>-->
            <!-- <embed
              v-for="i in item.courseResourceList"
              :key="i.courseResourceId"
              class="cont"
              :style="height"
              :src="i.courseResourceUrl"
              alt="mp3"
            />-->
            <div
              v-for="(i,index) in item.courseResourceList"
              :key="i.courseResourceId"
              class="audio"
              v-if="showMp3"
              :data-courseResourceUrl = i.courseResourceUrl
              @click="playAudio(index,i.courseResourceUrl)"
            >
              <p class="title">{{i.courseResourceName}}</p>
              <i class="iconfont icon-pause" v-if="audioIndex == index"></i>
              <i class="iconfont icon-bofang" v-if="audioIndex !== index"></i>
              <!-- <audio
                class="myAudio"
                :src="i.courseResourceUrl"
                controls
              >Your browser does not support the audio element.</audio> -->
              <!-- <vue-plyr :emit="['play','pause']" @play="play" @pause="pause">
                <audio crossorigin playsinline>
                  <source :src="i.courseResourceUrl" type="audio/mp3" />
                </audio>
              </vue-plyr>-->
            </div>
          </div>
          <div
            class="myImgCont"
            v-if="item.active && item.courseResourceList[0].courseResourceExt=='jpg'"
          >
            <div class="my-img" v-for="i in item.courseResourceList" :key="i.courseResourceId">
              <img width="100%" :src="i.courseResourceUrl" />
              <!-- <p class="img-name">{{i.courseResourceName}}</p> -->
            </div>
          </div>
          <div
            class="myImgCont"
            v-if="item.active && item.courseResourceList[0].courseResourceExt=='png'"
          >
            <div class="my-img" v-for="i in item.courseResourceList" :key="i.courseResourceId">
              <img width="100%" :src="i.courseResourceUrl" />
              <!-- <p class="img-name">{{i.courseResourceName}}</p> -->
            </div>
          </div>
          <div
            class="myImgCont"
            v-if="item.active && item.courseResourceList[0].courseResourceExt=='jpeg'"
          >
            <div class="my-img" v-for="i in item.courseResourceList" :key="i.courseResourceId">
              <img width="100%" :src="i.courseResourceUrl" />
              <!-- <p class="img-name">{{i.courseResourceName}}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- content end -->
    <!-- <div id="progressBar">
			<div id="ptxt">0%</div>
			<div id="playProgressBar"></div>
		</div> -->
  </div>
</template>
<script>
import itemContent from "./activityDitem";
import pdf from "vue-pdf";
// audio
var audio = document.createElement("audio");
export default {
  name: "activityDetails",
  components: { itemContent, pdf },
  metaInfo: {
    title: "课程详情",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=2,user-scalable=yes"
      }
    ]
  },
  data() {
    return {
      audioIndex: -1,
      isPlay: true,
      currentTime: "", // 记录音频播放时间
      play: false,
      showMp3: true,
      bigPdf: false,
      hengping: false,
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型
      src: "", // pdf文件地址
      courseId: this.$route.query.courseId || "1", // 课程Id
      resourceClassicsList: [],
      index: 0,
      showWath: "",
      pageNum: 1,
      pageTotalNum: 1,
      // scroll 配置
      options: {
        probeType: 3,
        click: true,
        pullDownRefresh: {
          threshold: 40, // 刷新时机
          stop: 40 // 回弹停留的距离
        },
        pullUpLoad: {
          threshold: 40 // 开始加载的时机
        },
        startY: 0
      },
      height: {
        height: ""
      },
      heightIfra: {
        width: "",
        height: "",
        top: "",
        left: ""
      },
      pdfStyle: {
        width: ""
      },
      // 接口参数
      option: {
        courseId: this.$route.query.courseId || "1",
        activityId: this.$route.query.activityId || "1",
        unitId: this.$route.query.unitId || "1"
      },
      html: ""
    };
  },
  mounted() {
    // this.initScroll();
    // this.scroll2 = new this.$BScroll(this.$refs.warper, {
    //   click: true,
    //   scrollX: true
    // });
    // this.getCourseResourceClassics();
    this.getCourseResource();
    let ww = $(window).width() || $(document).width();
    let wh = $(window).height() || $(document).height();
    let dh = ww / 1.33333333;
    this.height.height = dh + "px";
    this.heightIfra.width = wh + "px";
    this.heightIfra.height = ww + "px";
    this.heightIfra.top = (wh - ww) / 2 + "px";
    this.heightIfra.left = 0 - (wh - ww) / 2 + "px";
    this.pdfStyle.width = ww / 0.85 + "px";
    // 窗口变化重新设置宽高和偏移
    window.onresize = () => {
      return (() => {
        wh = document.body.clientHeight;
        ww = document.body.clientWidth;
        // that.screenWidth = window.screenWidth;
        console.log(wh);
        setTimeout(() => {
          this.heightIfra.width = wh + "px";
          this.heightIfra.height = ww + "px";
          this.heightIfra.top = (wh - ww) / 2 + "px";
          this.heightIfra.left = 0 - (wh - ww) / 2 + "px";
        }, 1000);
      })();
    };
    let vm = this;
    this.$bridge.registerhandler("closeAudeo", (data, responseCallback) => {
      // vm.showMp3 = false;
      // vm.hengping = true;
      vm.audioIndex = -1;
      vm.pauseAudio();
      // responseCallback({ canback: false });
    });
    this.$bridge.callhandler("hiteHead", { hiteHead: false }, data => {});

    //监听 Audio 的 timeupdate方法来实时获取播放进度
    // audio.addEventListener("timeupdate",function(){
    //   //获取当前播放的百分比  当前进度/总进度
    //   var percent  = audio.currentTime / audio.duration
    //   //计算进度条的因子,百分比需要*该因子,最后才能到100%
    //   var sp = 600 / 100 ;
    //   //拼接进度条的width
    //   var swidth =  (percent * 100 * sp) + "px";
    //   //设置进度条的播放进度
    //   document.getElementById("playProgressBar").style.width = swidth;
    //   //保留2位小数
    //   document.getElementById("ptxt").innerText = ((percent*100).toFixed(2))+"%"
    // })
    // audio.addEventListener("pause",function(){
    //   console.log("pause")
    //   // 记录播放时间，以便于暂停后点击播放接着上次的位置播放
    //   this.currentTime = audio.currentTime;
    // })
    // audio.addEventListener("play",function(){
    //   console.log("play")
    // })
  },
  methods: {
    // 音频播放，暂停
    playAudio(index,url){
      console.log(index)
      audio.src = url;
      audio.controls ="controls"
      audio.play();
      if(!this.play){
        audio.play();
        this.play = true;
        this.audioIndex = index;
      } else {
        audio.pause();
        this.play = false;
        this.audioIndex = -1;
      }
    },
    pauseAudio(){
      audio.pause();
    },

    fullScring(url) {
      this.$router.push("/fullScreen?url=" + url);
      // this.hengping = !this.hengping;
      // let vm = this;
      // if (this.hengping) {
      //   $(".content").css({ height: "100%", overflow: "hidden" });
      //   this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {
      //     // vm.ddd = data;
      //     // 处理返回数据
      //   });
      // } else {
      //   $(".content").css({ height: "auto", overflow: "auto" });
      //   this.$bridge.callhandler("hiteHead", { hiteHead: false }, data => {
      //     // vm.ddd = data;
      //     // 处理返回数据
      //   });
      // }
    },
    fullPdf() {
      this.bigPdf = !this.bigPdf;
      if (this.bigPdf) {
        $(".content").css({ height: "100%", overflow: "hidden" });
      } else {
        $(".content").css({ height: "auto", overflow: "auto" });
      }
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
        // console.log(this.currentPage)
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    // loadPdfHandler2(e) {
    //   this.currentPage = this.currentPage; // 加载的时候先加载第一页
    //   alert(this.currentPage)
    // },
    // load(url) {
    //   if (url && url.length > 0) {
    //     // 加载中
    //     this.loading = true;
    //     let param = {
    //       accept: "text/html, text/plain"
    //     };
    //     this.$http
    //       .get(url, param)
    //       .then(response => {
    //         this.loading = false;
    //         // 处理HTML显示
    //         this.html = response.data;
    //       })
    //       .catch(() => {
    //         this.loading = false;
    //         this.html = "加载失败";
    //       });
    //   }
    // },
    // 初始化scroll
    // initScroll() {
    //   this.myScroll = new this.$BScroll(this.$refs.warperCont, this.options);
    //   this.pullDownEvent();
    //   this.pullUpLoadEvent();
    // },
    // finishPulling() {
    //   this.myScroll.finishPullDown(); // 结束下拉刷新
    //   this.myScroll.finishPullUp(); // 结束上拉加载更多
    //   this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
    // },
    // pullDownEvent() {
    //   this.myScroll.on("pullingDown", () => {
    //     console.log("下拉刷新");
    //     var p = this.pageNum;
    //     p = p > 1 ? p - 1 : this.pageTotalNum;
    //     this.pageNum = p;
    //     this.finishPulling();
    //   });
    // },
    // pullUpLoadEvent() {
    //   this.myScroll.on("pullingUp", () => {
    //     console.log("上拉加载");
    //     var p = this.pageNum;
    //     p = p < this.pageTotalNum ? p + 1 : 1;
    //     this.pageNum = p;
    //     this.finishPulling();
    //     // if (this.option.pageNo <= this.totalPage + 1) {
    //     //   this.option.pageNo++;
    //     //   this.getShareList();
    //     //   this.isEnd = false;
    //     // } else {
    //     //   this.isEnd = true;
    //     // }
    //   });
    // },
    // changeNum() {
    //   this.pageNum++;
    //   console.log(this.pageNum);
    // },
    tab(item, index) {
      // this.pageNum = 1;
      this.$nextTick(() => {
        // this.myScroll.refresh();
        this.resourceClassicsList.forEach(item => (item.active = false));
        this.resourceClassicsList[index].active = true;
        this.showWath = this.resourceClassicsList[index].courseResourceExt;
        console.log(this.resourceClassicsList);
      });
    },
    // 获取课程活动资源
    getCourseResource() {
      this.$fetch
        .getCourseResource(this.option)
        .then(res => {
          this.resourceClassicsList = res.data.resourceClassicsList.forEach(
            item => (item.active = false)
          );
          this.resourceClassicsList = res.data.resourceClassicsList;
          if (
            this.resourceClassicsList[0].resourceClassicsName !== "教学课件"
          ) {
            this.resourceClassicsList[0].active = true;
            console.log(this.resourceClassicsList[0]);
          } else {
            this.resourceClassicsList[1].active = true;
            console.log(this.resourceClassicsList[1]);
          }
          this.showWath = this.resourceClassicsList[1].courseResourceList[0].courseResourceExt;
          let width = 126 * this.resourceClassicsList.length;
          this.$refs.tabcontent.style.width = width + "px";
        })
        .catch(err => {});
    }
  },
  beforeDestroy(){
    audio.pause();
  }
};
</script> 
<style scoped lang='less'>
#progressBar{width:600px;height:30px;background:#e9e9e9;margin-top:10px;position: relative;}
			#playProgressBar{position: absolute;top:0;left:0;background:#20bfd8;height:30px;width:0px;}
			#ptxt{width:100%;height:30px;text-align:center;font-size:16px;line-height: 30px;z-index: 10;position: absolute;}

// .myImgCont{
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
// }
// .my-img {
//   width: 160px;
//   height: 150px;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex;
//   align-items: flex-start;
//   background: rgba(255, 255, 255, 1);
//   box-shadow: 0px 0px 4px 0px rgba(79, 104, 128, 0.25);
//   border-radius: 5px;
//   padding: 14px;
//   box-sizing: border-box;
//   text-align: center;
//   img {
//     width: 100%;
//     height: 95px;
//     display: inline-block;
//     border-radius: 5px;
//   }
//   .img-name {
//     width: 100%;
//     margin-top: 10px;
//     font-size: 12px;
//     color: #31445a;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     overflow: hidden;
//     text-align: center;
//   }
// }
.audio {
  width: 100%;
  padding: 30px 15px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(79, 104, 128, 0.25);
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .myAudio {
    width: 100%;
    margin-top: 25px;
  }
  .title {
    max-width: 90%;
    font-size: 18px;
    color: rgba(49, 68, 90, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.pdf-item {
  width: 100%;
  overflow-y: auto;
}
.popIfr {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  // background: rgba(0, 0, 0, .9);
  text-align: center;
  // .icon-suoxiao{
  //   color: #ccc !important;
  // }
}
.pop {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  transform-origin: 50% 50%;
  transition: all 0.2s;
}
.arrow {
  position: absolute;
  width: 100%;
  font-size: 14px;
  left: 10px;
  bottom: 0px;
  margin: 20px 0 10px 0;
}
.kejian {
  width: 100%;
  position: relative;
  .full {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9;
    font-size: 26px;
    color: #000;
  }
  .cont {
    width: 100%;
    height: 100%;
    max-width: 100%;
    transition: all 0.2s;
    // height: 310px;
  }
}
.system-activityDetails {
  .system-activityDetails_top {
    width: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    height: 3.75rem;
    overflow: hidden;
    .system-activityDetails_list {
      width: 6.25rem;
      float: left;
      text-align: center;
      color: #31445a;
      box-sizing: border-box;
      height: 1.15625rem;
      border-right: 1px solid #ccc;
      &:nth-last-child(1) {
        border-right: none;
      }
    }
    .system-activityDetails_active {
      color: #0081ff;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 2px;
        border-radius: 50%;
        background: #0081ff;
        opacity: 0.5;
        box-shadow: 0 0 5px 3px #0081ff;
        bottom: -0.625rem;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }
  }
}
.warperCont {
  width: 100%;
  // height: 25rem;
  // overflow-y: auto;
  // overflow: hidden;
  .content {
    width: 100%;
    // height: 500px;
    padding: 0.9375rem 0.9375rem 10px 0.9375rem;
    margin-bottom: 20px;
    box-sizing: border-box;
    .cont {
      width: 100%;
    }
  }
}
</style>