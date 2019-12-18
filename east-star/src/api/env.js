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
  apifuture = 'http://1.119.2.66:8995/yys'//测试环境(端口换成8086也可以访问，但是测试环境必须是8995，不然跨域)
  // apifuture = 'http://h5.yys.o-star.cc/yys'//生产环境

}

export {
  apifuture
}
