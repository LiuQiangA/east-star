/**
 * Created by liuqiang on 2019/04/29
 *
 * 数据请求统一封装
 */

//导入模块
import axios from 'axios'
import Ls from "@/config/storage"
import router from '@/router'
import Bridge from "@/config/bridge.js"
/*import store from '@/store'*/

/*import {
  Message
} from 'element-ui'*/
import {
  Toast,
  Indicator
} from 'mint-ui'
import {
  apifuture
} from './env'

export default function fetch(options) {
  return new Promise((resolve, reject) => {
    Indicator.open({
      // text: '加载中...',
      spinnerType: 'fading-circle'
    });
    //处理请求接口
    options.baseURL = apifuture
    // console.log(options.baseURL)
    axios({
      method: "POST",
      headers: {
        "userId": options.userId || '', // 当前登录用户ID(未登录传空)
        "auth": options.auth || '' // 当前登录用户Auth(未登录传空)
      },
      url: `${options.baseURL}${options.url}`,
      data: options.params
    }).then(res => {
      console.log("suc")
      // console.log(res)
      if (res.data.response.state === "True") {
        resolve(res.data)
        Indicator.close();
      } else {
        // if(res.data.data.error == "登陆失效，请重新登陆"){
          Ls.clear();
          // router.replace({
          //   path: '/login',
          //   // query: {
          //   //   redirect: router.currentRoute.fullPath
          //   // }
          // });
          Bridge.callhandler(
            "checkLogin",
            { isLogin: false },
            data => {
              // 处理返回数据
            }
          );
        // }
        Indicator.close();
        // Toast({
        //   message: res.data.data.error,
        //   position: "bottom",
        //   duration: 1500
        // });
        reject(res.data)
      }
    }).catch(error => {
      console.log("err")
      // console.log(error)
      Indicator.close();
      Toast({
        message: "请求异常" + error,
        position: "bottom",
        duration: 1500
      });
      reject(error);
    })

  })
}
