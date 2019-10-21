<template>
  <div></div>
</template>

<script>
import Ls from "@/config/storage"
export default {
  name: "clear",
  mounted() {
    const vm = this;
    this.$bridge.registerhandler("clearLs", (data, responseCallback) => {
      console.log("清楚缓存")
      Ls.clear();
      alert("清楚完成")
    });
  },
}
</script>

