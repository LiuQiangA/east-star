export const Net = {
  data() {
    return {
      haveNet: true,
    }
  },
  created() {
    let that = this;
    window.ononline = function () {
      that.haveNet = true;
    }
    window.onoffline = function () {
      that.haveNet = false;
    }
  },
}
