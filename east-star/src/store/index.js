import Vue from 'vue'

import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    isPreview: false,
    index: 0,
    list: [],
    scrollTop: 0,
    dataList: []
  },
  getters: {
    doneGet: state => {
      state.dataList.forEach((item,index) => {
        let img = new Image();
        // 后台图片的src
        img.src = item.pictures[0];
        // if(item.pictures.length>1) return false;
        if (item.pictures.length == 1) {
          // img.onload = function () {
            // 打印
            console.log("width:" + img.width + ",height:" + img.height, "index"+index);
            console.log(img.width ,img.height);
            if (img.width > img.height) {
              item.imgW = true;
              item.imgH = false;
            } else {
              item.imgW = false;
              item.imgH = true;
            }
            item.b = 1;
            console.log(item,"9")
          // };
        } else {
          item.a = 1
        }
      });
      console.log("doneGet")
      console.log(state.dataList)
      return state.dataList;
    }
  },
  mutations: {
    changePre(state) {
      state.isPreview = !state.isPreview
    },
    changeIndex(state, index) {
      state.index = index
    },
    changeList(state, list) {
      state.list = list
    },
    recordScroll(state, n) {
      state.scrollTop = n
    },
    dataUpdate(state, n) {
      console.log("dataUpdate")
      this.state.dataList = this.state.dataList.concat(n)
    }
  }
})
