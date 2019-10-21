<template>
  <div class="system-layout">
    <router-view></router-view>
    <preview :isShow="isPreview" :index="index" :list="list" @close="close"></preview>
  </div>
</template>
<script>
import "@/config/rem";

import preview from "@/components/preview";
import { mapState } from "vuex";
export default {
  name: "layout",
  data() {
    return {
      // isShow: false,
      // list: [],
      // index: 0
    };
  },
  computed: {
    // isPreview() {
    //   return this.$store.state.isPreview;
    // },
    ...mapState([
      'isPreview',
      'index',
      'list'
    ])
  },
  components: {
    preview
  },
  methods: {
    close() {
      this.$store.commit("changePre");
    }
  }
};
</script> 
<style scoped lang='less'>
.system-layout {
  height: 100%;
  // overflow: hidden;
}
</style>