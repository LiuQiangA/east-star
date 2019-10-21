/**
 * Created by liuqiang on 2019/04/29
 * 配置编译环境和线上环境之间的切换
 *
 */

//后台
let apifuture = ''

if (process.env.NODE_ENV == 'development') {
  //开发
  apifuture = 'apifuture'

} else if (process.env.NODE_ENV == 'production') {
  //生产
  apifuture = 'http://h5.yys.o-star.cc/yys'
  // apifuture = 'apifuture'

}

export {
  apifuture
}
