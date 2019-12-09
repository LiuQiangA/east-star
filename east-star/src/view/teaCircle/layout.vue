<template>
  <div class='system-teaCircle'>

    <!-- <div class='top' id="top" v-if="$route.meta.tab">
      <div class="border-bottom">
        <router-link class="list" to="/teaCircle/consult" @click.native='tab(0)'><span>教研资讯</span> <div class='img'></div></router-link>
        <router-link class="list" to="/teaCircle/communion?share=1" @click.native='tab(1)'><span>分享交流</span> <div class='img'></div></router-link>
        <router-link class="list" to="/teaCircle/questions?quest=1" @click.native='tab(2)'><span>教研问答</span> <div class='img'></div></router-link>
      </div>
    </div> -->

    <div class='bottom'>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </div>
    <!-- <preview :isShow='isPreview' @close='close'></preview> -->
  </div>
</template>
<script>
import Ls from "@/config/storage";
import preview from "@/components/preview";
export default {
  name: "teaCircle",
  components: {
    preview
  },
  data() {
    return {
      isShow: false,
      tab_data: [
        {
          text: "教研资讯",
          fal: true,
          path: "/teaCircle/consult",
          name: "consult"
        },
        {
          text: "分享交流",
          fal: false,
          path: "/teaCircle/communion?share=1",
          name: "communion"
        },
        {
          text: "教研问答",
          fal: false,
          path: "/teaCircle/questions?quest=1",
          name: "questions"
        }
      ]
    };
  },
  computed: {
    isPreview() {
      return this.$store.state.isPreview;
    }
  },
  methods: {
    close() {
      this.$store.commit("changePre");
    },
    tab(index) {
      let vm = this;
      Ls.setItem("nav",index);
      // this.$router.push({ path: this.tab_data[index].path });
      // console.log("aa")
      this.tab_data.forEach(da => (da.fal = false));
      this.tab_data[index].fal = true;
      // 调用native 传参
      this.$bridge.callhandler(
        "tabName", {
          tabName: vm.tab_data[index].text
        },
        data => {
          // vm.ddd = data;
          // console.log(data)
        }
      );
    }
  },
  created() {
    this.tab_data.forEach((da, index) => {
      if (da.name == this.$route.name) {
        this.tab(index);
      }
    });
    this.$bridge.registerhandler("canback", (data, responseCallback) => {
      // vm.closeBtn();
      responseCallback({ canback: true });
    });
  }
};
</script> 
<style scoped lang='less'>
.system-teaCircle {
  height: 100%;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .top {
    height: 3.75rem;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    margin: 0 auto;
    line-height: 3.75rem;
    font-size: 1rem;
    position: relative;
    background: #fff;
    z-index: 9;
    .border-bottom{
      // border-bottom: 1px solid #E1E4E9;
      width: 100%;
      float: left;
    }
    .list {
      float: left;
      margin-right: 1.5625rem;
      position: relative;
      color: #31445a;
      font-weight: bold;
      text-decoration: none;
      font-size: 1.0625rem;
      span{
        position: relative;
        z-index: 2;
      }
    }

    .list_active {
      color: #0081ff;
      .img {
        width: 60%;
        height: 4px;
        position: absolute;
        top: 2.24375rem;
        left: -0.15625rem;
        background:rgba(157,230,91,1);
        box-shadow:0px 1px 3px 0px rgba(177,249,111,0.75);
        border-radius:0px 5px 5px 0px;
        z-index: 1;
        overflow: hidden;
      }
    }
  }

  .bottom {
    flex: 1;
    height: 100%;
    overflow: hidden;
    margin-top: 1px;
  }
}
</style>