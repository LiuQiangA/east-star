<template >
  <div class="system-preview" v-if="isShow">
    <div class="system-preview_inner" @click="closeBtn">
      <Swiper v-model="index" class="img-box">
        <template v-for="(item,index) in list">
          <swipe-item>
            <img width="100%" :src="item" />
          </swipe-item>
        </template>
      </Swiper>
    </div>
  </div>
</template>
<script>
import { Swiper, SwipeItem } from "./starSwiper";
import Ls from "@/config/storage";
export default {
  name: "preview",
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // list: [
      //   "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=671534272,2008791340&fm=27&gp=0.jpg",
      //   "http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg",
      //   "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1729588223,3236103552&fm=27&gp=0.jpg"
      // ],
      // index: 2
    };
  },
  components: {
    Swiper,
    SwipeItem
  },
  watch: {
    isShow: function(val, oldval) {
      this.$nextTick(() => {
        console.log("hiteHead");
        if (val) {
          this.$bridge.callhandler("hiteHead", { hiteHead: true }, data => {
            // vm.ddd = data;
            // 处理返回数据
          });
          // 图片物物理键返回
          const vm = this;
          this.$bridge.registerhandler("canback", (data, responseCallback) => {
            vm.closeBtn();
            responseCallback({ canback: false });
          });
        } else {
          this.$bridge.callhandler("hiteHead", { hiteHead: false }, data => {
            // vm.ddd = data;
            // 处理返回数据
          });
          // 图片物物理键返回
          // const vm = this;
          this.$bridge.registerhandler("canback", (data, responseCallback) => {
            // vm.closeBtn();
            responseCallback({ canback: true });
          });
        }
        const vm = this;
        const imgBox = document.querySelector(".img-box");
        let imgArr;

        if (!imgBox) {
          return;
        }

        imgArr = Array.from(imgBox.getElementsByTagName("img"));

        imgArr.forEach(da => {
          da.onload = function() {
            if (da.width > da.height) {
              // da.style.cssText = "transform: translateY(50%);";
            }
          };
        });
      });
    }
  },

  methods: {
    closeBtn() {
      this.$emit("close");
      this.$bridge.callhandler("hiteHead", { hiteHead: false }, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      console.log("8");
    }
  },
  created() {
    // this.$nextTick(() => {
    //   if (Ls.getItem("list")) {
    //     this.list = Ls.getItem("list");
    //     this.index = Ls.getItem("index") * 1;
    //   }
    // });
  }
};
</script> 
<style lang='less'>
.system-preview {
  position: absolute;
  left: 0px;
  top: 0px;
  background: #000000;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 9;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 100%;
  }
}

.c-swipe-pagination {
  // position: fixed !important;
  position: absolute !important;
  bottom: 0.3125rem !important;
  // height: 3.125rem;
  width: 100%;
}
// .c-swipe-pagination-bar{

//   position: fixed !important;
//   bottom: .3125rem !important;
// }
// .wh_show_bgcolor {
//   background: #0081ff !important;
// }
</style>