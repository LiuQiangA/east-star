<template>
  <div class="system-shareList">
    <div class="content">
      <div class="system-communion_box van-hairline--bottom" v-for="(item,index) in data" :id="getId(item.shareId)" :key="item.shareId">
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
          <!-- :to="{path:'/myClassCircleDet',query: {id: item.shareId}}" -->
          <div v-if="isD" @click="goDet(item.shareId)">
            <div class="first" v-if="item.user">
              <!-- <div>{{item.userId == LSuserId?"我":item.user.userName}}</div> -->
              <div>{{item.user.userName}}</div>
              <p><span class="time">{{item.updatedAt}}</span> <span class="my-delete" v-if="LSuserId == item.userId" @click.stop="deleteShare(item.shareId)">删除</span></p>
            </div>
            <div class="second">{{item.content}}</div>
          </div>
          <div v-else>
            <div class="first" v-if="item.user">
              <!-- <div>{{item.userId == LSuserId?"我":item.user.userName}}</div> -->
              <div>{{item.user.userName}}</div>
              <p><span class="time">{{item.updatedAt}}</span> <span class="my-delete" v-if="LSuserId == item.userId" @click.stop="deleteShare(item.shareId)">删除</span></p>
            </div>
            <div class="second">{{item.content}}</div>
          </div>
          <div class="third" :class="{'flex-imgW': item.imgW, 'flex-imgH': item.imgH}" v-if="item.pictures">
            <div
              @click="previewBtn(item,index)"
              v-for="(imgSrc,index) in item.pictures"
              :key="index"
            >
              <img :src="imgSrc"/>
              <!-- <img v-if="item.imgW || item.imgH" :src="imgSrc+'?imageMogr2/thumbnail/!67px'" />
              <img v-else :src="imgSrc+'?imageMogr2/thumbnail/!75p&imageMogr2/gravity/Center/crop/300x300'"> -->
            </div>
          </div>

          <div class="fourth">
            <div class="fourth_time"><span v-if="item.className">{{item.className}}</span></div>
            <!-- <div class="fourth_time"><span v-if="item.className">{{item.className}}</span></div> -->
            <!-- <div v-if="isShare"> -->
            <div>
              <div class="fourth_message" @click="messageBtn(item,index, '#my'+item.shareId)">
                <div>
                  <i class="iconfont icon-liuyan"></i>
                </div>
                <div>{{item.commentNum || '0'}}</div>
              </div>
              <div class="fourth_praise">
                <div @click="praiseBtn(item)">
                  <!-- <i
                    class="iconfont icon-dianzan"
                    :class="{'on':item.starState}"
                    @click="praiseBtn(item)"
                  ></i> -->
                  <img v-if="item.starState" src="../../../assets/images/zan_+icon@2x(1).png" alt="赞">
                  <img v-else src="../../../assets/images/zan_icon@2x.png" alt="赞">
                </div>
                <router-link
                  :to="{path:'/starList',query: {id: item.shareId}}"
                  tag="div"
                >{{item.stars || '0'}}</router-link>
                <!-- <div @click="getStarList(item.shareId)">{{item.stars || '0'}}</div> -->
              </div>
            </div>
            <!-- <div v-else class="fourth_message" :class="{'on':!isShare}">回复</div> -->
          </div>
          <!-- 评论 -->
          <div class="fifth" style="margin-top:10px" v-if="item.list.length" @click="getIndex(index)">
            <moreCom @commit="commit" :id="item.shareId" :list="item.list" :LSuserId="LSuserId"></moreCom>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moreCom from "./moreCom";
import Ls from "@/config/storage";
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
    },
    isD: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      isShare: true,
      LSuserId: "",
      defaultHeadImg: 'this.src="'+ require('../../../assets/images/default.png') +'"'
    };
  },
  created() {
    this.isShare = false;
    if (this.$route.query.share) {
      this.isShare = true;
    }
    // 获取userId
    this.LSuserId = Ls.getItem("userId");
  },
  components: {
    moreCom
  },
  methods: {
    getId(id) {
      return "my" + id;
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
      // $("#texta").focus()
      // this.showText = true;
    },
    // 删除分享
    deleteShare(id) {
      this.$emit("deleteShare", id);
    },
    praiseBtn(item) {
      this.$bridge.callhandler("changeTitle", {title: '点赞列表'}, data => {
        // vm.ddd = data;
        // 处理返回数据
      });
      if (Ls.getItem("userId") == item.userId) {
        let shareId = item.shareId+'';
        let shareType = this.type+'';
        console.log(shareId);
        console.log(shareType);
        console.log(typeof shareId);
        console.log(typeof shareType);
        this.$bridge.callhandler("zanList", { id: shareId, shareType: shareType }, data => {
          // vm.ddd = data;
          // 处理返回数据
        });
        // this.$router.push({
        //   path: "/zan",
        //   query: { id: item.shareId, shareType: this.type }
        // });
        return false;
      }
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
    },
    goDet(id) {
      id += '';
      // let idString = String(id);
      // console.log(idString);
      this.$bridge.callhandler(
        "goDet",
        { id: id },
        data => {
          // vm.ddd = data;

          // 处理返回数据
        }
      );
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
  padding: 0 15px;
  box-sizing: border-box;
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

    .fourth {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // height: 2.8125rem;
      // line-height: 2.8125rem;
      overflow: hidden;
      color: #c1c1c1;
      .fourth_time {
        float: left;
        font-size: 0.75rem;
      }
      .fourth_praise {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        float: right;
        font-size: 0.75rem;
        margin-right: 1.9875rem;
        .iconfont {
          font-size: 20px;
          color: #c1c1c1;
          &.on {
            color: #DB2809;
          }
        }
        img {
          height: 1.125rem;
          width: 1.125rem;
          // margin-top: 0.78125rem;
        }
        & > div {
          float: left;
          padding-right: 0.3125rem;
        }
      }
      .fourth_message {
        display: flex;
        justify-content: flex-start;
        align-items: center;
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