import Ls from './storage'
import global from './global'
export function iOS() {
  /* 获取窗口滚动条高度 */
  function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  };
  // 判断当前环境是iOS还是安卓
  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //安卓终端
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  var oldScrollTop = getScrollTop() || 0; // 记录当前滚动位置
  var scrollTop // 记录软键盘弹起时候滚动位置


  // window.οnresize = function () {
  //   //键盘弹起与隐藏都会引起窗口的高度发生变化
  //   var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
  //   if (resizeHeight - 0 < originalHeight - 0) {
  //     //当软键盘弹起，在此处操作
  //     console.log("安卓弹起")
  //     $(".commitCont").css("bottom", "266px")
  //     // $(".commitCont").css("position", "relative")
  //     // $(".commitCont").css("z-index", "99")
  //   } else {
  //     //当软键盘收起，在此处操作
  //     console.log("安卓收起")
  //     $(".commitCont").css("bottom", "0")
  //     // $(".commitCont").css("position", "absolute")
  //     // $(".commitCont").css("z-index", "-9999")
  //   }
  // }


  document.body.addEventListener('focusin', () => { //软键盘弹起事件
    console.log("键盘弹起");
    if (isAndroid) {
      console.log("安卓");
      $(".commitCont").css("bottom", "266")
      // $(".commitCont").css("position", "fixed")
      // $(".commitCont").css("opacity", "1");
      window.onscroll = function () {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        console.log("滚动距离" + scrollTop);
        setTimeout(() => {
          $(".commitCont").css("bottom", scrollTop + "px")
          // $(".commitCont").css("opacity", "1");
        }, 20);
        let a = document.querySelector(Ls.getItem("elementId"));
        global.my_scroll.scrollToElement(a, 500, 0, -scrollTop);
      }
    } else if (isIOS) {
      console.log("iOS");
      window.onscroll = function () {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        console.log("滚动距离" + scrollTop);
        setTimeout(() => {
          $(".top").css("top",scrollTop); // 详情页固定头部
          // $(".commitCont").css("bottom", "20px")
          // $(".commitCont").css("opacity", "1");
        }, 20);
        let a = document.querySelector(Ls.getItem("elementId"));
        global.my_scroll.scrollToElement(a, 500, 0, -scrollTop);
      }
    }
  });
  document.body.addEventListener('focusout', () => { //软键盘关闭事件
    setTimeout(() => {
      console.log("键盘收起");
      if(isIOS){
        $(".top").css("top",-scrollTop); // 详情页固定头部
      }
      var ua = window.navigator.userAgent;
      if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0) { //键盘收起页面空白问题
        document.body.scrollTop = oldScrollTop;
        document.documentElement.scrollTop = oldScrollTop;
      }
    }, 50)
    let a = document.querySelector(Ls.getItem("elementId"));
    global.my_scroll.scrollToElement(a, 500, 0, scrollTop);
  });
}
