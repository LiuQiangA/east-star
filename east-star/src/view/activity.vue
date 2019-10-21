<template>
  <div>
    <!-- 活动介绍 -->
    <div class="content" v-if="empty">
      <div class="system-activity" v-if="avtivityDetil.content">
        <div class="system-activity_title">{{avtivityDetil.title}}</div>
        <div class="system-activity_con" v-html="avtivityDetil.content"></div>
      </div>
      <div v-else v-html="url"></div>
      <!-- <iframe class="frame" v-else :src="url" frameborder="0" width="100%" scrolling="auto"></iframe> -->
    </div>
    <div class="empty" v-else>暂无内容</div>
  </div>
</template>
<script>
export default {
  name: "activity",
  data() {
    return {
      url: "", // 微信公众号文章地址内容
      // 接口参数
      options: {
        activityid: this.$route.query.activityid || "279",
        studentId: this.$route.query.studentId || "",
        classId: this.$route.query.classId || ""
      },
      avtivityDetil: {},
      empty: true
    };
  },
  mounted() {
    // this.scroll = new this.$BScroll(this.$refs.warper, {
    //   click: true
    // });

    // 当内容为url路径时候，iframe高度
    let wh = $(window).height();
    let frameH = wh - 50;
    $(".frame").height(frameH);
  },
  created() {
    this.getStudyDetail();
    // let that = this;
    // $.ajaxPrefilter(function(options){
    //   if(options.crossDomain && jQuery.support.cors){
    //     var http = (window.location.protocol === "http:" ? "http:" : "https:");
    //     options.url = http + "//cors-anywhere.herokuapp.com/" + options.url;
    //   }
    // })
    // $.get(
    //   'https://mp.weixin.qq.com/s/Bw8n1qRgoGxF8n-xAqfYMA',
    //   function(response){
    //     const body = document.createElement('div');
    //     body.innerHTML = response;
    //     const  content = body.querySelector('#js_article').innerHTML;
    //     that.url = content.replace(/data-src/g, "src")
    //   }
    // )
    // let http = window.location.protocol === "http:" ? "http:" : "https:";
    // let realurl =
    //   http +
    //   "//cors-anywhere.herokuapp.com/" +
    //   "https://mp.weixin.qq.com/s/Bw8n1qRgoGxF8n-xAqfYMA";
    // let that = this;
    // $.ajax({
    //   type: "get",
    //   url: realurl,
    //   success: function(res) {
    //     console.log(res);
    //     if (res) {
    //       let data = res;
    //       data = data.replace(/data-src/g, "src");
    //       let htmlSrc = data; // 解析码解决乱码
    //       that.url = htmlSrc;
    //     }
    //   },
    //   error: function(err) {
    //     console.log(err);
    //     Toast("好像出错了...");
    //   }
    // });
  },
  methods: {
    getStudyDetail() {
      this.$fetch
        .getStudyDetail(this.options)
        .then(res => {
          this.avtivityDetil = res.data.studyDetail.avtivityDetil;
          if (
            JSON.stringify(this.avtivityDetil) == "" ||
            JSON.stringify(this.avtivityDetil) == "{}" ||
            this.avtivityDetil == "null"
          ) {
            this.empty = false;
          }

          // 判断地址来源
          let head = this.avtivityDetil.url.slice(0, 24);
          if (head === "https://mp.weixin.qq.com") {
            // 是微信公众号文章
            // this.getURL(this.avtivityDetil.url);
            window.location.href = this.avtivityDetil.url
          } else {
            // 是其它网址直接使用
            this.url = this.avtivityDetil.url;
          }
        })
        .catch(err => {});
    },
    getURL(url) {
      let http = window.location.protocol === "http:" ? "http:" : "https:";
      let realurl = http + "//cors-anywhere.herokuapp.com/" + url;
      let that = this;
      $.ajax({
        type: "get",
        url: realurl,
        success: function(res) {
          if (res) {
            let data = res;
            data = data.replace(/data-src/g, "src");
            // let htmlSrc = 'data:text/html;charset=utf-8,' + data; // 解析码解决乱码
            let htmlSrc = data; // 解析码解决乱码
            that.url = htmlSrc;
          }
        },
        error: function(err) {
          console.log(err);
          Toast("好像出错了...");
        }
      });
    }
  }
};
</script> 
<style scoped lang='less'>
.empty {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: #888;
}
.system-activity {
  width: 100%;
  padding: 0 1.25rem;
  box-sizing: border-box;
  font-size: 14px;
  .system-activity_title {
    font-weight: bold;
    font-size: 18px;
    padding: 10px 0;
    line-height: 1.875rem;
  }
  .system-activity_date {
    span {
      padding-right: 0.9375rem;
    }
    .text {
      color: #0081ff;
    }
    .date {
      color: #a8a8a8;
    }
  }
  .system-activity_con {
    margin-top: 0.9375rem;
    line-height: 1.875rem;
  }
}
</style>

<style lang='less'>
.system-activity_con {
  p {
    font-size: 0.875rem !important;
    span {
      font-size: 0.875rem !important;
    }
    img {
      width: 100% !important;
      display: block;
    }
  }
}
</style>
