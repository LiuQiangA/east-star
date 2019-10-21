<template>
  <div class="center-cont">
    <div class="cont-top">
      <div class="seach-cont">
        <i class="iconfont icon-linedesign-12"></i>
        <input
          class="helpCenter-search"
          type="text"
          v-model="keyWord"
          @input="getHelpCenter"
          placeholder="请输入关键词进行搜索"
        />
      </div>
    </div>
    <div class="system-helpCenter" :style="warper" ref="warper">
      <div class="content">
        <ul class="helpCenter-ul" v-if="empty">
          <router-link
            class="helpCenter-items van-hairline--bottom"
            tag="li"
            v-for="item in helpCenterList"
            :to="{path: '/helpDetails', query: {id: item.questionId }}"
            :key="item.id"
            v-html="item.questionName"
          ></router-link>
        </ul>
        <div class="empty" v-else>
          <img src="../../assets/images/keyEmpty.png" width="54px" />
          <p>暂无匹配结果，换个关键词试试吧~</p>
        </div>
        <div v-if="noMore" class="noMore">没有更多啦</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "helpCenter",
  data() {
    return {
      keyWord: "",
      helpCenterList: [],
      empty: true,
      noMore: false,
      warper: {
        height: ''
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.warper.height = $(window).height()-70+'px';
    this.$bridge.registerhandler(
      "isShow",
      { isShow: true },
      (data, responseCallback) => {}
    );
    this.scroll = new this.$BScroll(this.$refs.warper, {
      click: true
    });
  },
  methods: {
    // init
    init() {
      this.$fetch
        .getHelpCenter({
          keyWord: this.keyWord
        })
        .then(res => {
          this.$nextTick(() => {
            this.helpCenterList = res.data.helpCenterList;
            this.noMore = true;
          });
        })
        .catch(err => {});
    },
    // list
    getHelpCenter() {
      this.helpCenterList = [];
      this.$fetch
        .getHelpCenter({
          keyWord: this.keyWord
        })
        .then(res => {
          this.$nextTick(() => {
            let htmlText = `<span style="color:#0081FF">${this.keyWord}</span>`;
            res.data.helpCenterList.forEach((item, index, arr) => {
              if (this.keyWord) {
                item.questionName = item.questionName.replace(
                  this.keyWord,
                  htmlText
                );
              }
            });
            
            this.helpCenterList = res.data.helpCenterList;
            if (!this.helpCenterList.length) {
              this.empty = false;
              this.noMore = false;
            } else {
              this.empty = true;
              this.noMore = true;
            }
            // let el = $(".helpCenter-items");
            // let text = el.html();
            // let htmlText = `<span style="color:#0081FF">${this.keyWord}</span>`;
            // if (this.keyWord) {
            //   console.log(el);
            //   console.log(text);
            //   el.html(el.html().replace(htmlText, this.keyWord));
            //   el.html(
            //     el
            //       .html()
            //       .replace(
            //         this.keyWord,
            //         `<span style="color:#0081FF">${this.keyWord}</span>`
            //       )
            //   );
            // } else {
            //   console.log(text);
            //   el.html(el.html().replace(this.keyWord, `${this.keyWord}`));
            // }
          });
        })
        .catch(err => {});
    }
  }
};
</script> 
<style scoped lang='less'>
.empty {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: #888;
  p {
    margin-top: 30px;
  }
}
.cont-top{
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-cont {
  width: 100%;
  height: 100%;
  padding: 0 0.9375rem;
  box-sizing: border-box;
  .seach-cont {
    width: 100%;
    background: #e9e6e6;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    align-items: center;
    .icon-linedesign-12 {
      font-size: 1.375rem;
      color: #a6a6a6;
      margin-left: 0.9375rem;
    }
  }
  .helpCenter-search {
    flex-grow: 1;
    padding: 0.7rem 10px;
    box-sizing: border-box;
    border: 0;
    position: relative;
    font-size: 1rem;
    color: #0081ff;
    background: none;
    ::before {
      content: "\e671";
      font-family: "iconfont";
      display: inline-block;
      width: 22px;
      height: 22px;
      position: absolute;
      left: 1.45rem;
      top: 1.45rem;
      z-index: 2;
      font-size: 1.375rem;
      color: #a6a6a6;
    }
  }
  .system-helpCenter {
    width: 100%;
    overflow: hidden;
    margin: 0 0.9375rem 0 0;

    & .helpCenter-ul {
      width: 100%;
      display: flex;
      flex-direction: column;

      .helpCenter-items {
        width: 100%;
        padding: 1.25rem 0;
        line-height: 1.375rem;
        word-break: break-all;
        color: #31445a;
        // border-bottom: 1px solid #e1e4e9;
      }
    }
  }
}
</style>