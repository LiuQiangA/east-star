<template>
  <div>
    <!-- <div class="top">
      <i class="iconfont icon-fanhui" @click="back"></i>
      点赞列表
      <span class="share">
        <i class="iconfont icon-gengduo"></i>
      </span>
    </div> -->
    <div v-if="!empty">
      <ul class="zan-ul">
        <li class="zan-item" v-for="item in user" :key="item.id">
          <img class="img-head" :src="item.userImage" alt="头像" />
          <span class="name">{{item.userName}}</span>
          <!-- <span class="date">11:18</span> -->
        </li>
      </ul>
    </div>
    <div v-else class="empty">暂无内容</div>
  </div>
</template>

<script>
export default {
  name: "zan",
  data() {
    return {
      empty: false,
      user: []
    };
  },
  created() {
    this.getStarList();
  },
  methods: {
    back() {
      this.$router.go("-1");
    },
    getStarList() {
      this.$fetch
        .getStarList({
          pageNo: 1,
          pageSize: 100,
          classRingId: this.$route.query.id,
          shareType: this.$route.query.shareType
        })
        .then(res => {
          console.log(res);
          this.user = res.data.user;
          if (JSON.stringify(this.user) == "" || JSON.stringify(this.user) == "null") {
            this.empty = true;
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.empty {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: #888;
}
.zan-ul {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 15px;
  .zan-item {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #e2e2e2;
    padding: 10px 0;
    position: relative;
    .img-head {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      display: inline-block;
    }
    .name {
      font-size: 16px;
      color: #31445a;
      margin-left: 15px;
    }
    .date {
      position: absolute;
      right: 0;
      font-size: 12px;
      color: #c1c1c1;
    }
  }
}
.top {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #31445a;
  box-shadow: 0px 3px 12px 0px rgba(199, 199, 199, 0.5);
  font-size: 20px;
  .share {
    font-size: 14px;
    opacity: 0;
    position: relative;
    z-index: -1;
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
</style>


