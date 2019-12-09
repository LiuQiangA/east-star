<template>
  <div class="system-shareList">
    <div class="content">
      <div class="system-communion_box van-hairline--bottom" v-for="(item,index) in datas" :key="item.id" :id="getId(item.id)" @click="goDet(item.id,item.imgW,item.imgH)">
        <div class="communion_box_left">
          <div>
            <img
              v-if="item.user"
              :src="item.user.userImage || '../../../assets/images/default.png'"
              :onerror="defaultHeadImg"
            >
            <img
              v-else
              src="../../../assets/images/default.png"
            >
          </div>
        </div>

        <div class="communion_box_right">
          <div class="first" v-if="item.user">
            <!-- <div>{{item.userId == LSuserId?"我":item.user.userName}}</div> -->
            <div class="first" v-if="item.user">{{item.user.userName}}</div>
            <p><span class="time">{{item.updatedAt}}</span> <span class="my-delete" v-if="LSuserId == item.userId" @click.stop="deleteShare(item.id)">删除</span></p>
          </div>
          <div class="second">{{item.content}}</div>
          <div class="third" :class="{'flex-imgW': item.imgW, 'flex-imgH': item.imgH}" v-if="item.pictures">
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
            <div class="fourth_time">{{item.area}}</div>
            
            <div v-if="showHF == 'true'" class="fourth_message" :class="{'on':true}" @click.stop="messageBtn(item,index,'#my'+item.id)">回复</div>
          </div>
          <!-- 评论 -->
          <div class="system-moreCom" v-if="item.list.length" @click.stop="getIndex(index)">
            <div class="moreCom_up"></div>

            <div class="moreCom_text" :class="{'on':item.list.length>5}">
              <template v-for="(i,index) in item.list">
                <div :id="'my'+index" v-if="!i.parentId" @click.stop="commit(i,index,i.answerId)">
                  <span>{{i.answerUserName}}：</span>
                  {{i.answerContent}}
                </div>
                <div :id="'my'+index" v-else @click="commit(i,index,i.answerId)">
                  <span>{{i.answerUserName}}</span>回复
                  <span>{{i.touserName}}：</span>
                  {{i.answerContent}}
                </div>
              </template>
            </div>

            <div class="more_text_box" v-if="item.list.length>5">
              <div @click="moreBtn(item.id)">查看更多评论</div>
            </div>
          </div>
          <!-- 评论  end-->
          <!-- 评论 -->
          <!-- <div class="fifth" v-if="item.list.length">
            <moreCom :list="item.list"></moreCom>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moreCom from "./moreCom";
import Ls from "@/config/storage";
export default {
  name: "shareList",
  props: {
    datas: {
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
      showHF: '',
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
  // computed: {
  //   ...mapGetters(['doneGet'])
  // },
  created() {
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
    this.showHF = Ls.getItem('showHF');
    this.isShare = false;
    if (this.$route.query.share) {
      this.isShare = true;
    }
  },
  components: {
    moreCom
  },
  methods: {
    // 删除分享
    deleteShare(id) {
      this.$emit("deleteShare", id);
    },
    goDet(id,imgW,imgH) {
      id += '';
      let w = imgW ? '"true"':'"false"';
      let h = imgH ? '"true"':'"false"';
      console.log("imgW为："+ imgW)
      console.log("imgH为："+ imgH)
      console.log(typeof w)
      console.log(typeof h)
      this.$bridge.callhandler("questionsDet", {id: id, imgW: w, imgH: h}, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      // this.$router.push({
      //   path: "/teaCircle/questionsDet",
      //   query: { id: id, imgW: imgW, imgH: imgH }
      // });
    },
    getId(id) {
      return "my" + id;
    },
    moreBtn(e) {
      let id =document.getElementById("my"+e);
      $(id).find(".moreCom_text").removeClass("on");
      $(id).find(".more_text_box").addClass("on")
      console.log(1212);
    },
    // 获取index
    getIndex(index) {
      this.$emit('getIndex',index)
    },
    // 传递评论信息
    commit(item,index,id) {
      this.$emit('commit',item,index,id)
      // 用于评论时候键盘弹起页面定位
      Ls.setItem("elementId","#my"+index)
    },
    messageBtn(item,index,id) {
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

    .system-moreCom {
      background: #f0f0f0;
      position: relative;
      border-radius: 0.15625rem;
      padding: 0.625rem;
      margin-top: 15px;
      .moreCom_up {
        position: absolute;
        top: -0.625rem;
        left: 0.625rem;
        width: 0;
        height: 0;
        border-left: 0.46875rem solid transparent;
        border-right: 0.46875rem solid transparent;
        border-bottom: 0.625rem solid #f0f0f0;
      }

      .moreCom_text {
        font-size: 0.9375rem;
        color: #31445a;
        &.on {
          height: 160px;
          overflow: hidden;
        }
        & > div {
          width: 100%;
          word-break: break-all;
          margin: 15px 0;
        }
        span {
          color: #0081ff;
        }
      }
      .more_text_box {
        height: 2.5625rem;
        line-height: 2.5625rem;
        color: #88c750;
        font-size: 0.75rem;
        text-align: center;
        &.on{
          display: none;
        }
      }
    }

    .fourth {
      // height: 2.8125rem;
      // line-height: 2.8125rem;
      overflow: hidden;
      color: #c1c1c1;
      .fourth_time {
        float: left;
        font-size: 0.75rem;
      }
      .fourth_praise {
        float: right;
        font-size: 0.75rem;
        margin-right: 1.9875rem;
        .iconfont {
          font-size: 20px;
          color: #c1c1c1;
          &.on {
            color: #0081ff;
          }
        }
        img {
          height: 1.125rem;
          width: 1.125rem;
          margin-top: 0.78125rem;
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