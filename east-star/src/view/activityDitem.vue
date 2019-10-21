<template>
  <div class="warperCont" ref="warperCont">
    <div class="content">
      <div class="jiaoan" v-for="item in resourceClassicsList" :key="item.resourceClassicsId">
        <div v-if="item.active && showWath=='pdf'">
          <!-- <embed class="cont" :src="item.courseResourceList[0].courseResourceUrl" alt="pdf"> -->
          <pdf ref="pdf" :page="pageNum" @num-pages="pageTotalNum=$event" :src="item.courseResourceList[0].courseResourceUrl"></pdf>
        </div>
        <div v-if="item.active && showWath=='html'">
          <embed class="cont" :src="item.courseResourceList[0].courseResourceUrl" alt="html">
        </div>
        <div v-if="item.active && showWath=='video'">
          <embed class="cont" :src="item.courseResourceList[0].courseResourceUrl" alt="html">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  name: "item",
  components: {
    pdf
  },
  props: {
    resourceClassicsList: {
      type: Array,
      default: {}
    },
    showWath: {
      type: String,
      default: ""
    },
    pageNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // scroll 配置
      options: {
        probeType: 3,
        click: true,
        pullDownRefresh: {
          threshold: 40, // 刷新时机
          stop: 40 // 回弹停留的距离
        },
        pullUpLoad: {
          threshold: 20 // 开始加载的时机
        },
        startY: 0
      }
    };
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    // 初始化scroll
    initScroll() {
      this.myScroll = new this.$BScroll(this.$refs.warperCont, this.options);
      this.pullDownEvent();
      this.pullUpLoadEvent();
    },
    finishPulling() {
      this.myScroll.finishPullDown(); // 结束下拉刷新
      this.myScroll.finishPullUp(); // 结束上拉加载更多
      this.myScroll.refresh(); // dom节点变化，重新计算better-scroll
    },
    pullDownEvent() {
      this.myScroll.on("pullingDown", () => {
        console.log("下拉刷新");
        this.finishPulling();
      });
    },
    pullUpLoadEvent() {
      this.isEnd = false;
      this.myScroll.on("pullingUp", () => {
        console.log("上拉加载");
        this.finishPulling();
        // if (this.option.pageNo <= this.totalPage + 1) {
        //   this.option.pageNo++;
        //   this.getShareList();
        //   this.isEnd = false;
        // } else {
        //   this.isEnd = true;
        // }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.warperCont {
  width: 100%;
  height: 25rem;
  // overflow-y: auto;
  overflow: hidden;
  .content {
    width: 100%;
    height: 500px;
    padding: 0.9375rem;
    box-sizing: border-box;
    .cont {
      width: 100%;
    }
  }
}
</style>

