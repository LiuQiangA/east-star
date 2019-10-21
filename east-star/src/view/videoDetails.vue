<template>
  <div class="system-videoDetails">
    <!-- pdf -->
    <div v-if="isPdf" style="position:relative">
      <pdf
        :src="url"
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
    <!-- 非pdf -->
    <div v-else>
      <iframe v-if="isFlash" class="flash" :style="flash" :src="url"></iframe>
      <vue-plyr
        v-else
        ref="plyr"
        :emit="['exitfullscreen','enterfullscreen']"
        @exitfullscreen="exitedFullScreen"
        @enterfullscreen="enterfullscreen"
      >
        <video crossorigin playsinline :poster="classLogo" :src="url" controls>
        </video>
      </vue-plyr>
    </div>    
  </div>
</template>
<script>
import pdf from "vue-pdf";
export default {
  name: "videoDetails",
  components: { pdf },
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
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型
      src: "", // pdf文件地址
      isPdf: false,
      isFlash: false,
      native_data: "---",
      ddd: "",
      url: this.$route.query.classPath, // 视频地址
      classLogo: this.$route.query.classLogo, // 封面图
      full: true,
      flash: {
        height: "",
      },
      heightIfra: {
        width: "",
        height: "",
        top: "",
        left: ""
      }
    };
  },
  methods: {
    exitedFullScreen() {
      this.$bridge.callhandler("screenSize", { screenSize: false }, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      
      // 解决部分安卓手机底部虚拟键遮挡返回全屏按钮
      $(".plyr--video .plyr__controls").css("padding","20px 5px 5px 5px")

      // 告诉ios退出全屏了
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isIOS){
        // 一下代码只是用来发起请求，以便于iOS监听，做交互（UIwebview）,iOS全屏时候强制横屏
        var a = document.createElement('a');
        a.target = "myIframe";
        a.href = "https://www.xiaohe.com";
        a.click();

        // WKwebview
        // this.$bridge.callhandler("showStatus", {}, data => {
        //   // vm.ddd = data;
        //   // 处理返回数据
        // });
      }
    },
    enterfullscreen() {
      this.$bridge.callhandler("screenSize", { screenSize: true }, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      // 解决部分安卓手机底部虚拟键遮挡返回全屏按钮
      $(".plyr--video .plyr__controls").css("padding","20px 50px 5px 20px")

      // 一下代码只是用来发起请求，以便于iOS监听，做交互（UIwebview）,iOS全屏时候强制横屏
      var a = document.createElement('a');
      a.target = "myIframe";
      a.href = "https://www.baidu.com";
      a.click();
    },
    goNative() {
      const vm = this;
      this.$bridge.callhandler(
        "testWebViewBridge",
        { action: "pick me" },
        data => {
          vm.ddd = data;

          // 处理返回数据
        }
      );
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
  },
  computed: {
    player () { return this.$refs.plyr.player }
  },
  mounted() {
    // const vm = this;
    // this.$bridge.registerhandler("iosToH5", (data, responseCallback) => {
    //   vm.native_data = data;
    //   // this.responseCallback(data)
    // });
    console.log("========");
    console.log(this.url);
    if(this.url.indexOf('.mp4') >= 0){
      this.isFlash = false;
    } else {
      this.isFlash = true;
    }
    if(this.url.indexOf('.pdf') >= 0){
      this.isPdf = true;
    } else {
      this.isPdf = false;
    }
    let ww = $(window).width() || $(document).width();
    let wh = $(window).height() || $(document).height();
    this.flash.height = wh + "px";
    let dh = ww / 1.33333333;
    this.heightIfra.width = wh + "px";
    this.heightIfra.height = ww + "px";
    this.heightIfra.top = (wh - ww) / 2 + "px";
    this.heightIfra.left = 0 - (wh - ww) / 2 + "px";
    $(".flash").css("overflow-y","auto");
    console.log(this.player)
  }
};
</script> 
<style>
/* 解决部分安卓手机底部虚拟键遮挡返回全屏按钮 */
/* .plyr--video .plyr__controls{
  
  padding: 20px 40px 5px 5px;
} */
/* 解决部分安卓手机底部虚拟键遮挡返回全屏按钮  end*/
video::-webkit-media-controls-enclosure {
  overflow: hidden;
}
video::-webkit-media-controls-panel {
  width: calc(100% + 30px);
}
audio::-internal-media-controls-download-button {
  display: none;
}

audio::-webkit-media-controls-enclosure {
  overflow: hidden;
}

audio::-webkit-media-controls-panel {
  width: calc(100% + 30px);
}
</style>

<style scoped lang='less'>
.arrow {
  position: absolute;
  width: 100%;
  font-size: 14px;
  left: 10px;
  bottom: 0px;
  margin: 20px 0 10px 0;
  .turn{
    font-size: 14px;
    color: #333;
  }
}
.flash{
  width: 100%;
  // height: 240px;
  border: 0;
}
.video {
  width: 100%;
  transition: all 0.2s;
  position: absolute;
}
.route {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
  transform-origin: 50% 50%;
  transition: all 0.2s;
}
.system-videoDetails {
  width: 100%;
  padding: 25px;
  box-sizing: border-box;
}
.btn {
  height: 3.125rem;
  width: 6.25rem;
  border: 1px solid #ccc;
}
</style>