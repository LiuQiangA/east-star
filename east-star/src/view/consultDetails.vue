<template>
  <div class="system-consultDetails" ref="wrapper">
    <div>
      <div class="top" v-if="isShare == 2">
        <i class="iconfont icon-fanhui" @click="back"></i>
        资讯详情
        <span class="share" @click="share">
          <i class="iconfont icon-gengduo"></i>
        </span>
      </div>
      <div :class="{'margin-top': isShare == 2}">
        <p class="title" v-if="title">{{title}}</p>
        <div class="content htmlContent" v-html="content">{{content}}</div>
        <p class="bottom van-hairline--top" v-if="updatedAt">
          {{updatedAt}}
          <span>阅读：{{viewNum+1}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "consultDetails",
  data() {
    return {
      isShare: this.$route.query.isShare || 2,
      title: "",
      content: "",
      updatedAt: "",
      viewNum: ""
    };
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm=>{
  //     console.log(to)
  //     vm.$fetch
  //       .getServiceNewDetail({
  //         serviceNewId: to.query.id
  //       })
  //       .then(res => {
  //         vm.$router.push({path:to.path,query:{id:res.data.serviceNewtail.id, title: res.data.serviceNewtail.title}});
  //       })
  //   })
  // },
  created() {
    this.setView();
  },
  mounted() {
    this.getServiceNewDetail();
    this.$bridge.callhandler("hiteBar", { hiteBar: false }, data => {
      // vm.ddd = data;
      // 处理返回数据
    });
  },
  methods: {
    share() {
      this.$bridge.callhandler("share", data => {
        // vm.ddd = data;
        // 处理返回数据
      });
    },
    back() {
      // this.$router.go("-1");
      this.$bridge.callhandler("hiteBar", { hiteBar: true }, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      // 调用原生返回
      this.$bridge.callhandler("goBack", data => {
        // vm.ddd = data;
        // 处理返回数据
      });
    },
    // scroll
    initScroll() {
      new this.$BScroll(this.$refs.wrapper, {
        click: true
      });
    },
    getServiceNewDetail() {
      this.$fetch
        .getServiceNewDetail({
          serviceNewId: this.$route.query.id
        })
        .then(res => {
          this.content = res.data.serviceNewtail.content;
          this.updatedAt = res.data.serviceNewtail.updatedAt;
          this.viewNum = res.data.serviceNewtail.viewNum;
          this.title = res.data.serviceNewtail.title;
          this.$nextTick(() => {
            // this.initScroll();
          });
        })
        .catch(err => {
          console.log("失败");
        });
    },
    // 添加浏览量
    setView() {
      this.$fetch
        .setView({
          serviceNewId: this.$route.query.id
        })
        .then(res => {})
        .catch(err => {});
    }
  }
};
</script> 
<style scoped lang='less'>
.margin-top{
  margin-top: 65px;
}
.top {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #31445a;
  box-shadow: 0px 3px 12px 0px rgba(199, 199, 199, 0.5);
  font-size: 20px;
  background: #fff;
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  .share {
    font-size: 14px;
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
.system-consultDetails {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    color: #31445a;
    text-align: center;
    margin: 20px 0;
    line-height: 25px;
  }
  .content {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .bottom {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    height: 60px;
    line-height: 40px;
    // border-top: 1px solid #e1e4e9;
    font-size: 0.875rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(193, 193, 193, 1);
    margin-top: 20px;
    span {
      margin-left: 30px;
    }
  }
}
</style>
<style lang='less'>
// v-html相当于引入外部组件内容。
// 现在我们用的sylte都会包括scoped标签，这个是私有属性的标签，所以我们要新建一个样式联，将scoped标签去掉，将样式卸载这里面 就可以了
.htmlContent {
  p {
    color: rgba(115, 123, 133, 1);
    font-size: 0.875rem !important;
    span {
      font-size: 0.875rem !important;
    }
  }
  img {
    width: 100% !important;
    display: block;
    margin: 20px 0;
  }
}
</style>
