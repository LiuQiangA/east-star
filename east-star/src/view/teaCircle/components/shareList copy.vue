<template>
  <div class="system-shareList">
    <div class="content">
      <div
        :id="getId(item.shareId)"
        class="system-communion_box van-hairline--bottom"
        v-for="(item,index) in data"
        :key="item.shareId"
        @click="goDet(item.shareId,item.imgW,item.imgH)"
      >
        <div class="communion_box_left">
          <div>
            <img
              v-if="item.user"
              :src="item.user.userImage || '../../../assets/images/default.png'"
              :onerror="defaultHeadImg"
            />
            <img
              v-else
              src="../../../assets/images/default.png"
            />
          </div>
        </div>
        <div class="communion_box_right">
          <router-link
            v-if="isShare"
            :to="{path:'/teaCircle/communionDet',query: {id: item.shareId}}"
            tag="div"
          >
          <div class="first" v-if="item.user">
            <!-- <div>{{item.userId == LSuserId?"我":item.user.userName}}</div> -->
            <div class="first" v-if="item.user">{{item.user.userName}}</div>
            <p><span class="time">{{item.updatedAt}}</span> <span class="my-delete" v-if="LSuserId == item.userId" @click.stop="deleteShare(item,index)">删除</span></p>
          </div>
            <div class="second">{{item.content}}</div>
          </router-link>
          <router-link v-else :to="{path:'/teaCircle/questionsDet',query: {id: item.id}}" tag="div">
            <!-- <div class="first" v-if="item.user">{{item.userId == LSuserId?"我":item.user.userName}}</div> -->
            <div class="first" v-if="item.user">{{item.user.userName}}</div>
            <div class="second">{{item.content}}</div>
          </router-link>
          <div
            class="third"
            :class="{'flex-imgW': item.imgW, 'flex-imgH': item.imgH}"
            v-if="item.pictures"
          >
            <!-- <p>item.imgW: {{item.imgW}}</p>
            <p>item.imgH: {{item.imgH}}</p>-->
            <div
              @click.stop="previewBtn(item,index)"
              v-for="(imgSrc,index) in item.pictures"
              :key="index"
            >
              <img :src="imgSrc"/>
              <!-- <img v-if="item.imgW || item.imgH" :src="imgSrc+'?imageMogr2/thumbnail/!67px'" />
              <img v-else :src="imgSrc+'?imageMogr2/thumbnail/!75p&imageMogr2/gravity/Center/crop/300x300'"> -->
            </div>
          </div>

          <div class="fourth">
            <!-- <div class="fourth_time">{{item.updatedAt}}</div> -->
            <div>
              <div class="fourth_message" @click.stop="messageBtn(item,index, '#my'+item.shareId)">
                <div>
                  <i class="iconfont icon-liuyan"></i>
                </div>
                <div>{{item.commentNum || '0'}}</div>
              </div>
              <div
                v-if="item.userId != LSuserId"
                class="fourth_praise"
                @click.stop="praiseBtn(item)"
              >
                <div>
                  <!-- <i class="iconfont icon-dianzan" :class="{'on':item.starState}"></i> -->
                  <img
                    v-if="item.starState"
                    src="../../../assets/images/zan_+icon@2x(1).png"
                    alt="赞"
                  />
                  <img v-else src="../../../assets/images/zan_icon@2x.png" alt="赞" />
                </div>
                <div>{{item.stars || '0'}}</div>
              </div>
              <div v-else class="fourth_praise" @click.stop="zanList(item,3)">
                <div>
                  <!-- <i class="iconfont icon-dianzan" :class="{'on':item.starState}"></i> -->
                  <img
                    v-if="item.starState"
                    src="../../../assets/images/zan_+icon@2x(1).png"
                    alt="赞"
                  />
                  <img v-else src="../../../assets/images/zan_icon@2x.png" alt="赞" />
                </div>
                <div>{{item.stars || '0'}}</div>
              </div>
            </div>
          </div>
          <!-- 评论 -->
          <div class="fifth" style="margin-top:10px" v-if="item.list.length" @click.stop="getIndex(index)">
            <moreCom @commit="commit" :id="item.shareId" :list="item.list" :LSuserId="LSuserId"></moreCom>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <!-- <div class="comment-cont" :class="{'show': showText}">
      <div class="comment-d">
        <textarea @blur="showText = false" autofocus id="texta" class="comment-ipt" rows="1" placeholder="评论" maxlength="200"></textarea>
      </div>
    </div>-->
  </div>
</template>
<script>
// import store from "@/store";
import { mapGetters } from "vuex";
import moreCom from "./moreCom";
import Ls from "@/config/storage";
// textarea 自适应高度
import { autoTextarea } from "@/config/dom";
// 解决iOS 12.x.x 以上 关闭软键盘页面不回弹底部空白问题的问题
import { iOS } from "@/config/ios";
export default {
  name: "shareList",
  props: {
    data: {
      type: Array,
      default: []
    },
    zan: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShare: true,
      starState: false,
      showText: false,
      LSuserId: "",
      imgW: false,
      imgH: false,
      dataList: [],
      defaultHeadImg: 'this.src="'+ require('../../../assets/images/default.png') +'"'
    };
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        console.log("newValue");
        console.log(newValue);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["doneGet"])
  },
  created() {
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
  },
  components: {
    moreCom
  },
  mounted() {
    // textarea 自适应高度
    setTimeout(() => {
      let test = document.querySelectorAll("textarea");
      for (let i = 0; i < test.length; i++) {
        autoTextarea(test[i]);
      }
    }, 500);
    // 解决iOS 12.x.x 以上 关闭软键盘页面不回弹底部空白问题的问题
    iOS();
  },
  methods: {
    // 删除分享
    deleteShare(item,index) {
      this.$emit("deleteShare", item, index);
    },
    zanList(item, type) {
      this.$router.push({
        path: "/teaCircle/zan",
        query: { id: item.shareId, shareType: type }
      });
    },
    getId(id) {
      return "my" + id;
    },
    goDet(id, imgW, imgH) {
      this.$router.push({
        path: "/teaCircle/communionDet",
        query: { id: id, imgW: imgW, imgH: imgH }
      });
    },
    // 获取index
    getIndex(index) {
      this.$emit("getIndex", index);
    },
    // 传递评论信息
    commit(item, index, id) {
      this.$emit("commit", item, index, id);
    },
    messageBtn(item, index, id) {
      this.$emit("message", item, index, id);
    },
    praiseBtn(item) {
      this.$emit("praise", item.shareId, item.starState);
      if (item.starState) {
        item.starState = 0;
        item.stars -= 1;
      } else {
        item.starState = 1;
        item.stars += 1;
      }
    },
    previewBtn(imgSrc, index) {
      console.log(imgSrc);
      console.log(index);
      // Ls.setItem("list",imgSrc.pictures)
      // Ls.setItem("index",index)
      this.$store.commit("changePre");
      this.$store.commit("changeIndex", index);
      this.$store.commit("changeList", imgSrc.pictures);
    }
  }
};
</script> 
<style scoped lang='less'>
.flex-imgW {
  width: 100%;
  div {
    height: 5.26rem !important;
    width: 11.12rem !important;
    img{
      width: 100% !important;
      height: 100%;
    }
  }
}
.flex-imgH {
  width: 100%;
  div {
    width: 5.26rem !important;
    height: 11.12rem !important;
    img{
      width: 100% !important;
      height: 100%;
    }
  }
}
.system-shareList {
  height: 100%;
  overflow: hidden;
  background: #fff;
  .comment-cont {
    width: 100%;
    height: 100%;
    background: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    &.show {
      z-index: 999;
    }
    .comment-d {
      width: 100%;
      position: absolute;
      top: 300px;
      left: 0;
      border: 1px solid #cecece;
      box-sizing: border-box;
      padding: 6px 0;
      border-radius: 5px;
      background: #fff;
    }
    .comment-ipt {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      resize: none;
      outline: none;
      overflow: hidden;
      border: 0;
      display: block;
    }
  }
}
.system-communion_box {
  display: flex;
  // border-bottom: 1px solid #e1e4e9;
  padding: 1.25rem 0;
  .communion_box_left {
    & > div {
      height: 2.5rem;
      width: 2.5rem;
      overflow: hidden;
      border-radius: 50%;
    }
    img {
      height: 2.5rem;
      width: 2.5rem;
    }
  }

  .communion_box_right {
    flex: 1;
    margin-left: 0.3125rem;

    .first {
      font-size: 1rem;
      color: #0081ff;
      p {
        margin: 10px 0 12px 0;
      }
      .my-delete {
        font-size: 12px;
        color: #88c750;
      } 
      .time{
        font-size: 12px;
        color: #C1C1C1;
      }
    }
    .second {
      width: 100%;
      word-break: break-all;
      margin-bottom: 0.625rem;
      font-size: 1rem;
      color: #31445a;
    }
    .third {
      overflow: hidden;
      margin-bottom: 0.625rem;
      & > div {
        height: 5.625rem;
        width: 5.625rem;
        float: left;
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(252, 250, 250);
        img {
          // height: 100%;
          width: 200px;
        }
      }
    }

    .fourth {
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      color: #c1c1c1;
      .fourth_time {
        float: left;
        font-size: 0.75rem;
      }
      .fourth_praise {
        // width: 18px;
        float: right;
        font-size: 0.75rem;
        margin-right: 1.9875rem;
        .iconfont {
          font-size: 20px;
          color: #c1c1c1;
          &.on {
            color: #db2809;
          }
        }
        img {
          height: 1.125rem;
          width: 1.125rem;
          // margin-top: 0.78125rem;
        }
        & > div {
          float: left;
          margin-right: 0.3125rem;
        }
      }
      .fourth_message {
        float: right;
        font-size: 0.75rem;
        &.on {
          color: #0081ff;
        }
        .iconfont {
          font-size: 20px;
          color: #c1c1c1;
        }
        img {
          width: 1.125rem;
          height: 1.03125rem;
          margin-top: 0.9375rem;
        }
        & > div {
          float: left;
          margin-right: 0.3125rem;
        }
      }
    }
  }
}
</style>