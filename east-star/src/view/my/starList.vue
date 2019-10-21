<template>
  <div class="warper-content" ref="warper">
    <div class="content">
      <ul>
        <li v-for="item in starList" :key="item.id">
          <img
            class="zan-head-img"
            :src="item.userImage || '../../assets/images/default.png'"
            alt="头像"
          >
          <span class="name">{{item.userName || item.mobile}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "starList",
  data() {
    return {
      starList: []
    };
  },
  created() {
    this.getStarList();
  },
  mounted() {
    this.scroll = new this.$BScroll(this.$refs.warper, {
      click: true
    });
  },
  methods: {
    getStarList() {
      this.$fetch
        .getStarList({
          classRingId: this.$route.query.id,
          pageNo: 1,
          pageSize: 100
        })
        .then(res => {
          this.starList = res.data.user;
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.warper-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .content {
    width: 100%;
    padding: 1.25rem 1.875rem;
    box-sizing: border-box;
    li {
      width: 100%;
      display: flex;
      align-items: center;
      padding: .625rem 0;
      border-bottom: 1px solid #e2e2e2;
      .zan-head-img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: inline-block;
      }
      .name{
        margin-left: .9375rem;
        font-size: 1rem;
        color: #31445A;
      }
    }
  }
}
</style>

